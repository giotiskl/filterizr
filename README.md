# [<img src="./filterizr_logo.png" width="145" height="30" alt="Filterizr logo" />](http://yiotis.net/filterizr)<br/> [![Build Status](https://travis-ci.org/giotiskl/Filterizr.svg?branch=filterizr_revisited)](https://travis-ci.org/giotiskl/Filterizr) <img src="https://img.shields.io/npm/v/filterizr.svg" alt="NPM version" /> <img src="https://img.shields.io/npm/dm/filterizr.svg" alt="NPM monthly downloads" /> <img src="https://img.shields.io/github/license/giotiskl/filterizr.svg" alt="license badge" />

## Description

Filterizr is a JavaScript library that sorts, shuffles, searches and applies stunning filters over responsive galleries using CSS3 transitions. Write your very own, custom effects in CSS and watch your gallery come to life!

It can also be used as a jQuery plugin.

## Install

You can install Filterizr by downloading the minified version on its website/repo or through npm/yarn:

```
npm install filterizr
```

or

```
yarn add filterizr
```

Three files can be found in the `./dist/` directory:

- `filterizr.min.js` is the pure Filterizr JavaScript library that can be used using CommonJS (or ES6) imports, it is the main entry point when installing via npm.
- `vanilla.filterizr.min.js` is a distribution of Filterizr which can be used directly in a `<script>` tag, as it exposes the Filterizr library as a global.
- `jquery.filterizr.min.js` is a distribution of Filterizr as a jQuery plugin. It detects and extends the global jQuery object and also exposes the vanilla Filterizr library as a global.

## Documentation & Tutorials

### Basic usage

If you are building a simple static website and would like to use Filterizr via `<script>` tag make sure to download `/dist/vanilla.filterizr.min.js` and load it.

If you would like to use the jQuery variation then include `/dist/jquery.filterizr.min.js` in a `<script>` tag. Make sure to import it after jQuery itself.

If you are importing Filterizr from `/node_modules`, Filterizr's default export provide you with the vanilla JavaScript library:

```
import Filterizr from 'filterizr'
```

If you are using jQuery in that same project, also installed via npm and you would like to use Filterizr as a jQuery plugin then you can call the static method `Filterizr.installAsJQueryPlugin`, passing in the jQuery object as follows:

```
import $ from 'jquery';
import Filterizr from 'filterizr';

// This will extend the $.fn prototype with Filterizr
Filterizr.installAsJQueryPlugin($);

$('.filter-container').filterizr('filter', 5); // or any other Filterizr API call
```

### Tutorials & Docs

You can find Filterizr's documentation as well as a series of tutorials on how to install and operate Filterizr on [the Filterizr website](http://yiotis.net/filterizr). Here is a list of contents:

Contents:

- Documentation
  - [Vanilla JavaScript Filterizr](https://yiotis.net/filterizr/#/documentation/vanilla/options)
  - [jQuery Filterizr](https://yiotis.net/filterizr/#/documentation/jquery/options)
- Tutorials
  - [Getting started](https://yiotis.net/filterizr/#/tutorials/quickstart)
  - [Filtering](https://yiotis.net/filterizr/#/tutorials/filtering)
  - [Sorting](https://yiotis.net/filterizr/#/tutorials/sorting)
  - [Searching](https://yiotis.net/filterizr/#/tutorials/searching)
  - [Delay modes](https://yiotis.net/filterizr/#/tutorials/delay-modes)
  - [Layouts](https://yiotis.net/filterizr/#/tutorials/layouts)
  - [Loading spinner](https://yiotis.net/filterizr/#/tutorials/loading-animation)
  - [Using as jQuery plugin](https://yiotis.net/filterizr/#/tutorials/as-jquery-plugin)
- [FAQ & Caveats](https://yiotis.net/filterizr/#/faq)

## Why Filterizr?

- Thoroughly documented and easy to use.
- Performs great on mobile.
- Written in TypeScript.
- Has zero dependencies.

## Contributing

If you would like to contribute to Filterizr, please make sure to follow the steps described:

- Create a fork from `master` branch
- Add your feature or bug fix
- If you're implementing a method, add tests
- Run the tests and ESLint to make sure everything is ok
- Make your PR and set the base branch to `develop`

## Browser support

IE11 and all modern browsers.

## Donate

Did you enjoy Filterizr? Filterizr is and will always be 100% free, if you would like to show your support feel free to donate:

- **BTC**: 1JdpKt3aeNQuKF9CrUKeq3XkPswcqgAFpt
- **ETH**: 0xdb259cf059faf286e5834e95c8f3a973438276e8
- **Paypal**: https://www.paypal.me/yiotiskl

## License

Filterizr is licensed under [the MIT License](https://opensource.org/licenses/MIT). Enjoy!
