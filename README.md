# [Filterizr](http://yiotis.net/filterizr)
If you use Filterizr in your project and wish to get it featured on Filterizr's website, let me know!

## Description
Filterizr is a jQuery plugin that sorts, shuffles, searches and applies stunning filters over responsive galleries using CSS3 transitions. Write your very own, custom effects in CSS and watch your gallery come to life!

## Install
You can install Filterizr by downloading the minified version from its website or through NPM or Bower:
```
npm install filterizr
```
or
```
bower install filterizr
```

## Documentation & Tutorials
You can find Filterizr's documentation as well as a series of tutorials on how to install and operate Filterizr on [the Filterizr website](http://yiotis.net/filterizr).

## Why Filterizr?
There is a number of similar plugins some of which are very well-tested and feature-rich (such as Isotope, MixItUp etc). In my opinion the advantages of Filterizr is that despite its minute filesize (about 10.5kb), it comes with many features. It is very easy to use and setup, highly customizable and its performance is very fast and smooth (try it on mobile!).

## Browser support
IE10+ and all modern browsers.

## License
Filterizr is licensed under [the MIT License](https://opensource.org/licenses/MIT) (i.e. you do whatever you want with it). Enjoy!

## Additionnal Documentation for new feature
to be added to the website tutorial
### group-label.
this feature permit to have string in datafilter in the following format :
``
<li data-filter="color-1"> Green </li>
<li data-filter="color-2"> Orange </li>
``
the label is ignored in normal mode and in multi-filtering (toggle) mode. in these mode, `"color-1"` and `"fruit-1"` would be treated the same (and broke the filtering);
in group-filtering mode, the value is ignored if the label does not correspond to the group name. `"color-1"` would only be matched by value "1" of group "color" and ignored elsewhere.

### group filtering mode
this feature make it possible to have AND logical operation with filter.

to use it, you need to use the `data-groupmultifilter` attribute and give him a name and a value.

```
<ul>                                    
    <li data-groupmultifilter="color-1"> Red </li>
    <li data-groupmultifilter="color-2"> Green </li>
    <li data-groupmultifilter="color-3"> Blue </li>
    <li data-groupmultifilter="size-4"> Small </li>
    <li data-groupmultifilter="size-5"> Medium </li>
    <li data-groupmultifilter="size-6"> Large </li>
</ul>
```

the element can of course be placed in multiple `<ul>` tag, but it is not mandatory to do so. only the label in `data-groupmultifilter` is used to separate group.

with the feature of group-label, it is possible to reuse number in distinct group.
```
<ul>                                    
    <li data-groupmultifilter="color-1"> Red </li>
    <li data-groupmultifilter="color-2"> Green </li>
    <li data-groupmultifilter="color-3"> Blue </li>
    <li data-groupmultifilter="size-1"> Small </li>
    <li data-groupmultifilter="size-2"> Medium </li>
    <li data-groupmultifilter="size-3"> Large </li>
</ul>
```

will work as expected, but only in group multifilter mode.
in toggle mode and in normal mode, the script will simpli ignore label, resulting in the same behaviour as
```
<ul>                                    
    <li data-groupmultifilter="1"> Red </li>
    <li data-groupmultifilter="2"> Green </li>
    <li data-groupmultifilter="3"> Blue </li>
    <li data-groupmultifilter="1"> Small </li>
    <li data-groupmultifilter="2"> Medium </li>
    <li data-groupmultifilter="3"> Large </li>
</ul>
```
which doesn't work as expected.

### onFilteringStart and onFilteringEnd callback
the filteringStart event and the onFilteringStart callback receive 

```
filtrizr.on('filteringStart', function(event, previousCategory, newCategory) {
    
})

fltr.filterizr('setOptions', {
   callbacks: {
      onFilteringStart: function(previousCategory, newCategory) {
         //your code here 
      }
   }
})
```

in normal mode, `previousCategory` and `newCategory` are string with the number (or string all) of the previous and new category filtered
in toggle mode, its an object in format :
```
{
    1 : true,
    4 : true,
    5 : true
}
```
changing the object does NOT change the actual filtering. (this is a copy of the private object _toggledCategories)

in group mode, it is an object in format :
```
{
    group1 : {
        1 : true,
        5 : true
    },
    group2 : {
        3 : true
    }
}
```
changing the object does not change the actual filtering. (this is a copy of the private object _toggledCategoriesGroup)

the filteringEnd event and the onFilteringEnd callback only receive the newCategory parameter.