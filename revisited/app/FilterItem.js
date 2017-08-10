import { cloneDeep } from './utils';

class FilterItem {
  constructor($node, index, options) {
    const {
      delay,
      delayMode,
      filterOutCss,
      animationDuration,
      easing
    } = options;

    // cache jQuery node
    this.$node = $node;

    // set props
    this.props = {
      data: (() => {
        // all data-attributes defined by the user, can be used for sorting
        const data = this.$node.data();
        // remove category and sort which could be there by API design
        delete data.category;
        delete data.sort;
        return data;
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
        'transition': `all ${animationDuration}s ${easing} ${this.calcDelay(delay, delayMode)}ms`,
      });
  }

  /* Filtering methods */
  filterIn(targetPos, cssOptions) {
    // perform a deep clone of the filtering in css
    let filterInCss = cloneDeep(cssOptions);
    // enhance it with the target position towards which the item should animate
    filterInCss.transform += ' translate3d(' + targetPos.left + 'px,' + targetPos.top + 'px, 0)';
    // animate
    this.$node.css(filterInCss);
    // update last position to be the targetPos
    this.props.lastPosition = targetPos;
  }

  filterOut(cssOptions) {
    // perform a deep clone of the filtering out css
    let filterOutCss = cloneDeep(cssOptions);
    const { lastPosition } = this.props;
    //Auto add translate to transform over user-defined filterOut styles
    filterOutCss.transform += ' translate3d(' + lastPosition.left + 'px,' + lastPosition.top + 'px, 0)';
    //Play animation
    this.$node.css(filterOutCss);
  }

  /* Helper methods */
  calcDelay(delay, delayMode) {
    let ret = 0;

    if (delayMode === 'progressive')
      ret = delay * this.props.index;
    else
      if (this.props.index % 2 === 0)
        ret = delay;

    return ret;
  }

  getContentsLowercase() {
    return this.$node.text().toLowerCase();
  }

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

  updateDimensions() {
    this.props.w = this.getWidth();
    this.props.h = this.getHeight();
  }
}

export default FilterItem;
