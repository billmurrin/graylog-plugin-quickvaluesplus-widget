import React from 'react';
import { Input } from 'components/bootstrap';
import { Button } from 'react-bootstrap';
import BootstrapModalForm from 'components/bootstrap/BootstrapModalForm';
import { IfPermitted, Select } from 'components/common';
import ObjectUtils from 'util/ObjectUtils';

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
            <div>
                <h3>Quick Values Plus Configuration</h3>

                <p>
                    Defaults Configuration for the Quick Values Plus Field Analyzer and Widget
                </p>

                <dl className="deflist">
                    <dt>Default Table Size</dt>
                    <dd>{this.state.config.table_size}</dd>

                    <dt>Default Top Values</dt>
                    <dd>{this.state.config.top_values}</dd>

                    <dt>Default Sort Order</dt>
                    <dd>{this.state.config.sort_order === "descending" ? 'Descending' : 'Ascending'}</dd>
                </dl>

                <IfPermitted permissions="clusterconfigentry:edit">
                    <Button bsStyle="info" bsSize="xs" onClick={this._openModal}>Configure</Button>
                </IfPermitted>

                <BootstrapModalForm ref="quickvaluesplusConfigModal"
                                    title="Update Quick Values Plus plugin Configuration"
                                    onSubmitForm={this._saveConfig}
                                    onModalClose={this._resetConfig}
                                    submitButtonText="Save">
                    <fieldset>
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

                        <label for="quickvaluesplus-sort-order-descending" class="control-label"><span>Sort Order</span></label>
                        <div className="radio">
                            <label>
                                <input key="dataSortOrderDesc"  id="quickvaluesplus-sort-order-descending" type="radio" name="sort_order" value="descending"
                                       onChange={this._onUpdate('sort_order')}
                                       checked={this.state.config.sort_order === "descending"} />
                                Descending
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input key="dataSortOrderAsc" id="quickvaluesplus-sort-order-ascending" type="radio" name="sort_order" value="ascending"
                                       onChange={this._onUpdate('sort_order')}
                                       checked={this.state.config.sort_order === "ascending"} />
                                Ascending
                            </label>
                        </div>
                    </fieldset>
                </BootstrapModalForm>
            </div>
        );
    },
});

export default QuickValuesPlusDefaultConfig;