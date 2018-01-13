package org.graylog.plugins.quickvaluesplus;

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
        return ZonedDateTime.parse("2017-09-03T01:57:00Z");
    }

    @Override
    @SuppressWarnings("unchecked")
    public void upgrade() {

        final QuickValuesPlusPluginConfiguration quickValuesPlusPluginConfiguration = clusterConfigService.get(QuickValuesPlusPluginConfiguration.class);
        final QuickValuesPlusPluginConfiguration3_1 quickValuesPlusPluginConfiguration3_1 = clusterConfigService.get(QuickValuesPlusPluginConfiguration3_1.class);

        if (quickValuesPlusPluginConfiguration3_1 == null) {
            if (quickValuesPlusPluginConfiguration == null) {
                LOG.info("No Migration Found. Writing values for Quick Values Plugin Configuration");
                clusterConfigService.write(QuickValuesPlusPluginConfiguration3_1.create(25, 5, "descending", true, true,true,true, true, true,"3.1.0"));
            } else {
                LOG.info("3.0 Migration Found. Updating to 3.1");
                clusterConfigService.write(QuickValuesPlusPluginConfiguration3_1.create(quickValuesPlusPluginConfiguration.tableSize(), quickValuesPlusPluginConfiguration.topValues(), quickValuesPlusPluginConfiguration.sortOrder(), true, true, true, true, true,true, "3.1.0"));
                LOG.info("Removing 3.0 migration information");
                clusterConfigService.remove(QuickValuesPlusPluginConfiguration.class);
            }
        } else {
            LOG.info("Migration has already completed. Exiting.");
            return;

        }
    }

}