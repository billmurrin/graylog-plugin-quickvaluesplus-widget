import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Button, DropdownButton} from 'react-bootstrap';
import Reflux from 'reflux';

import QuickValuesPlusVisualization from 'components/QuickValuesPlusVisualization';
import AddToDashboardMenu from 'components/dashboard/AddToDashboardMenu';
import Spinner from 'components/common/Spinner';
import StringUtils from 'util/StringUtils';
import UIUtils from 'util/UIUtils';

import StoreProvider from 'injection/StoreProvider';
import { QuickValuesPlusActions, QuickValuesPlusStore } from  'stores/QuickValuesPlusStore';

const RefreshStore = StoreProvider.getStore('Refresh');

const FieldQuickValuesPlus = React.createClass({
    propTypes: {
        permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    },
    mixins: [
        Reflux.connect(QuickValuesPlusStore),
        Reflux.listenTo(RefreshStore, '_setupTimer', '_setupTimer')
    ],
    getInitialState() {
        return {
            field: undefined,
            data: [],
        };
    },

    componentWillMount() {
        this.setState({quickValuesOptions: {top_values: 5, sort_order: "descending", table_size: 50, show_pie_chart: true, show_data_table: true}});
    },
    componentDidMount() {
        console.log("This QValues" + this.state.quickValuesOptions);
        this._loadQuickValuesData();
    },
    componentDidUpdate(oldProps, oldState) {
        console.log("Old Props");
        console.log(oldState);
        if (this.state.field !== oldState.field) {
            const element = ReactDOM.findDOMNode(this);
            UIUtils.scrollToHint(element);
        }
    },

    componentWillReceiveProps(nextProps) {
        // Reload values when executed search changes
        console.log("Next Props");
        console.log(nextProps);
        if (this.props.query !== nextProps.query ||
            this.props.rangeType !== nextProps.rangeType ||
            JSON.stringify(this.props.rangeParams) !== JSON.stringify(nextProps.rangeParams) ||
            this.props.stream !== nextProps.stream ||
            nextProps.forceFetch) {
            this._loadQuickValuesData();
        }
    },

    componentWillUnmount() {
        this._stopTimer();
    },

    WIDGET_TYPE: 'org.graylog.plugins.quickvaluesplus.widget.strategy.QuickValuesPlusWidgetStrategy',

    _setupTimer(refresh) {
        this._stopTimer();
        if (refresh.enabled) {
            this.timer = setInterval(this._loadQuickValuesData, refresh.interval);
        }
    },
    _stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    addField(field) {
        this.setState({field: field}, () => this._loadQuickValuesData(false));
    },
    _loadQuickValuesData() {
        console.log("Loading quick values");
        if (this.state.field !== undefined) {
            this.setState({loadPending: true});
            const promise = QuickValuesPlusActions.getQuickValues(this.state.field);
            promise.then((data) => this.setState({data: data, loadPending: false}));
        }
    },
    _resetStatus() {
        this.setState(this.getInitialState());
    },
    sortordermenu: ['ascending', 'descending'],
    topvaluesmenu: ['5','10','15','20','25'],
    tablesizemenu: ['10','15','20','25','50','75','100'],

    _submenuItemClassName(configKey, value) {
        console.log(this.state.quickValuesOptions.toString());
        console.log("Subclass: Config key is " + configKey);
        console.log("Subclass: Config key value " + this.state.quickValuesOptions[configKey] + ", Value is " + value);
        return this.state.quickValuesOptions[configKey] === value ? 'selected' : '';
    },

    _getSubmenu(configKey, values) {
        const submenuItems = values.map((value) => {
            const readableName = value;
            return (
                <li key={`menu-item-${value}`}>
                    <a href="#" className={this._submenuItemClassName(configKey, value)} data-type={value}>
                        {StringUtils.capitalizeFirstLetter(readableName)}
                    </a>
                </li>
            );
        });

        return <ul className={`dropdown-menu ${configKey}-selector`}>{submenuItems}</ul>;
    },
    render() {
        let content;
        let inner;

        const submenus = [
            <li key="sort_order-submenu" className="dropdown-submenu left-submenu">
                <a href="#">Sort Order</a>
                {this._getSubmenu('sort_order', this.sortordermenu)}
            </li>,
            <li key="top_values-submenu" className="dropdown-submenu left-submenu">
                <a href="#">Top Values</a>
                {this._getSubmenu('top_values', this.topvaluesmenu)}
            </li>,
            <li key="table_size-submenu" className="dropdown-submenu left-submenu">
                <a href="#">Top Values</a>
                {this._getSubmenu('table_size', this.tablesizemenu)}
            </li>,
        ];

        if (this.state.data.length === 0) {
            inner = <Spinner />;
        } else {
            inner = (
                <QuickValuesPlusVisualization id={this.state.field}
                                          config={this.state.quickValuesOptions}
                                          data={this.state.data}
                                          horizontal
                                          displayAddToSearchButton
                                          displayRemoveFromSearchButton
                                          displayAnalysisInformation/>
            );
        }

        if (this.state.field !== undefined) {
            content = (
                <div className="content-col">
                    <div className="pull-right">
                        <AddToDashboardMenu title="Add to dashboard"
                                            widgetType={this.WIDGET_TYPE}
                                            configuration={{field: this.state.field}}
                                            bsStyle="default"
                                            pullRight
                                            permissions={this.props.permissions}>
                            <Button bsSize="small" onClick={() => this._resetStatus()}>Dismiss</Button>
                            <DropdownButton bsSize="small" className="quickvalues-settings" title="Customize" id="customize-quick-values-plus-dropdown">
                                {submenus}
                            </DropdownButton>
                        </AddToDashboardMenu>
                    </div>
                    <h1>Quick Values for {this.state.field} {this.state.loadPending && <i
                        className="fa fa-spin fa-spinner"></i>}</h1>

                    <div style={{maxHeight: 400, overflow: 'auto', marginTop: 10}}>{inner}</div>
                </div>
            );
        }
        return <div id="field-quick-values">{content}</div>;
    },
});

export default FieldQuickValuesPlus;