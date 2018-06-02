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
```import $ from 'filterizr'```

### Tutorials & Docs
You can find Filterizr's documentation as well as a series of tutorials on how to install and operate Filterizr on [the Filterizr website](http://yiotis.net/filterizr).

## Why Filterizr?
There is a number of similar plugins some of which are very well-tested and feature-rich (such as Isotope, MixItUp etc). 
However, Filterizr comes with the following advantages:
* Small filesize with compact functionality (~20kb).
* Thoroughly documented and easy to use.
* Performs great on mobile.
* Written in ES6
* Tested with Jest.

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
