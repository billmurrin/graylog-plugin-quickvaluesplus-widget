import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button, Panel, ListGroup, ListGroupItem, LinkContainer } from 'react-bootstrap';
import crossfilter from 'crossfilter';
import dc from 'dc';
import d3 from 'd3';
import deepEqual from 'deep-equal';
import Reflux from 'reflux';
import $ from 'jquery';
global.jQuery = $;
require('bootstrap/js/tooltip');

const D3Utils = require('util/D3Utils');
const StringUtils = require('util/StringUtils');
import NumberUtils from 'util/NumberUtils';

import PermissionsMixin from 'util/PermissionsMixin';
import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const WidgetsStore = StoreProvider.getStore('Widgets');
const SearchStore = StoreProvider.getStore('Search');
import Routes from 'routing/Routes';

const QuickValuesPlusVisualization = React.createClass({
    mixins: [Reflux.connect(CurrentUserStore), PermissionsMixin],
    propTypes: {
        id: PropTypes.string,
        config: PropTypes.object,
        widget: PropTypes.object,
        height: PropTypes.any,
        horizontal: PropTypes.bool,
        displayAddToSearchButton: PropTypes.bool,
        displayRemoveFromSearchButton: PropTypes.bool,
        displayAnalysisInformation: PropTypes.bool,
    },
    getDefaultProps() {
        return {
            displayAddToSearchButton: false,
            displayRemoveFromSearchButton: false,
        }
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
        this.exclude_search_hidden = false;
        this.new_window_hidden = false;

        return {
            total: undefined,
            others: undefined,
            missing: undefined,
            terms: Immutable.List(),
        };
    },
    componentDidMount() {
        if (this.props.config.dashboardID) {
            this.setState({
                currentConfig: {
                    dashboardID: this.props.config.dashboardID,
                    field: this.props.config.field,
                    query: this.props.config.query,
                    show_data_table: this.props.config.show_data_table,
                    show_pie_chart: this.props.config.show_pie_chart,
                    sort_order: this.props.config.sort_order,
                    stream_id: this.props.config.stream_id,
                    table_size: this.props.config.table_size,
                    timerange: this.props.config.timerange,
                    top_values: this.props.config.top_values,
                    display_term_hyperlinks: this.props.config.display_term_hyperlinks,
                    display_exclude_from_query_button: this.props.config.display_exclude_from_query_button,
                    display_get_term_reply_in_new_window_button: this.props.config.display_get_term_reply_in_new_window_button
                }
            });

            this.setState({exclude_search_hidden: this.props.config.display_exclude_from_query_button});
            this.setState({new_window_hidden: this.props.config.display_get_term_reply_in_new_window_button});
        } else {
            this.setState({
                currentConfig: {
                    show_data_table: this.props.config.show_data_table,
                    show_pie_chart: this.props.config.show_pie_chart,
                    sort_order: this.props.config.sort_order,
                    table_size: this.props.config.table_size,
                    top_values: this.props.config.top_values,
                    display_add_to_search_button: this.props.config.display_add_to_search_button,
                    display_remove_from_search_button: this.props.config.display_remove_from_search_button,
                    display_term_hyperlinks: this.props.config.display_term_hyperlinks,
                    display_exclude_from_query_button: this.props.config.display_exclude_from_query_button,
                    display_get_term_reply_in_new_window_button: this.props.config.display_get_term_reply_in_new_window_button,
                }
            });
        }

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
        this.setState({exclude_search_hidden: nextProps.config.display_exclude_from_query_button});
        this._resizeVisualization(nextProps.width, nextProps.height, nextProps.config.show_data_table);
        this._formatProps(nextProps);

        if (!deepEqual(this.state.currentConfig, nextProps.config)) {
            if (this.props.config.dashboardID) {
                this.setState({currentConfig: {
                        dashboardID: nextProps.config.dashboardID,
                        field: nextProps.config.field,
                        query: nextProps.config.query,
                        show_data_table: nextProps.config.show_data_table,
                        show_pie_chart: nextProps.config.show_pie_chart,
                        sort_order: nextProps.config.sort_order,
                        stream_id: nextProps.config.stream_id,
                        table_size: nextProps.config.table_size,
                        timerange: nextProps.config.timerange,
                        top_values: nextProps.config.top_values,
                        display_term_hyperlinks: nextProps.config.display_term_hyperlinks,
                        display_exclude_from_query_button: nextProps.config.display_exclude_from_query_button,
                        display_get_term_reply_in_new_window_button: nextProps.config.display_get_term_reply_in_new_window_button
                    }
                });
                this.setState({exclude_search_hidden: nextProps.config.display_exclude_from_query_button});
                this.setState({new_window_hidden: nextProps.config.display_get_term_reply_in_new_window_button});
            } else {
                this.setState({currentConfig: {
                        show_data_table: nextProps.config.show_data_table,
                        show_pie_chart: nextProps.config.show_pie_chart,
                        sort_order: nextProps.config.sort_order,
                        table_size: nextProps.config.table_size,
                        top_values: nextProps.config.top_values,
                        display_add_to_search_button: nextProps.config.display_add_to_search_button,
                        display_remove_from_search_button: nextProps.config.display_remove_from_search_button,
                        display_term_hyperlinks: nextProps.config.display_term_hyperlinks,
                        display_exclude_from_query_button: nextProps.config.display_exclude_from_query_button,
                        display_get_term_reply_in_new_window_button: nextProps.config.display_get_term_reply_in_new_window_button,
                    }
                });
            }

            this._renderDataTable();
            this._renderPieChart();
        }
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

    _getTermReplyInNewWindowButton(replayURL) {
        const replaySearchButton = document.createElement('a');
        replaySearchButton.id = 'addNewWindowTermReplay';
        replaySearchButton.className = 'btn btn-xs btn-default';
        replaySearchButton.title = 'Open Related Search In New Window';
        replaySearchButton.setAttribute('href', replayURL);
        replaySearchButton.setAttribute('target', '_blank');
        replaySearchButton.innerHTML = "<i class='fa fa-external-link'></i>";
        return replaySearchButton.outerHTML;
    },
    escape(searchTerm) {
        var escapedTerm = String(searchTerm);

        // Replace newlines.
        escapedTerm = escapedTerm.replace(/\r\n/g, " ");
        escapedTerm = escapedTerm.replace(/\n/g, " ");
        escapedTerm = escapedTerm.replace(/<br>/g, " ");

        // Escape all lucene special characters from the source: && || : \ / + - ! ( ) { } [ ] ^ " ~ * ?
        escapedTerm = String(escapedTerm).replace(/(&&|\|\||[\:\\\/\+\-\!\(\)\{\}\[\]\^\"\~\*\?])/g, "\\$&");

        if (/\s/g.test(escapedTerm)) {
            escapedTerm = '"' + escapedTerm + '"';
        }

        return escapedTerm;
    },
    _excludeQueryClick(term) {
        let escTerm = this.escape(term);
        let newquery = (this.props.config.query == "") ? "!" + this.props.config.field + ":" + escTerm : this.props.config.query + " AND !" + this.props.config.field + ":" + escTerm;

        const config = this.props.config;
        config.query = newquery;
        let widget = {};
        // First, let's load the widget
        const loadWidgetPromise = WidgetsStore.loadWidget(this.props.config.dashboardID, this.props.id);
        loadWidgetPromise.then(
            response => {
                widget = response;
                widget['config'] = config;
                delete widget.creator_user_id;
                const updateWidgetPromise = WidgetsStore.updateWidget(this.props.config.dashboardID, widget);
                updateWidgetPromise.done();
            });
    },
    _getExcludeFromQueryButton(term) {
        const excludeFromQueryButton = document.createElement('button');
        excludeFromQueryButton.id = 'excludeTermFromQuery';
        excludeFromQueryButton.className = 'btn btn-xs btn-default';
        excludeFromQueryButton.title = 'Exclude term from search query';
        excludeFromQueryButton.setAttribute('data-term', StringUtils.unescapeHTML(term));
        excludeFromQueryButton.innerHTML = "<i class='fa fa-search-minus'></i>";

        return excludeFromQueryButton.outerHTML;

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
    _getTimeRange() {
        const config = this.props.config;
        const rangeType = config.timerange.type;

        const timeRange = {
            rangetype: rangeType,
        };
        switch (rangeType) {
            case 'relative':
                timeRange[rangeType] = config.timerange.range;
                break;
            case 'absolute':
                timeRange.from = config.timerange.from;
                timeRange.to = config.timerange.to;
                break;
            case 'keyword':
                timeRange[rangeType] = config.timerange.keyword;
                break;
            default:
            // do nothing
        }

        return timeRange;
    },
    _getDataTableColumns() {
        const columns = [
            (d) => {
                let colourBadge = '';

                if (typeof this.pieChart !== 'undefined' && this.dataTable.group()(d) !== 'Others') {
                    const colour = this.pieChart.colors()(d.term);
                    colourBadge = `<span class="datatable-badge" style="background-color: ${colour}"></span>`;
                }

                if (this.props.config.field && this.props.config.display_term_hyperlinks) {
                    //Properly format strings containing spaces, backslashes and colons.
                    let escTerm = this.escape(`${d.term}`);
                    let appendQuery = (this.props.config.query == "") ? this.props.config.field + ":" + escTerm : this.props.config.query + " AND " + this.props.config.field + ":" + escTerm;
                    let replayURL = (this.props.config.stream_id == undefined) ? Routes.search(appendQuery, this._getTimeRange(), this.props.config.interval) : Routes.stream_search(this.props.config.stream_id, appendQuery, this._getTimeRange(), this.props.config.interval);

                    return `${colourBadge} <a href="${replayURL}">${d.term}</a>`;
                }
                else
                {
                    return `${colourBadge} ${d.term}`;
                }

            },
            (d) => {
                return NumberUtils.formatPercentage(d.percentage);
            },
            (d) => NumberUtils.formatNumber(d.count),
        ];

        if (!this.props.config.dashboardID) {
            if (this.props.config.display_add_to_search_button) {
                columns.push((d) => this._getAddToSearchButton(d.term));
            }

            if (this.props.config.display_remove_from_search_button) {
                columns.push((d) => this._getRemoveFromSearchButton(d.term));
            }
        } else {
            if (this.isPermitted(this.state.currentUser.permissions, [`dashboards:edit:${this.props.config.dashboardID}`])) {
                columns.push((d) => this._getExcludeFromQueryButton(d.term));
            }

            columns.push((d) => {
                //Properly format strings containing spaces, backslashes and colons.
                let escTerm = this.escape(`${d.term}`);
                let appendQuery = (this.props.config.query == "") ? this.props.config.field + ":" + escTerm : this.props.config.query + " AND " + this.props.config.field + ":" + escTerm;
                let replayURL = (this.props.config.stream_id == undefined) ? Routes.search(appendQuery, this._getTimeRange(), this.props.config.interval) : Routes.stream_search(this.props.config.stream_id, appendQuery, this._getTimeRange(), this.props.config.interval);
                return this._getTermReplyInNewWindowButton(replayURL);
            });
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

                    if (this.props.config.dashboardID) {
                        let query_hidden = this.state.exclude_search_hidden ? null : 'none';
                        table.selectAll('td.dc-table-column._3').style("display", function(x){
                            return query_hidden;
                        });

                        let new_window_hidden = this.state.new_window_hidden ? null : 'none';
                        table.selectAll('td.dc-table-column._4').style("display", function(x){
                            return new_window_hidden;
                        });
                    }
                    table.selectAll('td.dc-table-column button#excludeTermFromQuery').on('click', () => {
                        if (this.isPermitted(this.state.currentUser.permissions, [`dashboards:edit:${this.props.config.dashboardID}`])) {
                            const term = $(d3.event.target).closest('button').data('term');
                            this._excludeQueryClick(term);
                        }
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

                    if (this.props.config.dashboardID) {
                        let query_hidden = this.state.exclude_search_hidden ? null : 'none';
                        table.selectAll('td.dc-table-column._3').style("display", function(x){
                            return query_hidden;
                        });

                        let new_window_hidden = this.state.new_window_hidden ? null : 'none';
                        table.selectAll('td.dc-table-column._4').style("display", function(x){
                            return new_window_hidden;
                        });
                    }

                    table.selectAll('td.dc-table-column button#excludeTermFromQuery').on('click', () => {
                        // noinspection Eslint
                        const term = $(d3.event.target).closest('button').data('term');
                        this._excludeQueryClick(term);
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
        if (!this.props.config.show_pie_chart) {
            dataTableClassName = 'col-md-12';
        } else if (this.props.config.show_pie_chart && !this.props.config.show_data_table) {
            dataTableClassName = 'hidden';
        } else if(this.props.config.show_pie_chart && this.props.config.show_data_table) {
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

        let excludeQueryButton;
        if (this.props.config.dashboardID) {
            if (this.isPermitted(this.state.currentUser.permissions, [`dashboards:edit:${this.props.config.dashboardID}`])) {
                excludeQueryButton = (
                    <th style={{ width: 27 }}>&nbsp;</th>
                );
            } else {
                excludeQueryButton = '';
            }
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
                          <th style={{ width: 'auto' }}>Value</th>
                          <th style={{ width: 58, alignItems: 'center' }}>%</th>
                          <th style={{ width: 50, alignItems: 'center' }}>#</th>
                            {!this.props.config.dashboardID && this.props.config.display_add_to_search_button &&
                            <th style={{ width: 30 }}>&nbsp;</th>
                            }
                            {!this.props.config.dashboardID && this.props.config.display_remove_from_search_button &&
                            <th style={{ width: 30 }}>&nbsp;</th>
                            }
                            {this.props.config.dashboardID && this.state.exclude_search_hidden &&
                            excludeQueryButton}
                            {this.props.config.dashboardID && this.props.config.field && this.state.new_window_hidden &&
                            <th style={{ width: 27 }}>&nbsp;</th>
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
