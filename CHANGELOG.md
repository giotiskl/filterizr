## Version 1.3.5
* Add support for Bootstrap v4+ and flex layouts
* Fix bug with infinite loop for sameWidth layout when window resizing and cols <= 0
* Add polyfill for Array.prototype.includes and String.prototype.includes for IE11
* Drop IE10 support, grids now use flex

## Version 1.3.4
* Fix bug where filter would be triggered multiple times through the controls
* Fix bug where the control event handlers would not be deregistered on `.destroy()` due to problematic selector

## Version 1.3.3
* Fix bug where items might overlap when the container is instantiated, by calling `updateFilterItemsDimensions` on instantiating the FilterContainer
* Fix all layout related bugs, stemming from inspecting the wrong collection, causing overlaps or incorrect container height

## Version 1.3.2
* Fix bug where if a filter was already active the `search` method did not correctly filter out items
* Set `jquery@^1.9.0` as `peerDependency` to Filterizr
* Set entry point of package.json to `./dist/jquery.filterizr-with-jquery.min.js` where Filterizr is bundled with jQuery and exports the jQuery objects with the Filterizr function registered on it.

## Version 1.3.1
* Fix bug where Filterizr would not be instantiated if the .filtr-container had more than one class names

## Version 1.3.0
* Gave a corerewrite to the plugin, with ES6 and Babel, maintaining a backwards compatible API.
* Added tests for most important methods.
* Dropped support for Bower.
* Added new API method ````.filterizr('insertItem', $node)````, which is used add a new item into the Filterizr grid.
* Added new API method ````.filterizr('destroy')````, which is used to destroy the Filterizr instance.
* Added new option ````multifilterLogicalOperator: ('or'|'and')```` to support different multifiltering modes.
* Added new option ````controlsSelector: ''```` allowing to easily target multiple controls if many Filterizr instances exist.
* Filtered out items will now receive a z-index: -1000 on top of the .filteredOut class making them non-clickable when not visible.

## Version 1.2.5
* Fixed the bug caused by selector property which was removed in jQuery version 3.
* Removed ````selector```` from configuration options.

## Version 1.2.3
* Added Bower support.
* Fixed a bug which made Filterizr incompatible with some other scripts (e.g. Mootools) due to using for..in loops on Arrays.
* Fixed a bug where .filteredOut items would be clickable by adding ```pointer-events: none``` on all filtered out items (for IE10 a ````.filteredOut { z-index: 1-; }```` rule is still needed in your CSS file).

## Version 1.2.2
* Improved UX of ````setOptions```` method when overriding the callbacks object in options. All undefined callbacks will now be set to an empty function by default.
* Fixed a bug in ````getCategory```` method of filtr items, where a string would be compared with a number, by using ````parseInt````.
* Fixed a bug in ````toggleFilter```` method where if the user would resize the window undefined would be added to the toggledOn filters and would cause an error to be thrown if the user switched off the categories.

## Version 1.2.1
* Fixed a minor bug which would occur in the absence of a search input field.

## Version 1.2.0
* Added new API method ````.filterizr('search', text)````, which is used to apply a search filter.
* Added new search control in the form of an input text which must have a data-search attribute.
* Updated public API methods to account for and apply the search filter over their intended operations.

## Version 1.1.0
* Added new API method ````.filterizr('toggleFilter', toggledFilter)````, which is used for the new multi-filtering mode.
* Added new filtering mode and filtering controls for multi-filtering. The user can now activate filters and display specific portions of the gallery alone or in combination. When all filters are turned of an unfiltered gallery is shown.
* All filtered out .filtr-item elements now get a 'filteredOut' class when they are filtered out of the visible elements, so that the user can target them if needed.
* Improved error checking, when the value of the ````data-category```` attribute of .filtr-item elements is not an integer or a string of integers delimited by ', ' a comprehensive error is thrown.

## Version 1.0.1
* Improved sorting functionality. Users can now sort based on custom data-attributes. Just add your custom data-attribute
(e.g. data-mySortData) and then call ````.filterizr('sort', 'mySortData', 'asc')```` Remember to omit the "data-" part when passing the attribute name as the parameter.
