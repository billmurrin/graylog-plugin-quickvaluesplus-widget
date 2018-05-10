## [4.0.0](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/releases/tag/4.0.0) (2018-05-09)
* Now works properly in GL 2.4.x
* Updated AddToDashboardMenuRev to work with GL 2.4
* Updated QuickValuesPlusStore to provide the correct parameters to ApiRoutes.UniversalSearchApiController.fieldTerms()
* Added Migration for version 4_0 of the QVP plugin
* Updated version information

## [3.1.0](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/tree/3.1.0) (2018-01-12)
* Merged #32 (@pbr0ck3r) - Add options to show/hide search buttons when creating a widget
* Now supports the configuration of defaults for the following:
    - Add / Remove to Search Bar (Field Analyzer)
    - Pie Chart Visibility
    - Show Terms with Hyperlinks (Only applies to Dashboards)
    - Exclude Term from Widget Search query button (Only applies to Dashboards)
    - Open Search Term Query in New Window (Only applies to Dashboards)
    - *Data Table Visibility is not a global configuration, only on widgets*
* Fixed #31 - Quick Values in Dashboard keep changing colors
* Removed debug code added in version 3.0. Not needed.

## [3.0.3](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/tree/3.0.2) (2018-01-06)
* Fixed *Open Search in New Window* button for `undefined` stream_id. 3.0.2 only fixed the links, not the button.
* Fixed bug - Global config value wasn't being sent to the widget upon the initial widget load - it required a menu selection first.
* Fixed bug - Config value was being reset to defaults in `QuickValuesPlusWidgetCreateConfiguration` after a Widget was added to a Dashboard. 
* Fixed WidgetMetaData GitHub page link.
 
## [3.0.2](https://github.com/billmurrin/graylog-plugin-quickvaluesplus-widget/tree/3.0.2) (2018-01-05)
* Fixed Issue #34 - invalid URLs for invalid search stream.
* Fixed Travis CI Config - .deb/.rpm plugins were not being created properly.