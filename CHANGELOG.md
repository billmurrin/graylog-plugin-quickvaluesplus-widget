## [3.0.3](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/tree/3.0.2) (2018-01-06)
* Fixed *Open Search in New Window* button for `undefined` stream_id. 3.0.2 only fixed the links, not the button.
* Fixed bug - Global config value wasn't being sent to the widget upon the initial widget load - it required a menu selection first.
* Fixed bug - Config value was being reset to defaults in `QuickValuesPlusWidgetCreateConfiguration` after a Widget was added to a Dashboard. 
* Fixed WidgetMetaData GitHub page link.
 
## [3.0.2](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/tree/3.0.2) (2018-01-05)
* Fixed Issue #34 - invalid URLs for invalid search stream.
* Fixed Travis CI Config - .deb/.rpm plugins were not being created properly.