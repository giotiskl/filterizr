# [Filterizr](http://yiotis.net/filterizr) [![Build Status](https://travis-ci.org/giotiskl/Filterizr.svg?branch=filterizr_revisited)](https://travis-ci.org/giotiskl/Filterizr)
If you use Filterizr in your project and wish to get it featured on Filterizr's website, let me know!

## Description
Filterizr is a jQuery plugin that sorts, shuffles, searches and applies stunning filters over responsive galleries using CSS3 transitions. Write your very own, custom effects in CSS and watch your gallery come to life!

## Install
You can install Filterizr by downloading the minified version on its website/repo or through NPM/Yarn:
```
npm install filterizr
```
or
```
yarn add filterizr
```

Two files can be found in the `./dist/` directory:
* `jquery.filterizr.min.js` is only Filterizr (without jQuery in the bundle). If you choose to use this distribution you will have to make sure that jQuery is globally imported before Filterizr in your code.
* `jquery.filterizr-with-jquery.min.js` is a distribution of Filterizr with jQuery (v3.3.1) inside the bundle.

## Documentation & Tutorials
### Basic usage
If you are building a simple static website and you are already importing jQuery yourself, make sure to download the `/dist/jquery.filterizr.min.js` and simply import it after jQuery.

If you are importing Filterizr from `/node_modules`, Filterizr's default export provide you with the global jQuery object extended with the Filterizr plugin:
```
import $ from 'filterizr'
```

### Tutorials & Docs
You can find Filterizr's documentation as well as a series of tutorials on how to install and operate Filterizr on [the Filterizr website](http://yiotis.net/filterizr).

### Tutorials
#### Initializing Filterizr
An example of importing and initializing Filterizr for the aforementioned HTML setup.
````
import Filterizr from 'filterizr';

// First you can optionally define some options
const options = {
  layout: 'packed',
};

// To instantiate your Filterizr you have to pass in the CSS
// selector of the container of your .filtr-items and an object
// of options. Both parameters are optional (default selector
// will be .filtr-container, for default options check docs)
const filterizr = new Filterizr('.filtr-container', options);
````

#### Filtering, sorting, shuffling, searching
Following the previous example if you want to perform some filtering,
sorting, shuffling or searching you can now use the Filterizr instance as follows:

````
import Filterizr from 'filterizr';

const filterizr = new Filterizr('.filtr-container');

// Call filterizr.filter passing in the
// category you would like to render
filterizr.filter('city');

// To shuffle the items around you can call
filterizr.shuffle();

// If you would like to search through the grid
// you can use the search method which will try
// to match the text contents of your .filtr-item
filterizr.search('magic')

// To sort the grid you can call the .sort method,
// passing in the name of the data-attribute you
// want to use for the sorting (default is index)
// which will sort the items by the order in which
// they appeared in the HTML, you can also set 'asc'
// or 'desc' for ascending or descending order
filterizr.sort('index', 'asc');
````

#### Filtering with multiple filters
Sometimes you might need to apply multiple filters, in which case you might choose to have
an "AND" logic (e.g. item must belong to both categories to render "new" and "shiny") or
an "OR" logic (e.g. item must belong either to "new" or "shiny" to render).

**Example A: with "OR" logic**
````
import Filterizr from 'filterizr';

// In the default options the prop multifilterLogicOperator is set to "or"
const filterizr = new Filterizr('.filtr-container');

// To filter with the "OR" logic which is the default simply use the
// .toggleFilter method.
filterizr.toggleFilter('new');
filterizr.toggleFilter('shiny');
````

**Example B: with "AND" logic**
````
import Filterizr from 'filterizr';

// To enable "and" logic filtering, we must explicitly set the option.
const filterizr = new Filterizr('.filtr-container', {
  multifilterLogicalOperator: 'and',
});

// Now using toggleFilter will require that an item belong to both
// categories so that it can be rendered
filterizr.toggleFilter('new');
filterizr.toggleFilter('shiny');
````

#### Updating the options
Once you have instantiated Filterizr you might wish to change the options it uses
to perform its magic. To do so you can follow the next example:

````
import Filterizr from 'filterizr';

// Will look for the selector '.filtr-container' and use default options
const filterizr = new Filterizr();

// Once you decide you would like to change the options you can call
// the following method passing in an object of options that will be
// merged with the defaults. After the options are set, a refiltering
// will occur to reflect the new state of your Filterizr
filterizr.setOptions({
  layout: 'packed',
});
````

#### Destroying a Filterizr instance
In case you would like to tear down the Filterizr instance:

````
import Filterizr from 'filterizr';

// Will look for the selector '.filtr-container' and use default options
const filterizr = new Filterizr();

// To destroy the Filterizr instance and leave the grid as plain HTML with
// no functionality attached you can call the destroy method
filterizr.destroy();
````

#### Inserting a new item to the grid
Sometimes you might need to load progressively items into the Filterizr grid, e.g. in case
you're progressively loading pictures on scroll. You can achieve this in the following way:

````
import Filterizr from 'filterizr';

// Will look for the selector '.filtr-container' and use default options
const filterizr = new Filterizr();

// To insert a new item you first must actually create it and add it to the DOM.
// Assuming you did that for an item with the id selector "#new-item", you would
// now have to get the DOM node and push it into the Filterizr instance like this:
const newItem = document.querySelector('#new-item');

filterizr.insertItem(newItem);
````

## Why Filterizr?
There is a number of similar plugins some of which are very well-tested and feature-rich (such as Isotope, MixItUp etc). 
However, Filterizr comes with the following advantages:
* Small filesize with compact functionality (~20kb).
* Thoroughly documented and easy to use.
* Performs great on mobile.
* Written in modern JavaScript.
* Has zero dependencies.

## Contributing
If you would like to contribute to Filterizr, please make sure to follow the steps described:
* Create a fork from `master` branch
* Add your feature or bug fix
* If you're implementing a method, add tests
* Run the tests and ESLint to make sure everything is ok
* Make your PR and set the base branch to `develop`

## Browser support
IE11 and all modern browsers.

## Donate
Did you enjoy Filterizr? Filterizr is and will always be 100% free, if you would like to show your support feel free to donate:
* **BTC**: 1JdpKt3aeNQuKF9CrUKeq3XkPswcqgAFpt
* **ETH**: 0xdb259cf059faf286e5834e95c8f3a973438276e8

## License
Filterizr is licensed under [the MIT License](https://opensource.org/licenses/MIT). Enjoy!
