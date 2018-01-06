package org.graylog.plugins.quickvaluesplus;

import org.graylog2.plugin.PluginMetaData;
import org.graylog2.plugin.ServerStatus;
import org.graylog2.plugin.Version;

import java.net.URI;
import java.util.Collections;
import java.util.Set;

/**
 * Implement the PluginMetaData interface here.
 */
public class QuickValuesPlusWidgetMetaData implements PluginMetaData {
    private static final String PLUGIN_PROPERTIES = "org.graylog.plugins.graylog-plugin-quick-values-plus-widget/graylog-plugin.properties";

    @Override
    public String getUniqueId() {
        return "org.graylog.plugins.quickvaluesplus.QuickValuesPlusWidgetPlugin";
    }

    @Override
    public String getName() {
        return "QuickValuesPlusWidget";
    }

    @Override
    public String getAuthor() {
        return "Bill Murrin <bill@billmurrin.com>";
    }

    @Override
    public URI getURL() {
        return URI.create("https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget");
    }

    @Override
    public Version getVersion() {
        return Version.fromPluginProperties(getClass(), PLUGIN_PROPERTIES, "version", Version.from(3, 0, 0, "unknown"));
    }

    @Override
    public String getDescription() {
        // TODO Insert correct plugin description
        return "Enhanced QuickValues Widget";
    }

    @Override
    public Version getRequiredVersion() {
        return Version.fromPluginProperties(getClass(), PLUGIN_PROPERTIES, "graylog.version", Version.from(2, 3, 0, "unknown"));
    }

    @Override
    public Set<ServerStatus.Capability> getRequiredCapabilities() {
        return Collections.emptySet();
    }
}
