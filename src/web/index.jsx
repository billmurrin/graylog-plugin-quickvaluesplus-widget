// eslint-disable-next-line no-unused-vars
import webpackEntry from 'webpack-entry';

import packageJson from '../../package.json';
import { PluginManifest, PluginStore } from 'graylog-web-plugin/plugin';
import QuickValuesPlusVisualization from 'components/QuickValuesPlusVisualization';
import FieldQuickValuesPlus from 'components/FieldQuickValuesPlus';
import QuickValuesPlusWidgetCreateConfiguration from 'components/QuickValuesPlusWidgetCreateConfiguration';
import QuickValuesPlusWidgetEditConfiguration from 'components/QuickValuesPlusWidgetEditConfiguration'
import QuickValuesPlusDefaultConfig from 'components/QuickValuesPlusDefaultConfig';

PluginStore.register(new PluginManifest(packageJson, {
    widgets: [
        {
            type: 'org.graylog.plugins.quickvaluesplus.widget.strategy.QuickValuesPlusWidgetStrategy',
            displayName: 'Quick Values Plus',
            defaultHeight: 3,
            defaultWidth: 1,
            visualizationComponent: QuickValuesPlusVisualization,
            configurationCreateComponent: QuickValuesPlusWidgetCreateConfiguration,
            configurationEditComponent: QuickValuesPlusWidgetEditConfiguration,
        },
    ],
    fieldAnalyzers: [
        {
            refId: 'fieldQuickValuesPlusComponent',
            displayName: 'Quick Values Plus',
            component: FieldQuickValuesPlus,
            displayPriority: 10,
        },
    ],
    systemConfigurations: [
        {
            component: QuickValuesPlusDefaultConfig,
            configType: 'org.graylog.plugins.quickvaluesplus.QuickValuesPlusPluginConfiguration3_1',
        },
    ],
}));
