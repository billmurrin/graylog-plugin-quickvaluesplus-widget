package org.graylog.plugins.quickvaluesplus;

import org.graylog2.plugin.PluginModule;
import org.graylog.plugins.quickvaluesplus.widget.strategy.QuickValuesPlusWidgetStrategy;

/**
 * Extend the PluginModule abstract class here to add you plugin to the system.
 */
public class QuickValuesPlusWidgetModule extends PluginModule {
    @Override
    protected void configure() {
        addWidgetStrategy(QuickValuesPlusWidgetStrategy.class, QuickValuesPlusWidgetStrategy.Factory.class);
    }
}