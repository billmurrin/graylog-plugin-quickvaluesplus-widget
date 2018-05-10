# QuickValuesPlus Widget Plugin for Graylog2
[![Github Downloads](https://img.shields.io/github/downloads/billmurrin/graylog-plugin-quickvaluesplus-widget/total.svg)](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases)
[![GitHub Release](https://img.shields.io/github/release/billmurrin/graylog-plugin-quickvaluesplus-widget.svg)](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases)
[![Build Status](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget.svg?branch=master)](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget)

The QuickValuesPlus Widget is an enhancement to the original Quick Values Widget that shipped with GrayLog2. It can be added to a Stream as a Field Analyzer and to Dashboards as a widget. 

Several **NEW** features have been added to version 3.1.0 and above (See below).

Supported Graylog Versions
-----------
* Version 4.0.0 - Tested and compatible with Graylog version 2.4.x.
* Version 3.1.0 - Tested and compatible with Graylog version 2.3.x.
* Version 2.1.0 - Tested and compatible with Graylog versions 2.2.1 - 2.2.3.
* Version 1.0.0 - Tested and compatible with Graylog version 2.1.3.

Field Analyzer Features
-----------
- "Customize" menu supports modifying the Sort Order (Ascending or Descending), Table Size and number of Top Values displayed by the widget.
- Exclude from search button - Add negated search directly to the Search Bar (E.g. !field_name:foo).
- **3.1/4.0** - Can prevent Add to Search/Remove from search buttons via global configuration.

*Field Analyzer Features* 
![alt text](http://i.imgur.com/H9SRkRo.png "Field Analyzer Features")

Dashboard Features
-----------
- Terms can be hyperlinked - drill-down into a Term search and view the results.
- Term searches can be opened inside of a new window.
- Can exclude a Term from the Query using a button - Negate a search term directly from the widget (*Requires dashboard edit permissions*)
- **3.1/4.0** - Term hyperlinks, Remove from query, and Open Term search in new window buttons can be hidden - very customizable!

*Customize your dashboards*
![alt text](https://i.imgur.com/GSm9Yb1.png "Dashboard customization")

Dashboard Configuration Feature
-----------
- Can customize the field name used by the widget (Requires dashboard edit permissions)
- **3.1/4.0** Can now control display of term hyperlinks, remove from query, open term in new window buttons in dashboards.

Global System Configuration
-----------
Customize the default display values in the System/Configuration page.
- Pie Chart
- Add to Search Bar button 
- Remove from Search Bar button
- Term Hyperlinks (Dashboards)
- Exclude From Search Button (Dashboards)
- Open Term Search in New Window Button (Dashboards)

Installation
------------
* [Download the plugin](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases/)
and place the `.jar` file in your Graylog plugin directory. The plugin directory is the `plugins/` folder relative from your `graylog-server` directory by default and can be configured in your `graylog.conf` file.
* Restart `graylog-server`.
* In your web browser, force refresh (Ctrl + F5) a couple of times or clear your cache.

Features and Bugs
-----------
If you come across a bug, require further assistance, or have a great feature request, please file an [Issue](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/issues) providing as much detail as possible. 

Contributions to the code-base are greatly appreciated!

Related Graylog Issues
-----------
The following are Graylog issues that the QuickValuesPlus widget attempts to resolve.
* [#2459](https://github.com/Graylog2/graylog2-server/issues/2459) - Reverse quick values/Bottom-N
* [#2631](https://github.com/Graylog2/graylog2-server/issues/2631) - Feature request: rare values #2631
* [#1684](https://github.com/Graylog2/graylog2-server/issues/1684) - Make number of terms in quick values widget configurable
* [#3694](https://github.com/Graylog2/graylog2-server/issues/3694) - Add hyperlinks to "Quick Values" dashboard widgets
* [#3394](https://github.com/Graylog2/graylog2-server/issues/3394) - Widgets has no way to edit all properties after creation
   
Development
-----------
You can improve your development experience for the web interface part of your plugin dramatically by making use of hot reloading. 

To hot reload using Graylog 2.4, your plugin directory should be located two directories above your graylog2-web-server directory (../../) and the folder name of your plugin should be begin with graylog-plugin (More info [HERE](https://github.com/Graylog2/graylog2-server/blob/2.3/graylog2-web-interface/webpack.combined.config.js#L11))

##### Hot-loading setup with the plugin.

* Clone the Repositories
```
git clone -b "2.4.4" https://github.com/Graylog2/graylog2-server.git
git clone https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget.git
```

* Install the `graylog2-web-interface` node modules and build the Vendor Manifest
    - If you run `npm start`, it will build the Vendor Manifest for you.
```
cd graylog2-server/graylog2-web-interface
npm install
webpack --config webpack.vendor.js
```

* Install the `graylog-plugin-quickvaluesplus-widget` node modules
```
cd graylog-plugin-quickvaluesplus-widget
npm install
```

* To develop the plugin with hot-reloading, start the development web server
```
cd graylog2-server/graylog2-web-interface
npm start
```

##### Building the plugin.
* Follow the steps above for hot-loading, but **DO NOT** run the `npm start` command. (no need to start the dev web-server) 
* Run `mvn package` 
* Copy the generated JAR file located in the `/target` folder to the Graylog plugin directory.
* Restart Graylog
