import React, {PropTypes} from 'react';
import { Input } from 'react-bootstrap';

const QuickValuesPlusWidgetCreateConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getInitialConfiguration() {
    return {
      top_values: 5,
      table_size: 50,
      sort_order: 'descending',
      show_pie_chart: true,
      show_data_table: true,
    };
  },

  render() {
    return (
      <fieldset>
        <Input key="dataTopValues"
               type="text"
               id="quickvaluesplus-top-values"
               name="top_values"
               label="Number of Top Values"
               value={this.props.config.top_values}
               onChange={this.props.onChange}
               help="Modify the number of results that are considered Top Values in the table."/>

        <Input key="dataTableSize"
               type="text"
               id="quickvaluesplus-tables-size"
               name="table_size"
               label="Size of Table"
               value={this.props.config.table_size}
               onChange={this.props.onChange}
               help="Modify the number of results in the table."/>

          <label for="quickvaluesplus-sort-order-descending" class="control-label"><span>Sort Order</span></label>
          <div className="radio">
              <label>
                  <input key="dataSortOrderDesc"  id="quickvaluesplus-sort-order-descending" type="radio" name="sort_order" value="descending"
                         onChange={this.props.onChange}
                         checked={this.props.config.sort_order === "descending"}/>
                  Descending
              </label>
          </div>
          <div className="radio">
              <label>
                  <input key="dataSortOrderAsc" id="quickvaluesplus-sort-order-ascending" type="radio" name="sort_order" value="ascending"
                         onChange={this.props.onChange}
                         checked={this.props.config.sort_order === "ascending"}/>
                  Ascending
              </label>
          </div>

        <Input key="showPieChart"
               type="checkbox"
               id="quickvaluesplus-show-pie-chart"
               name="show_pie_chart"
               label="Show pie chart"
               checked={this.props.config.show_pie_chart}
               onChange={this.props.onChange}
               help="Include a pie chart representation of the data."/>

        <Input key="showDataTable"
               type="checkbox"
               id="quickvaluesplus-show-data-table"
               name="show_data_table"
               label="Show data table"
               checked={this.props.config.show_data_table}
               onChange={this.props.onChange}
               help="Include a table with quantitative information."/>
      </fieldset>
    );
  },
});

export default QuickValuesPlusWidgetCreateConfiguration;
