# QuickValuesPlus Widget Plugin for Graylog2
[![Github Downloads](https://img.shields.io/github/downloads/billmurrin/graylog-plugin-quickvaluesplus-widget/total.svg)](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases)
[![GitHub Release](https://img.shields.io/github/release/billmurrin/graylog-plugin-quickvaluesplus-widget.svg)](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases)
[![Build Status](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget.svg?branch=master)](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget)

The QuickValuesPlus Widget is an enhancement to the Quick Values Widget that ships with GrayLog2. The QuickValuesPlus Widget can be added to a Stream as a Field Analyzer and to Dashboards as a widget. 

Several **NEW** features have been added to version 3.0.0 (See below). Version 3.0.0 is only compatible with Graylog 2.3.0 and above.

Field Analyzer Features
-----------
- "Customize" menu supports modifying the Sort Order (Ascending or Descending), Table Size and number of Top Values displayed by the widget.
- Exclude from search button - Add negated search directly to the Search Bar (E.g. !field_name:foo).

*Field Analyzer Features* 
![alt text](http://i.imgur.com/H9SRkRo.png "Field Analyzer Features")

New Dashboard Features
-----------
- Widgets now contain links so that you can drill into a Term search and view the results.
- Widgets now contain a button to open the Term search inside of a new window.
- Added Exclude Term from Query button - Negate a search term directly from the widget (Requires dashboard edit permissions)
- Can now customize the field name used by the widget (Requires dashboard edit permissions)

*NEW - Version 3 Dashboard Features*
![alt text](http://i.imgur.com/viZ3AoK.png "Version 3 Dashboard Features")


*NEW - Version 3 Editable Field Name*
![alt text](http://i.imgur.com/HmBs3YL.png "Editable Field Name")

New Global System Configuration
-----------
- Can now Customize the Quick Values Plus default values in the System/Configuration page.

*NEW - Version 3 Globally Configurable Default Values*
![alt text](http://i.imgur.com/DZHbWzh.png "System Global Default Values")

Supported Graylog Versions
-----------
* Version 3.0.0 was tested and is compatible with Graylog version 2.3.0 and above.
* Version 2.1.0 was tested and is compatible with Graylog versions 2.2.1, 2.2.2, and 2.2.3.
* Version 1.0.0 was tested and is compatible with Graylog version 2.1.3.
 
Features and Bugs
-----------
If you come across a bug, require further assistance, or have a great feature request, please file an [Issue](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/issues) providing as much detail as possible. 

Contributions to the code-base are greatly appreciated.

Related Graylog Issues
-----------
The following are Graylog issues that the QuickValuesPlus widget currently attempts to resolve.
* [#2459](https://github.com/Graylog2/graylog2-server/issues/2459) - Reverse quick values/Bottom-N
* [#2631](https://github.com/Graylog2/graylog2-server/issues/2631) - Feature request: rare values #2631
* [#1684](https://github.com/Graylog2/graylog2-server/issues/1684) - Make number of terms in quick values widget configurable
* [#3694](https://github.com/Graylog2/graylog2-server/issues/3694) - Add hyperlinks to "Quick Values" dashboard widgets
* [#3394](https://github.com/Graylog2/graylog2-server/issues/3394) - Widgets has no way to edit all properties after creation

Installation
------------
[Download the plugin](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases/)
and place the `.jar` file in your Graylog plugin directory. The plugin directory is the `plugins/` folder relative from your `graylog-server` directory by default and can be configured in your `graylog.conf` file.

Restart `graylog-server` and you are done.

Way Ahead - Version 3.1.0
-----------
 * Add additional Default Configuration options (show table, show pie chart, links, exclude query button)
 * Add ability to Turn Off links and/or exclude from Query buttons for each individual widget in the Widget Configuration.
  
Development
-----------
You can improve your development experience for the web interface part of your plugin dramatically by making use of hot reloading. 

To hot reload using Graylog 2.3.0, your plugin directory should be located two directories above your graylog2-web-server directory (../../) and the folder name of your plugin should be begin with graylog-plugin (More info[HERE](https://github.com/Graylog2/graylog2-server/blob/2.3/graylog2-web-interface/webpack.combined.config.js#L11))

Steps for hot-loading setup with the plugin.
* Clone the Repositories
```
git clone https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget.git
git clone -b "2.3.0" https://github.com/Graylog2/graylog2-server.git
```
* Install the Node.JS modules
```
cd graylog-plugin-quickvaluesplus-widget
npm install
cd ../graylog2-server/graylog2-web-interface
npm install
```
* Build the Vendor file (If you skip this, plugin might fail with an 'call an undefined function')
```
webpack --config webpack.vendor.js
```
* Start the web server
```
npm start
```

Steps to build the plugin.
* Follow the steps above, but **DO NOT** run the `npm start` command. (no need to start the dev web-server) 
* Run `mvn package` 
* Copy the generated JAR file located in the target directory to the Graylog plugin directory.
* Restart Graylog