package org.graylog.plugins.quickvaluesplus;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;

@JsonAutoDetect
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoValue
public abstract class QuickValuesPlusPluginConfiguration4_0 {

    @JsonProperty("table_size")
    public abstract Number tableSize();

    @JsonProperty("top_values")
    public abstract Number topValues();

    @JsonProperty("sort_order")
    public abstract String sortOrder();

    @JsonProperty("show_pie_chart")
    public abstract Boolean showPieChart();

    @JsonProperty("display_add_to_search_button")
    public abstract Boolean addToSearch();

    @JsonProperty("display_remove_from_search_button")
    public abstract Boolean removeFromSearch();

    @JsonProperty("display_term_hyperlinks")
    public abstract Boolean termHyperlinks();

    @JsonProperty("display_exclude_from_query_button")
    public abstract Boolean excludeQuery();

    @JsonProperty("display_get_term_reply_in_new_window_button")
    public abstract Boolean termNewWindow();

    @JsonProperty("version")
    public abstract String version();

    @JsonCreator
    public static QuickValuesPlusPluginConfiguration4_0 create(@JsonProperty("table_size") Number tableSize,
                                                               @JsonProperty("top_values") Number topValues,
                                                               @JsonProperty("sort_order") String sortOrder,
                                                               @JsonProperty("show_pie_chart") Boolean showPieChart,
                                                               @JsonProperty("display_add_to_search_button") Boolean addToSearch,
                                                               @JsonProperty("display_remove_from_search_button") Boolean removeFromSearch,
                                                               @JsonProperty("display_term_hyperlinks") Boolean termHyperlinks,
                                                               @JsonProperty("display_exclude_from_query_button") Boolean excludeQuery,
                                                               @JsonProperty("display_get_term_reply_in_new_window_button") Boolean termNewWindow,
                                                               @JsonProperty("version") String version) {
        return builder()
            .tableSize(tableSize)
            .topValues(topValues)
            .sortOrder(sortOrder)
            .showPieChart(showPieChart)
            .addToSearch(addToSearch)
            .removeFromSearch(removeFromSearch)
            .termHyperlinks(termHyperlinks)
            .excludeQuery(excludeQuery)
            .termNewWindow(termNewWindow)
            .version(version)
            .build();
    }

    public static Builder builder() {
        return new AutoValue_QuickValuesPlusPluginConfiguration4_0.Builder();
    }

    @AutoValue.Builder
    public static abstract class Builder {
        public abstract Builder tableSize(Number tableSize);

        public abstract Builder topValues(Number topValues);

        public abstract Builder sortOrder(String sortOrder);

        public abstract Builder showPieChart(Boolean showPieChart);

        public abstract Builder addToSearch(Boolean addToSearch);

        public abstract Builder removeFromSearch(Boolean removeFromSearch);

        public abstract Builder termHyperlinks(Boolean termHyperlinks);

        public abstract Builder excludeQuery(Boolean excludeQuery);

        public abstract Builder termNewWindow(Boolean termNewWindow);

        public abstract Builder version(String version);

        public abstract QuickValuesPlusPluginConfiguration4_0 build();
    }

}