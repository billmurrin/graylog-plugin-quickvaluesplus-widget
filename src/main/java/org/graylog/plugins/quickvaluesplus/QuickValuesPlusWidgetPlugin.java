package org.graylog.plugins.quickvaluesplus;

import org.graylog2.plugin.Plugin;
import org.graylog2.plugin.PluginMetaData;
import org.graylog2.plugin.PluginModule;

import java.util.Collection;
import java.util.Collections;

/**
 * Implement the Plugin interface here.
 */
public class QuickValuesPlusWidgetPlugin implements Plugin {
    @Override
    public PluginMetaData metadata() {
        return new QuickValuesPlusWidgetMetaData();
    }

    @Override
    public Collection<PluginModule> modules () {
        return Collections.<PluginModule>singletonList(new QuickValuesPlusWidgetModule());
    }
}
