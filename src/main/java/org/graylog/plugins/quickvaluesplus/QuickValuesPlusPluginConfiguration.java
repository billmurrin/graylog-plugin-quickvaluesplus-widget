package org.graylog.plugins.quickvaluesplus;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;

@JsonAutoDetect
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoValue
public abstract class QuickValuesPlusPluginConfiguration {

    @JsonProperty("table_size")
    public abstract Number tableSize();

    @JsonProperty("top_values")
    public abstract Number topValues();

    @JsonProperty("sort_order")
    public abstract String sortOrder();

    @JsonCreator
    public static QuickValuesPlusPluginConfiguration create(@JsonProperty("table_size") Number tableSize,
                                                        @JsonProperty("top_values") Number topValues,
                                                        @JsonProperty("sort_order") String sortOrder) {
        return builder()
                .tableSize(tableSize)
                .topValues(topValues)
                .sortOrder(sortOrder)
                .build();
    }

    public static Builder builder() {
        return new AutoValue_QuickValuesPlusPluginConfiguration.Builder();
    }

    @AutoValue.Builder
    public static abstract class Builder {
        public abstract Builder tableSize(Number tableSize);

        public abstract Builder topValues(Number topValues);

        public abstract Builder sortOrder(String sortOrder);

        public abstract QuickValuesPlusPluginConfiguration build();
    }

}