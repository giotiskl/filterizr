import DefaultOptions from './options';
import { omit, cloneDeep } from 'lodash';

class FilterItem {
  constructor($node, index) {
    // extract needed options
    const {
      filterOutCss,
      animationDuration,
      easing
    } = DefaultOptions;

    // cache jQuery node
    this.$node = $node;

    // set props
    this.props = {
      data: (() => {
        // all data-attributes defined by the user, can be used for sorting
        const data = this.$node.data();
        return omit(data, ['category', 'sort']);
      })(),
      index,
      sortData: this.$node.data('sort'),
      lastPosition: { left: 0, top: 0 },
      w: this.getWidth(),
      h: this.getHeight(),
    }

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

  /* Filtering methods */
  filterIn(targetPos) {
    // perform a deep clone of the filtering in css
    let filterInCss = cloneDeep(DefaultOptions.filterInCss);
    // enhance it with the target position towards which the item should animate
    filterInCss.transform += ' translate3d(' + targetPos.left + 'px,' + targetPos.top + 'px, 0)';
    // animate
    this.$node.css(filterInCss);
    // update last position to be the targetPos
    this.props.lastPosition = targetPos;
  }

  filterOut() {
    // perform a deep clone of the filtering out css
    let filterOutCss = cloneDeep(DefaultOptions.filterOutCss);
    const { lastPosition } = this.props;
    //Auto add translate to transform over user-defined filterOut styles
    filterOutCss.transform += ' translate3d(' + lastPosition.left + 'px,' + lastPosition.top + 'px, 0)';
    //Play animation
    this.$node.css(filterOutCss);
  }

  /* Helper methods */
  getCategories() {
    return this.$node.attr('data-category').split(/\s*,\s*/g);
  }

  getHeight() {
    return this.$node.innerHeight();
  }

  getWidth() {
    return this.$node.innerWidth();
  }

  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterItem;
