package org.graylog.plugins.quickvaluesplus;

import org.graylog2.plugin.PluginModule;
import org.graylog2.plugin.PluginConfigBean;
import org.graylog.plugins.quickvaluesplus.widget.strategy.QuickValuesPlusWidgetStrategy;
import com.github.joschi.jadconfig.Parameter;
import com.google.inject.multibindings.Multibinder;
import org.graylog2.migrations.Migration;
import org.graylog.plugins.quickvaluesplus.QuickValuesPlusDefaultValuesMigration;
import java.util.Collections;
import java.util.Set;

/**
 * Extend the PluginModule abstract class here to add you plugin to the system.
 */
public class QuickValuesPlusWidgetModule extends PluginModule {

    protected Multibinder<Migration> migrationsBinder() {
        return Multibinder.newSetBinder(binder(), Migration.class);
    }

    @Override
    public Set<? extends PluginConfigBean> getConfigBeans() {
        return Collections.emptySet();
    }

    @Override
    protected void configure() {
        addWidgetStrategy(QuickValuesPlusWidgetStrategy.class, QuickValuesPlusWidgetStrategy.Factory.class);

        migrationsBinder().addBinding().to(QuickValuesPlusDefaultValuesMigration.class);
    }
}