import React, {PropTypes} from 'react';
import { Input } from 'components/bootstrap';

import { QueryConfiguration } from 'components/widgets/configurations';

const QuickValuesPlusWidgetEditConfiguration = React.createClass({
  propTypes: {
    config: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  render() {
    return (
      <fieldset>
        <QueryConfiguration {...this.props}/>
          <Input key="dataField"
                 type="text"
                 id="quickvaluesplus-field"
                 name="field"
                 label="Field"
                 value={this.props.config.field}
                 onChange={this.props.onChange}
                 help="The name of the field that the query is based on."/>

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
                         checked={this.props.config.sort_order === 'descending'}/>
                  Descending
              </label>
          </div>
          <div className="radio">
              <label>
                  <input key="dataSortOrderAsc" id="quickvaluesplus-sort-order-ascending" type="radio" name="sort_order" value="ascending"
                         onChange={this.props.onChange}
                         checked={this.props.config.sort_order === 'ascending'}/>
                  Ascending
              </label>
          </div>


        <Input key="showPieChart"
               type="checkbox"
               id="quickvaluesplus-show-pie-chart"
               name="show_pie_chart"
               label="Show pie chart"
               defaultChecked={this.props.config.show_pie_chart}
               onChange={this.props.onChange}
               help="Represent data in a pie chart"/>

        <Input key="showDataTable"
               type="checkbox"
               id="quickvaluesplus-show-data-table"
               name="show_data_table"
               label="Show data table"
               defaultChecked={this.props.config.show_data_table}
               onChange={this.props.onChange}
               help="Include a table with quantitative information."/>

          <Input key="displayTermHyperlinks"
                 type="checkbox"
                 id="quickvaluesplus-display-term_hyperlinks"
                 name="display_term_hyperlinks"
                 label="Display Term Hyperlinks"
                 checked={this.props.config.display_term_hyperlinks}
                 onChange={this.props.onChange}
                 help="Turn off hyperlinks for the term." />

        <Input key="displayExludeFromQueryButton"
               type="checkbox"
               id="quickvaluesplus-display-exclude-from-query-button"
               name="display_exclude_from_query_button"
               label="Display Exclude From Query Button"
               checked={this.props.config.display_exclude_from_query_button}
               onChange={this.props.onChange}
               help="Column containing a exclude from Query button." />

        <Input key="displayGetTermReplyInNewWindowButton"
               type="checkbox"
               id="quickvaluesplus-display-get-term-reply-in-new-window-button"
               name="display_get_term_reply_in_new_window_button"
               label="Display Get Term Reply In New Window Button"
               checked={this.props.config.display_get_term_reply_in_new_window_button}
               onChange={this.props.onChange}
               help="Column containing a get term reply in new window button." />
      </fieldset>
    );
  },
});

export default QuickValuesPlusWidgetEditConfiguration;
