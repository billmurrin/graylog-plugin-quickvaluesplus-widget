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
        if (clusterConfigService.get(QuickValuesPlusPluginConfiguration.class) != null) {
            LOG.debug("Migration already done.");
            return;
        }

        LOG.info("Writing values for Quick Values Plugin Configuration");
        clusterConfigService.write(QuickValuesPlusPluginConfiguration.create(25, 5, "descending"));
    }

}