import React from 'react';
import { Input } from 'components/bootstrap';
import { Button } from 'react-bootstrap';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { IfPermitted, Select } from 'components/common';
import ObjectUtils from 'util/ObjectUtils';
import './QuickValuesPlusDefaultConfig.css';

const QuickValuesPlusDefaultConfig = React.createClass({
    propTypes: {
        config: React.PropTypes.object,
        updateConfig: React.PropTypes.func.isRequired,
    },

    getDefaultProps() {
        return {
            config: {
                sort_order: "descending",
                table_size: 50,
                top_values: 5,
                show_pie_chart: true,
                show_data_table: true,
                display_add_to_search_button: true,
                display_remove_from_search_button: true,
                display_term_hyperlinks: true,
                display_exclude_from_query_button: true,
                display_get_term_reply_in_new_window_button: true
            },
        };
    },

    getInitialState() {
        return {
            config: ObjectUtils.clone(this.props.config),
        };
    },

    componentWillReceiveProps(newProps) {
        this.setState({config: ObjectUtils.clone(newProps.config)});
    },

    _updateConfigField(field, value) {
        const update = ObjectUtils.clone(this.state.config);

        if (value === "true") {
            value = true;
        } else if (value === "false") {
            value = false
        }

        update[field] = value;
        this.setState({config: update});
    },

    _onCheckboxClick(field, ref) {
        return () => {
            this._updateConfigField(field, this.refs[ref].getChecked());
        };
    },

    _onSelect(field) {
        return (selection) => {
            this._updateConfigField(field, selection);
        };
    },

    _onUpdate(field) {
        return (e) => {
            this._updateConfigField(field, e.target.value);
        };
    },

    _openModal() {
        this.refs.quickvaluesplusConfigModal.open();
    },

    _closeModal() {
        this.refs.quickvaluesplusConfigModal.close();
    },

    _resetConfig() {
        // Reset to initial state when the modal is closed without saving.
        this.setState(this.getInitialState());
    },

    _saveConfig() {
        this.props.updateConfig(this.state.config).then(() => {
            this._closeModal();
        });
    },

    render() {
        return (
            <div id="qvp">
                <h3>Quick Values Plus Configuration</h3>

                <p>
                    Default Settings for the Quick Values Plus Field Analyzer and Widget
                </p>

                <dl className="deflist">
                    <dt>Default Table Size</dt>
                    <dd>{this.state.config.table_size}</dd>

                    <dt>Default Top Values</dt>
                    <dd>{this.state.config.top_values}</dd>

                    <dt>Default Sort Order</dt>
                    <dd>{this.state.config.sort_order === "descending" ? 'Descending' : 'Ascending'}</dd>

                    <dt>Show Pie Charts by Default?</dt>
                    <dd>{this.state.config.show_pie_chart === true ? 'Yes' : 'No'}</dd>

                    <dt>Show Add Term To Search Button?</dt>
                    <dd>{this.state.config.display_add_to_search_button === true ? 'Yes' : 'No'}</dd>

                    <dt>Show Remove Term From Search Button?</dt>
                    <dd>{this.state.config.display_remove_from_search_button === true ? 'Yes' : 'No'}</dd>

                    <dt>Show Term Hyperlinks? (Dashboards)</dt>
                    <dd>{this.state.config.display_term_hyperlinks === true ? 'Yes' : 'No'}</dd>

                    <dt>Show Exclude From Query Button? (Dashboards)</dt>
                    <dd>{this.state.config.display_exclude_from_query_button === true ? 'Yes' : 'No'}</dd>

                    <dt>Show Open Search Term Query in New Window Button? (Dashboards)</dt>
                    <dd>{this.state.config.display_get_term_reply_in_new_window_button === true ? 'Yes' : 'No'}</dd>
                </dl>

                <IfPermitted permissions="clusterconfigentry:edit">
                    <Button className="qvp-conf-btn" bsStyle="info" bsSize="xs" onClick={this._openModal}>Configure</Button>
                </IfPermitted>

                <BootstrapModalForm ref="quickvaluesplusConfigModal"
                                    title="Update Quick Values Plus plugin Configuration"
                                    onSubmitForm={this._saveConfig}
                                    onModalClose={this._resetConfig}
                                    submitButtonText="Save">
                    <fieldset className="qvp-config-modal">
                        <Input key="dataTopValues"
                               type="text"
                               id="quickvaluesplus-top-values"
                               name="top_values"
                               label="Number of Top Values"
                               value={this.state.config.top_values}
                               onChange={this._onUpdate('top_values')}
                               help="Modify the number of results that are considered Top Values in the table."/>

                        <Input key="dataTableSize"
                               type="text"
                               id="quickvaluesplus-tables-size"
                               name="table_size"
                               label="Size of Table"
                               value={this.state.config.table_size}
                               onChange={this._onUpdate('table_size')}
                               help="Modify the number of results in the table."/>

                        <label for="quickvaluesplus-sort-order-descending" className="control-label"><span>Sort Order</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="dataSortOrderDesc"  id="quickvaluesplus-sort-order-descending" type="radio" name="sort_order" value="descending"
                                       onChange={this._onUpdate('sort_order')}
                                       checked={this.state.config.sort_order === "descending"} />
                                Descending
                            </label>
                            <label className="radio-inline">
                                <input key="dataSortOrderAsc" id="quickvaluesplus-sort-order-ascending" type="radio" name="sort_order" value="ascending"
                                       onChange={this._onUpdate('sort_order')}
                                       checked={this.state.config.sort_order === "ascending"} />
                                Ascending
                            </label>
                        </div>

                        <label for="quickvaluesplus-show-pie-chart-true" className="control-label"><span>Show Pie Chart?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="showPieChartTrue"  id="quickvaluesplus-show-pie-chart-true" type="radio" name="show_pie_chart" value="true"
                                       onChange={this._onUpdate('show_pie_chart')}
                                       checked={this.state.config.show_pie_chart === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="showPieChartFalse" id="quickvaluesplus-show-pie-chart-false" type="radio" name="show_pie_chart" value="false"
                                       onChange={this._onUpdate('show_pie_chart')}
                                       checked={this.state.config.show_pie_chart === false} />
                                No
                            </label>
                        </div>

                        <label for="quickvaluesplus-add-to-search-true" className="control-label"><span>Show Add to Search Button?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="addToSearchTrue"  id="quickvaluesplus-add-to-search-true" type="radio" name="display_add_to_search_button" value="true"
                                       onChange={this._onUpdate('display_add_to_search_button')}
                                       checked={this.state.config.display_add_to_search_button === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="addToSearchFalse" id="quickvaluesplus-add-to-search-false" type="radio" name="display_add_to_search_button" value="false"
                                       onChange={this._onUpdate('display_add_to_search_button')}
                                       checked={this.state.config.display_add_to_search_button === false} />
                                No
                            </label>
                        </div>

                        <label for="quickvaluesplus-remove-from-search-true" className="control-label"><span>Show Remove from Search Button?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="removeFromSearchTrue"  id="quickvaluesplus-remove-from-search-true" type="radio" name="display_remove_from_search_button" value="true"
                                       onChange={this._onUpdate('display_remove_from_search_button')}
                                       checked={this.state.config.display_remove_from_search_button === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="removeFromSearchFalse" id="quickvaluesplus-remove-from-search-false" type="radio" name="display_remove_from_search_button" value="false"
                                       onChange={this._onUpdate('display_remove_from_search_button')}
                                       checked={this.state.config.display_remove_from_search_button === false} />
                                No
                            </label>
                        </div>

                        <label for="quickvaluesplus-display-term-hyperlinks" className="control-label"><span>Show Hyperlinks on Terms?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="termHyperlinksTrue"  id="quickvaluesplus-display-term_hyperlinks-true" type="radio" name="display_term_hyperlinks" value="true"
                                       onChange={this._onUpdate('display_term_hyperlinks')}
                                       checked={this.state.config.display_term_hyperlinks === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="termHyperlinksTrue" id="quickvaluesplus-display-term_hyperlinks-false" type="radio" name="display_term_hyperlinks" value="false"
                                       onChange={this._onUpdate('display_term_hyperlinks')}
                                       checked={this.state.config.display_term_hyperlinks === false} />
                                No
                            </label>
                        </div>

                        <label for="quickvaluesplus-exclude-from-query-true" className="control-label"><span>Show Exclude From Query Button?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="excludeFromQueryTrue"  id="quickvaluesplus-exclude-from-query-true" type="radio" name="display_exclude_from_query_button" value="true"
                                       onChange={this._onUpdate('display_exclude_from_query_button')}
                                       checked={this.state.config.display_exclude_from_query_button === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="excludeFromQueryFalse" id="quickvaluesplus-exclude-from-query-false" type="radio" name="display_exclude_from_query_button" value="false"
                                       onChange={this._onUpdate('display_exclude_from_query_button')}
                                       checked={this.state.config.display_exclude_from_query_button === false} />
                                No
                            </label>
                        </div>

                        <label for="quickvaluesplus-search-term-in-new-window-true" className="control-label"><span>Show Open Search Term Query in New Window Button?</span></label>
                        <div className="radio">
                            <label className="radio-inline">
                                <input key="searchTermNewWindowTrue"  id="quickvaluesplus-search-term-in-new-window-true" type="radio" name="display_get_term_reply_in_new_window_button" value="true"
                                       onChange={this._onUpdate('display_get_term_reply_in_new_window_button')}
                                       checked={this.state.config.display_get_term_reply_in_new_window_button === true} />
                                Yes
                            </label>
                            <label className="radio-inline">
                                <input key="searchTermNewWindowFalse" id="quickvaluesplus-search-term-in-new-window-false" type="radio" name="display_get_term_reply_in_new_window_button" value="false"
                                       onChange={this._onUpdate('display_get_term_reply_in_new_window_button')}
                                       checked={this.state.config.display_get_term_reply_in_new_window_button === false} />
                                No
                            </label>
                        </div>
                    </fieldset>
                </BootstrapModalForm>
            </div>
        );
    },
});

export default QuickValuesPlusDefaultConfig;