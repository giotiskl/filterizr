import Filterizr from './filterizr';
import DefaultOptions from './options';

const fltr = new Filterizr('.filtr-container', DefaultOptions);
window.fltr = fltr;
window.$ = jQuery;
