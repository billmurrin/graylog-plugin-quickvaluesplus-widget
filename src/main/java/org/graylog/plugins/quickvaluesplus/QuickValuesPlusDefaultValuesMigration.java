package org.graylog.plugins.quickvaluesplus;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.graylog2.migrations.Migration;
import org.graylog2.cluster.ClusterConfigServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.time.ZonedDateTime;


/**
 * Migration creating the quick values plus entries if they do not exist.
 */
public class QuickValuesPlusDefaultValuesMigration extends Migration {
    private static final Logger LOG = LoggerFactory.getLogger(QuickValuesPlusDefaultValuesMigration.class);

    private final ClusterConfigServiceImpl clusterConfigService;

    @Inject
    public QuickValuesPlusDefaultValuesMigration(final ClusterConfigServiceImpl clusterConfigService) {
        this.clusterConfigService = clusterConfigService;
    }

    @Override
    public ZonedDateTime createdAt() {
        return ZonedDateTime.parse("2018-05-06T07:45:00Z");
    }

    @Override
    @SuppressWarnings("unchecked")
    public void upgrade() {

        final QuickValuesPlusPluginConfiguration quickValuesPlusPluginConfiguration = clusterConfigService.get(QuickValuesPlusPluginConfiguration.class);
        final QuickValuesPlusPluginConfiguration3_1 quickValuesPlusPluginConfiguration3_1 = clusterConfigService.get(QuickValuesPlusPluginConfiguration3_1.class);
        final QuickValuesPlusPluginConfiguration4_0 quickValuesPlusPluginConfiguration4_0 = clusterConfigService.get(QuickValuesPlusPluginConfiguration4_0.class);
        Boolean migrated = false;

        if (quickValuesPlusPluginConfiguration4_0 == null) {

            if (quickValuesPlusPluginConfiguration != null) {
                migrated = true;
                LOG.info("Removing QVP 3.0 migration information");
                clusterConfigService.remove(QuickValuesPlusPluginConfiguration.class);
                LOG.info("Migrating values for existing QVP Configuration");
                clusterConfigService.write(QuickValuesPlusPluginConfiguration4_0.create(quickValuesPlusPluginConfiguration.tableSize(), quickValuesPlusPluginConfiguration.topValues(), quickValuesPlusPluginConfiguration.sortOrder(), true, true, true, true, true,true, "4.0.0"));
            }

            if (quickValuesPlusPluginConfiguration3_1 != null) {
                migrated = true;
                LOG.info("Removing QVP 3.1 migration information");
                clusterConfigService.remove(QuickValuesPlusPluginConfiguration3_1.class);
                LOG.info("Migrating values for existing QVP Configuration");
                clusterConfigService.write(QuickValuesPlusPluginConfiguration4_0.create(quickValuesPlusPluginConfiguration3_1.tableSize(), quickValuesPlusPluginConfiguration3_1.topValues(), quickValuesPlusPluginConfiguration3_1.sortOrder(), quickValuesPlusPluginConfiguration3_1.showPieChart(), quickValuesPlusPluginConfiguration3_1.addToSearch(), quickValuesPlusPluginConfiguration3_1.removeFromSearch(), quickValuesPlusPluginConfiguration3_1.termHyperlinks(), quickValuesPlusPluginConfiguration3_1.excludeQuery(),quickValuesPlusPluginConfiguration3_1.termNewWindow(), "4.0.0"));
            }

            if (!migrated) {
                LOG.info("No prior migration exists. Writing default values for QVP Configuration");
                clusterConfigService.write(QuickValuesPlusPluginConfiguration4_0.create(25, 5, "descending", true, true, true, true, true, true, "4.0.0"));
            }

        } else {
            LOG.info("QVP 4.0 migration has already completed. Exiting.");
            return;
        }
    }

}