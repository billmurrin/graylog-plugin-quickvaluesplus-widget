const PluginWebpackConfig = require('graylog-web-plugin').PluginWebpackConfig;
const loadBuildConfig = require('graylog-web-plugin').loadBuildConfig;
const path = require('path');

// Remember to use the same name here and in `getUniqueId()` in the java MetaData class
module.exports = new PluginWebpackConfig('org.graylog.plugins.quickvaluesplus.QuickValuesPlusWidgetPlugin', loadBuildConfig(path.resolve(__dirname, './build.config')), {
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader']},
            { test: /\.ts$/, use: ['babel-loader', 'ts-loader'], exclude: /node_modules|\.node_cache/ }
        ]
    },
    resolve: {
        extensions: ['.ts'],
    },
});
