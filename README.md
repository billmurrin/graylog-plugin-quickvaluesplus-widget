# QuickValuesPlus Widget Plugin for Graylog2
[![Github Downloads](https://img.shields.io/github/downloads/billmurrin/graylog-plugin-quickvaluesplus-widget/total.svg)](https://github.com/billmurrin/graylog-plugin-slookup-function/releases)
[![GitHub Release](https://img.shields.io/github/release/billmurrin/graylog-plugin-quickvaluesplus-widget.svg)](https://github.com/billmurrin/graylog-plugin-slookup-function/releases)
[![Build Status](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget.svg?branch=master)](https://travis-ci.org/billmurrin/graylog-plugin-quickvaluesplus-widget)

The QuickValuesPlus Widget is an enhanced fork of the GrayLog2 Quick Values Widget that ships with GrayLog2.

When the QuickValuesPlus Widget is added to a stream as a field analyzer it adds a "Remove from search" button. The button will negate the field in the search bar (E.g. !field_name:foo).

![alt text](http://i.imgur.com/0tfXFTu.png "Remove From Search Button")

In addition, the QuickValuesPlus Widget has extra features when added to dashboards, such as:
 * Support for **ascending** OR **descending** sort order in the datatable. Can now obtain true bottom values.
 * Editable number of Top/Bottom values (Quick Values default is 5). This is the one with a color in the table.
 * Customizable table size (Quick values default is 50).
  
![alt text](http://i.imgur.com/7PLDXCW.png "Example of Configuration Options")

In version 2.1.0, an options menu was introduced to help control the sort order, number of top values and the table size of the plugin when used in Search.

![alt text](http://i.imgur.com/TsZQxil.png "Example of Options Menu")

Options Menu Caveat
-----------

Right now, Graylog's REST API does not support a sort option for the RelativeSearch lookup on /terms. I plan on doing a Pull Request for this in the future.

With that means is that at this time we cannot obtain a "TRUE" ascending order query. The ascending order observed is actually based on a descending ordered query. 

If you want a true ascending query, simply add the visualization as a dashboard. The widget code does obtain the *TRUE* ascending order query. 

Required Graylog Versions
-----------
* Version 1.0.0 was tested and is compatible with Graylog version 2.1.3. 
* Version 2.1.0 was tested and is compatible with Graylog versions 2.2.1, 2.2.2, and 2.2.3
 
Please file a bug report providing as much detail as possible if you find that the plugin is not working.

Installation
------------
[Download the plugin](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases/)
and place the `.jar` file in your Graylog plugin directory. The plugin directory
is the `plugins/` folder relative from your `graylog-server` directory by default
and can be configured in your `graylog.conf` file.

Restart `graylog-server` and you are done.

Way Ahead - Next Version(s)
-----------
 * Add support to modify the field of the widget.
 * Add code to make the Dropdown menu go away after a selection.
 * Add a System Configuration menu to allow users to change the global defaults for sort order, top values, and table size.

Development
-----------
You can improve your development experience for the web interface part of your plugin
dramatically by making use of hot reloading. To do this, do the following:

* `git clone https://github.com/Graylog2/graylog2-server.git`
* `cd graylog2-server/graylog2-web-interface`
* `ln -s $YOURPLUGIN plugin/`
* `npm install && npm start`

If you run into issues with the current snapshot you can clone the 2.2.3 version of Graylog by using the following:

`git clone -b "2.2.3" https://github.com/Graylog2/graylog2-server.git`

**TIP** If you happen to use "[graylog-project](https://github.com/Graylog2/graylog-project)" and are having issues with the plugin compiling properly or not loading on the page, ensure your plugin's package.json has the same dependcies as "[graylog-plugin-sample](https://github.com/Graylog2/graylog-plugin-sample)". The example below has a few additional packages (crossfilter, d3, dc, deep-equal and immutable).

```
 "dependencies": {
    "reflux": "^0.2.12",
    "crossfilter": "1.3.x",
    "d3": "<=3.5.0",
    "dc": "2.0.0-beta.19",
    "deep-equal": "^1.0.1",
    "immutable": "^3.7.5"
  },
  "devDependencies": {
    "babel-core": "^6.0.0",
    "babel-loader": "^6.0.0",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-polyfill": "^6.0.0",
    "babel-preset-es2015": "^6.0.0",
    "babel-preset-react": "^6.0.0",
    "babel-preset-stage-0": "^6.0.0",
    "clean-webpack-plugin": "^0.1.3",
    "graylog-web-manifests": "^2.0.0-SNAPSHOT-1",
    "graylog-web-plugin": "~0.0.21",
    "json-loader": "^0.5.4",
    "react": "^0.14.6",
    "react-bootstrap": "^0.28.2",
    "react-dom": "^0.14.6",
    "react-hot-loader": "^3.0.0-beta.3",
    "react-proxy-loader": "^0.3.4",
    "webpack": "^1.12.2"
  }
```

Usage
-----

The QuickValuesPlus Widget is similar in nature to the Quick Values plugin, it is added as a Field Analyzer. When the Widget is added to a Dashboard the additional features become available and are editable.

Getting started
---------------

This project is using Maven 3 and requires Java 8 or higher.

* Clone this repository.
* Run `mvn package` to build a JAR file.
* Optional: Run `mvn jdeb:jdeb` and `mvn rpm:rpm` to create a DEB and RPM package respectively.
* Copy generated JAR file in target directory to your Graylog plugin directory.
* Restart the Graylog.