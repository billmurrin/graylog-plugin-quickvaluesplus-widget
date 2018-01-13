import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Button, DropdownButton, MenuItem} from 'react-bootstrap';
import Reflux from 'reflux';

import QuickValuesPlusVisualization from 'components/QuickValuesPlusVisualization';
import AddToDashboardMenuRev from 'components/AddToDashboardMenuRev';
import Spinner from 'components/common/Spinner';
import StringUtils from 'util/StringUtils';
import UIUtils from 'util/UIUtils';
import StoreProvider from 'injection/StoreProvider';
import { QuickValuesPlusActions, QuickValuesPlusStore } from  'stores/QuickValuesPlusStore';
const ConfigurationsStore = StoreProvider.getStore('Configurations');
import ActionsProvider from 'injection/ActionsProvider';
const ConfigurationActions = ActionsProvider.getActions('Configuration');

import style from '!style/useable!css!./FieldQuickValuesPlus.css';

const RefreshStore = StoreProvider.getStore('Refresh');

const FieldQuickValuesPlus = React.createClass({
    propTypes: {
        permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
        dashboard_id: PropTypes.string,
    },
    mixins: [
        Reflux.connect(QuickValuesPlusStore),
        Reflux.listenTo(RefreshStore, '_setupTimer', '_setupTimer'),
        Reflux.connect(ConfigurationsStore)
    ],
    getInitialState() {
        return {
            field: undefined,
            dropdownIsOpen: false,
            loaded: false,
            data: [],
            defaults: {
                top_values: 5,
                sort_order: "descending",
                table_size: 25,
                show_pie_chart: true,
                show_data_table: true,
                display_add_to_search_button: true,
                display_remove_from_search_button: true,
                display_term_hyperlinks: true,
                display_exclude_from_query_button: true,
                display_get_term_reply_in_new_window_button: true
            },
            quickValuesOptions: {
                top_values: 5,
                sort_order: "descending",
                table_size: 25,
                show_pie_chart: true,
                show_data_table: true,
                display_add_to_search_button: true,
                display_remove_from_search_button: true,
                display_term_hyperlinks: true,
                display_exclude_from_query_button: true,
                display_get_term_reply_in_new_window_button: true}
        };
    },
    style: style,
    toggleDropdown() {
        this.setState({dropdownIsOpen: !this.state.dropdownIsOpen});
    },
    componentWillMount() {
        this.setState({ dropdownIsOpen: false });
        this.setState({quickValuesOptions: {
            top_values: 5,
            sort_order: "descending",
            table_size: 25,
            show_pie_chart: true,
            show_data_table: true,
            display_add_to_search_button: true,
            display_remove_from_search_button: true,
            display_term_hyperlinks: true,
            display_exclude_from_query_button: true,
            display_get_term_reply_in_new_window_button: true}
        });
    },

    componentDidMount() {
        ConfigurationActions.list("org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1");
        this.style.use();
        this._loadQuickValuesData();
    },
    componentDidUpdate(oldProps, oldState) {
        if (this.state.field !== oldState.field) {
            const element = ReactDOM.findDOMNode(this);
            UIUtils.scrollToHint(element);
        }

        if (this.refs.thedash !== undefined) {
            if (this.refs.thedash.state.saved) {
                this.refs.thedash.refs.widgetModal.setState({
                    config: {
                        top_values: this.state.quickValuesOptions['top_values'],
                        sort_order: this.state.quickValuesOptions['sort_order'],
                        table_size: this.state.quickValuesOptions['table_size'],
                        show_pie_chart: true,
                        show_data_table: true
                    }
                });
                this.refs.thedash.setState({saved: false})
            }
        }

    },

    componentWillReceiveProps(nextProps) {
        // Reload values when executed search changes
        if (this.props.query !== nextProps.query ||
            this.props.rangeType !== nextProps.rangeType ||
            JSON.stringify(this.props.rangeParams) !== JSON.stringify(nextProps.rangeParams) ||
            this.props.stream !== nextProps.stream ||
            nextProps.forceFetch) {
            this._loadQuickValuesData();
        }
    },

    componentWillUnmount() {
        this.style.unuse();
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
        if (!this.state.loaded) {
            if (this.state.configuration !== undefined) {
                this.setState({
                    quickValuesOptions: {
                        top_values: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].top_values,
                        sort_order: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].sort_order,
                        table_size: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].table_size,
                        show_pie_chart: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].show_pie_chart,
                        show_data_table: true,
                        display_add_to_search_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_add_to_search_button,
                        display_remove_from_search_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_remove_from_search_button,
                        display_term_hyperlinks: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_term_hyperlinks,
                        display_exclude_from_query_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_exclude_from_query_button,
                        display_get_term_reply_in_new_window_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_get_term_reply_in_new_window_button
                    },
                    loaded: true,
                });
                if (this.refs.thedash !== undefined) {
                    this.refs.thedash.refs.widgetModal.setState({
                        config: {
                            top_values: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].top_values,
                            sort_order: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].sort_order,
                            table_size: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].table_size,
                            show_pie_chart: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].show_pie_chart,
                            show_data_table: true,
                            display_term_hyperlinks: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_term_hyperlinks,
                            display_exclude_from_query_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_exclude_from_query_button,
                            display_get_term_reply_in_new_window_button: this.state.configuration['org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1'].display_get_term_reply_in_new_window_button
                        }
                    });
                }
            } else {
                this.setState({
                    quickValuesOptions: {
                        top_values: this.state.defaults.top_values,
                        sort_order: this.state.defaults.sort_order,
                        table_size: this.state.defaults.table_size,
                        show_pie_chart: this.state.defaults.show_pie_chart,
                        show_data_table: true,
                        display_add_to_search_button: this.state.defaults.display_add_to_search_button,
                        display_remove_from_search_button: this.state.defaults.display_remove_from_search_button,
                        display_term_hyperlinks: this.state.defaults.display_term_hyperlinks,
                        display_exclude_from_query_button: this.state.defaults.display_exclude_from_query_button,
                        display_get_term_reply_in_new_window_button: this.state.defaults.display_get_term_reply_in_new_window_button

                    },
                });
            }
        }

        if (this.state.field !== undefined) {
            this.setState({loadPending: true});
            const promise = QuickValuesPlusActions.getQuickValues(
                this.state.field,
                this.state.quickValuesOptions.table_size,
                this.state.quickValuesOptions.sort_order);
            promise.then((data) => this.setState({data: data, loadPending: false}));
        }
    },
    _resetStatus() {
        this.setState(this.getInitialState());
    },
    sortordermenu: ['ascending', 'descending'],
    topvaluesmenu: [5,10,15,20,25],
    tablesizemenu: [10,15,20,25,50,75,100],

    _submenuItemClassName(configKey, value) {
        return this.state.quickValuesOptions[configKey] === value ? 'selected' : '';
    },
    _updateOptionState(configKey, value) {
        let newOptions = Object.assign({}, this.state.quickValuesOptions, {[configKey]: value});
        this.refs.thedash.refs.widgetModal.setState({config: newOptions});
        this.setState({quickValuesOptions: newOptions});
        const promise = QuickValuesPlusActions.getQuickValues(this.state.field, newOptions['table_size'], newOptions['sort_order']);
        promise.then((data) => this.setState({data: data, loadPending: false}));
    },
    _getSubmenu(configKey, values) {
        const submenuItems = values.map((value) => {
            const readableName = value;
            return (
                <li key={`menu-item-${value}`} onClick={() => this.toggleDropdown()}>
                    <a href="#" onClick={() => this._updateOptionState(configKey, value)} className={this._submenuItemClassName(configKey, value)} data-type={value}>
                        {StringUtils.capitalizeFirstLetter(readableName.toString())}
                    </a>
                </li>
            );
        });

        return <ul className={`dropdown-menu ${configKey}-selector`}>{submenuItems}</ul>;
    },
    echoStatus: '',

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
                <a href="#">Table Size</a>
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
                                          displayAddToSearchButton={this.state.quickValuesOptions.display_add_to_search_button}
                                          displayRemoveFromSearchButton={this.state.quickValuesOptions.display_remove_from_search_button}
                                          displayAnalysisInformation/>
            );
        }

        if (this.state.field !== undefined) {
            content = (
                <div className="content-col">
                    <div className="pull-right">
                        <AddToDashboardMenuRev title="Add to dashboard"
                                            ref="thedash"
                                            widgetType={this.WIDGET_TYPE}
                                            configuration={{field: this.state.field, table_size: this.state.quickValuesOptions['table_size'], sort_order: this.state.quickValuesOptions['sort_order'], top_values: this.state.quickValuesOptions['top_values']}}
                                            bsStyle="default"
                                            pullRight
                                            permissions={this.props.permissions}>
                            <Button bsSize="small" onClick={() => this._resetStatus()}>Dismiss</Button>
                            <DropdownButton bsSize="small" className="quickvalues-settings" title="Customize" id="customize-quick-values-plus-dropdown" onToggle={() => this.toggleDropdown()} open={this.state.dropdownIsOpen} >
                                {submenus}
                            </DropdownButton>
                        </AddToDashboardMenuRev>
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
