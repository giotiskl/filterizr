import DefaultOptions from './options';
import { cloneDeep } from 'lodash';

class FilterItem {
  constructor($node) {
    this.$node = $node;

    const {
      filterOutCss,
      animationDuration,
      easing
    } = DefaultOptions;

    // set initial styles
    this.$node
    // init to filtered out
      .css(filterOutCss)
    // additional styles needed by filterizr 
      .css({
        '-webkit-backface-visibility': 'hidden',
        'perspective': '1000px',
        '-webkit-perspective': '1000px',
        '-webkit-transform-style': 'preserve-3d',
        'position': 'absolute',
        'transition': `all ${animationDuration}s ${easing}`,
        //'transition': 'all ' + parent.options.animationDuration + 's ' + parent.options.easing + ' ' + self._calcDelay() + 'ms'
      });
  }

  filterIn(targetPos) {
    // perform a deep clone of the filtering in css
    let filterInCss = cloneDeep(DefaultOptions.filterInCss);
    // enhance it with the target position towards which the item should animate
    filterInCss.transform += ' translate3d(' + targetPos.left + 'px,' + targetPos.top + 'px, 0)';
    // animate
    this.$node.css(filterInCss);
  }
}

export default FilterItem;
