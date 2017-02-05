# QuickValuesPlus Widget Plugin for Graylog2

[![Build Status](https://travis-ci.org/https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget.svg?branch=master)](https://travis-ci.org/https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget)

The QuickValuesPlus Widget is a fork of the GrayLog2 Quick Values Widget that ships with GrayLog2.

When the QuickValuesPlus Widget is added to a stream as a field analyzer it adds a "Remove from search" column. The button will negate the field in the search bar (E.g. !field_name:foo).

In addition, the QuickValuesPlus Widget has extra features when added to a dashboard such as:
 * Support for **ascending** OR **descending** sort order in the datatable. Can now obtain true bottom values.
 * Editable number of Top/Bottom values (Quick Values default is 5). This is the one with a color in the table.
 * Customizable table size (Quick values default is 50).
  
**Required Graylog version:** 2.0 and later

The JAR was tested in GrayLog 2.1.3, but should hopefully work in others. Please file a bug report if not.

Way Ahead (Next Version)
-----------
 * Add customize menu to widget when attached to a stream which allows ability to toggle sort order, top values and table size.

Installation
------------
[Download the plugin](https://www.dropbox.com/s/f1a1yupql1mxgm8/graylog-plugin-quickvaluesplus-widget-1.0.0.jar?dl=0)
and place the `.jar` file in your Graylog plugin directory. The plugin directory
is the `plugins/` folder relative from your `graylog-server` directory by default
and can be configured in your `graylog.conf` file.

Restart `graylog-server` and you are done.

Development
-----------
You can improve your development experience for the web interface part of your plugin
dramatically by making use of hot reloading. To do this, do the following:

* `git clone https://github.com/Graylog2/graylog2-server.git`
* `cd graylog2-server/graylog2-web-interface`
* `ln -s $YOURPLUGIN plugin/`
* `npm install && npm start`

If you run into issues with the current snapshot you can clone the 2.1.3 version of Graylog by using the following:

`git clone -b "2.1.3" https://github.com/Graylog2/graylog2-server.git`

**TIP** If you happen to use "[graylog-project](https://github.com/Graylog2/graylog-project)" and are having issues with the plugin compiling properly or not loading on the page, ensure your plugin's package.json has the same dependcies as "[graylog-plugin-sample](https://github.com/Graylog2/graylog-plugin-sample)"

```
"dependencies": {
     "reflux": "^0.2.12",
     "crossfilter": "1.3.x",
     "d3": "<=3.5.0",
     "dc": "2.0.0-beta.19",     "deep-equal": "^1.0.1",
     "immutable": "^3.7.5"
   },
   "devDependencies": {
     "babel-core": "^5.x.x",
     "babel-loader": "^5.x.x",
     "graylog-web-manifests": "^2.0.0-SNAPSHOT-1",
     "graylog-web-plugin": "~0.0.17",
     "json-loader": "^0.5.4",
     "react": "^0.14.6",
     "react-bootstrap": "^0.28.2",
     "react-dom": "^0.14.6",
     "react-hot-loader": "^1.3.0",
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

Plugin Release
--------------

We are using the maven release plugin:

```
$ mvn release:prepare
[...]
$ mvn release:perform
```

This sets the version numbers, creates a tag and pushes to GitHub. Travis CI will build the release artifacts and upload to GitHub automatically.