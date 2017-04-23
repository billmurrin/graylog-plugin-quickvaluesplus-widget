import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import crossfilter from 'crossfilter';
import dc from 'dc';
import d3 from 'd3';
import deepEqual from 'deep-equal';

const D3Utils = require('util/D3Utils');
const StringUtils = require('util/StringUtils');
import NumberUtils from 'util/NumberUtils';

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');

const QuickValuesPlusVisualization = React.createClass({
    propTypes: {
        id: PropTypes.string,
        config: PropTypes.object,
        width: PropTypes.any,
        height: PropTypes.any,
        horizontal: PropTypes.bool,
        displayAnalysisInformation: PropTypes.bool,
        displayAddToSearchButton: PropTypes.bool,
        displayRemoveFromSearchButton: PropTypes.bool,
    },
    getInitialState() {
        this.filters = [];
        this.triggerRender = true;
        this.shouldUpdateData = true;
        this.dcGroupName = `quickvalue-${this.props.id}`;
        this.quickValuesData = crossfilter();
        this.sortOrder = d3.descending;
        this.tableChanged = false;
        this.tableSize =  50;
        this.topValues = 5;
        this.dimension = this.quickValuesData.dimension((d) => d.term);
        this.group = this.dimension.group().reduceSum((d) => d.count);

        return {
            total: undefined,
            others: undefined,
            missing: undefined,
            terms: Immutable.List(),
        };
    },
    componentDidMount() {
        if (this.props.config.sort_order === "descending") {
            this.sortOrder = d3.descending;
        } else {
            this.sortOrder = d3.ascending;
        }
        this.tableChanged = false;
        this.tableSize =  this.props.config.table_size;
        this.topValues = this.props.config.top_values;
        this._resizeVisualization(this.props.width, this.props.height, this.props.config.show_data_table);
        this._formatProps(this.props);
        this._renderDataTable();
        this._renderPieChart();
    },
    componentWillReceiveProps(nextProps) {
        if (deepEqual(this.props, nextProps)) {
            return;
        }

        if (nextProps.config.sort_order === "descending") {
            this.sortOrder = d3.descending;
            this.props.config.sort_order = "descending";
        } else {
            this.sortOrder = d3.ascending;
            this.props.config.sort_order = "ascending";
        }

        this.tableChanged = true;
        this.tableSize =  nextProps.config.table_size;
        this.topValues = nextProps.config.top_values;
        this._resizeVisualization(nextProps.width, nextProps.height, nextProps.config.show_data_table);
        this._formatProps(nextProps);
        this._renderDataTable();
        this._renderPieChart();
    },
    NUMBER_OF_TOP_VALUES: 10,
    DEFAULT_PIE_CHART_SIZE: 200,
    MARGIN_TOP: 15,

    _formatProps(newProps) {
        if (newProps.data) {
            const quickValues = newProps.data;

            const total = quickValues.total - quickValues.missing;

            const terms = Immutable.List(Immutable.Map(quickValues.terms).keys());

            const formattedTerms = terms.map((term) => {
                const count = quickValues.terms[term];
                return Immutable.Map({
                    term: StringUtils.escapeHTML(term),
                    count: count,
                    percentage: count / total,
                });
            });
            this.shouldUpdateData = (this.tableChanged) ? true : !formattedTerms.equals(this.state.terms);
            this.tableChanged = false;
            this.setState({
                total: quickValues.total,
                others: quickValues.other,
                missing: quickValues.missing,
                terms: formattedTerms,
            }, this.drawData);
        }
    },
    _getAddToSearchButton(term) {
        const addToSearchButton = document.createElement('button');
        addToSearchButton.id = 'addSearchTerm';
        addToSearchButton.className = 'btn btn-xs btn-default';
        addToSearchButton.title = 'Add to search query';
        addToSearchButton.setAttribute('data-term', StringUtils.unescapeHTML(term));
        addToSearchButton.innerHTML = "<i class='fa fa-search-plus'></i>";

        return addToSearchButton.outerHTML;
    },

    _getRemoveFromSearchButton(term) {
        const removeFromSearchButton = document.createElement('button');
        removeFromSearchButton.id = 'removeSearchTerm';
        removeFromSearchButton.className = 'btn btn-xs btn-default';
        removeFromSearchButton.title = 'Remove from search query';
        removeFromSearchButton.setAttribute('data-term', StringUtils.unescapeHTML(term));
        removeFromSearchButton.innerHTML = "<i class='fa fa-search-minus'></i>";

        return removeFromSearchButton.outerHTML;
    },

    _getDataTableColumns() {
        const columns = [
            (d) => {
                let colourBadge = '';

                if (typeof this.pieChart !== 'undefined' && this.dataTable.group()(d) !== 'Others') {
                    const colour = this.pieChart.colors()(d.term);
                    colourBadge = `<span class="datatable-badge" style="background-color: ${colour}"></span>`;
                }

                return `${colourBadge} ${d.term}`;
            },
            (d) => {
                return NumberUtils.formatPercentage(d.percentage);
            },
            (d) => NumberUtils.formatNumber(d.count),
        ];

        if (this.props.displayAddToSearchButton) {
            columns.push((d) => this._getAddToSearchButton(d.term));
        }

        if (this.props.displayRemoveFromSearchButton) {
            columns.push((d) => this._getRemoveFromSearchButton(d.term));
        }

        return columns;
    },
    _renderDataTable() {
        const tableDomNode = this.refs.table;

        this.dataTable = dc.dataTable(tableDomNode, this.dcGroupName);
        if (this.sortOrder == d3.descending){
            const descGroup = this._getTop(this.group);
            this.dataTable
                .dimension(this.dimension)
                .size(this.tableSize)
                .sortBy((d) => d.count)
                .order(d3.descending)
                .group((descGroup) => {
                    const topValues = this.group.top(this.topValues);
                    const dInTopValues = topValues.some((value) => descGroup.term.localeCompare(value.key) === 0);
                    return dInTopValues ? 'Top values' : 'Others';
                })
                .columns(this._getDataTableColumns())
                .on('renderlet', (table) => {
                    table.selectAll('.dc-table-group').classed('info', true);
                    table.selectAll('td.dc-table-column button#addSearchTerm').on('click', () => {
                        // noinspection Eslint
                        const term = $(d3.event.target).closest('button').data('term');
                        SearchStore.addSearchTerm(this.props.id, term);
                    });
                    table.selectAll('td.dc-table-column button#removeSearchTerm').on('click', () => {
                        // noinspection Eslint
                        const term = $(d3.event.target).closest('button').data('term');
                        SearchStore.addSearchTerm("!" + this.props.id, term);
                    });
                });

        } else {
            const ascGroup = this._getBottom(this.group);
            this.dataTable
                .dimension(this.dimension)
                .size(this.tableSize)
                .sortBy((d) => d.count)
                .order(d3.ascending)
                .group((ascGroup) => {
                    const bottomValues = this.group.top(Infinity).slice(-this.topValues).reverse();
                    const dInBottomValues = bottomValues.some((value) => ascGroup.term.localeCompare(value.key) === 0);
                    return dInBottomValues ? 'Bottom values' : 'Others';
                })
                .columns(this._getDataTableColumns())
                .on('renderlet', (table) => {
                    table.selectAll('.dc-table-group').classed('info', true);
                    table.selectAll('td.dc-table-column button#addSearchTerm').on('click', () => {
                        // noinspection Eslint
                        const term = $(d3.event.target).closest('button').data('term');
                        SearchStore.addSearchTerm(this.props.id, term);
                    });
                    table.selectAll('td.dc-table-column button#removeSearchTerm').on('click', () => {
                        // noinspection Eslint
                        const term = $(d3.event.target).closest('button').data('term');
                        SearchStore.addSearchTerm("!" + this.props.id, term);
                    });
                });
        }
        this.dataTable.render();
    },
    _renderPieChart() {
        const graphDomNode = this.refs.graph;

        this.pieChart = dc.pieChart(graphDomNode, this.dcGroupName);
        this.pieChart
            .dimension(this.dimension)
            .group(this.group)
            .othersGrouper((topRows) => {
                const chart = this.pieChart;
                const allRows = chart.group().all();
                const allKeys = allRows.map(chart.keyAccessor());
                const topKeys = topRows.map(chart.keyAccessor());
                const topSet = d3.set(topKeys);
                const topRowsSum = d3.sum(topRows, dc.pluck('value'));
                const otherCount = this.state.total - this.state.missing - topRowsSum;

                return topRows.concat([{ others: allKeys.filter((d) => !topSet.has(d)), key: 'Others', value: otherCount }]);
            })
            .renderLabel(false)
            .renderTitle(false)
            .slicesCap(this.topValues)
            .ordering((d) => d.value)
            .colors(D3Utils.glColourPalette());

        this._resizeVisualization(this.props.width, this.props.height, this.props.config.show_data_table);

        D3Utils.tooltipRenderlet(this.pieChart, 'g.pie-slice', this._formatGraphTooltip);

        // noinspection Eslint
        $(graphDomNode).tooltip({
            selector: '[rel="tooltip"]',
            container: 'body',
            placement: 'auto',
            delay: { show: 300, hide: 100 },
            html: true,
        });

        this.pieChart.render();
    },
    _getTop(source_group) {
        return {
            all: function () {
                return source_group.top(this.tableSize);
            }
        };
    },
    _getBottom(source_group) {
        return {
            all: function () {
                return source_group.bottom(this.tableSize);
            }
        };
    },
    _formatGraphTooltip(d) {
        const valueText = `${d.data.key}: ${NumberUtils.formatNumber(d.value)}`;

        return `<div class="datapoint-info">${valueText}</div>`;
    },
    _setPieChartSize(newSize) {
        this.pieChart
            .width(newSize)
            .height(newSize)
            .radius(newSize / 2 - 10);

        this.triggerRender = true;
    },
    _resizeVisualization(width, height, showDataTable) {
        let computedSize;

        if (this.props.config.show_pie_chart) {
            if (showDataTable) {
                computedSize = this.DEFAULT_PIE_CHART_SIZE;
            } else {
                computedSize = Math.min(width, height);
                computedSize -= this.MARGIN_TOP;
            }

            if (this.pieChart !== undefined && this.pieChart.width() !== computedSize) {
                this._setPieChartSize(computedSize);
            }
        }
    },
    _clearDataFilters() {
        if (this.pieChart !== undefined) {
            this.filters = this.pieChart.filters();
            this.pieChart.filterAll();
        }
    },
    _restoreDataFilters() {
        if (this.pieChart !== undefined) {
            this.filters.forEach((filter) => this.pieChart.filter(filter));
            this.filters = [];
        }
    },
    drawData() {
        if (this.shouldUpdateData) {
            this._clearDataFilters();
            this.quickValuesData.remove();
            this.quickValuesData.add(this.state.terms.toJS());
            this._restoreDataFilters();
            this.dataTable.redraw();
        }

        if (this.props.config.show_pie_chart) {
            if (this.triggerRender) {
                this.pieChart.render();
                this.triggerRender = false;
            } else {
                this.pieChart.redraw();
            }
        }
    },
    _getTotalMessagesWithField() {
        return this.state.total - this.state.missing;
    },
    _getAnalysisInformation() {
        const analysisInformation = [`Found <em>${NumberUtils.formatNumber(this._getTotalMessagesWithField())}</em> messages with this field`];

        if (this.state.missing !== 0) {
            let missingMessage = this.state.others === 0 ? ' and' : '';
            missingMessage += ` <em>${NumberUtils.formatNumber(this.state.missing)}</em> messages without it`;
            analysisInformation.push(missingMessage);
        }
        if (this.state.others !== 0) {
            analysisInformation.push(` and <em>${NumberUtils.formatNumber(this.state.others)}</em> other values`);
        }

        return <span dangerouslySetInnerHTML={{ __html: `${analysisInformation.join(',')}.` }}/>;
    },
    render() {
        let pieChartClassName;
        const pieChartStyle = {};

        if (this.props.config.show_pie_chart) {
            if (this.props.horizontal) {
                pieChartClassName = 'col-md-4';
                pieChartStyle.textAlign = 'center';
            } else {
                pieChartClassName = 'col-md-12';
            }
        } else {
            pieChartClassName = 'hidden';
        }

        let dataTableClassName;

      /*
       * Ensure we always render the data table when quickvalues config was created before introducing pie charts,
       * or when neither the data table or the pie chart are selected for rendering.
       */
        if (this.props.config.show_data_table || !this.props.config.show_pie_chart) {
            dataTableClassName = this.props.horizontal ? 'col-md-8' : 'col-md-12';
        } else {
            dataTableClassName = 'hidden';
        }

        let pieChart;
        if (this.props.displayAnalysisInformation) {
            pieChart = (
                <Panel>
                  <ListGroup fill>
                    <ListGroupItem>
                      <div ref="graph" className="quickvalues-graph"/>
                    </ListGroupItem>
                    <ListGroupItem>
                        {this._getAnalysisInformation()}
                    </ListGroupItem>
                  </ListGroup>
                </Panel>
            );
        } else {
            pieChart = <div ref="graph" className="quickvalues-graph"/>;
        }

        return (
            <div id={`visualization-${this.props.id}`} className="quickvalues-visualization"
                 style={{ height: this.props.height }}>
              <div className="container-fluid">
                <div className="row" style={{ marginBottom: 0 }}>
                  <div className={pieChartClassName} style={pieChartStyle}>
                      {pieChart}
                  </div>
                  <div className={dataTableClassName}>
                    <div className="quickvalues-table">
                      <table ref="table" className="table table-condensed table-hover">
                        <thead>
                        <tr>
                          <th style={{ width: '60%' }}>Value</th>
                          <th>%</th>
                          <th>Count</th>
                            {this.props.displayAddToSearchButton &&
                            <th style={{ width: 30 }}>&nbsp;</th>
                            }
                            {this.props.displayRemoveFromSearchButton &&
                            <th style={{ width: 30 }}>&nbsp;</th>
                            }
                        </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        );
    },
});

export default QuickValuesPlusVisualization;