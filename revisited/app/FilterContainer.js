import FilterItem from './FilterItem';
import { 
  each,
  map,
} from 'lodash';

class FilterContainer {
  constructor(selector) {
    // cache jQuery node
    this.$node = $(selector);

    // set props
    this.props = {
      // other props
      FilterItems: this.getFilterItems(),
      w: this.getWidth(),
      h: 0,
    }

    // set up initial styles of container
    this.$node.css({
      'padding' : 0,
      'position': 'relative'
    });
  }

  getFilterItems() {
    return map(this.$node.find('.filtr-item'), (item, index) => {
      return new FilterItem($(item), index);
    });
  }

  calcColumns(Layout) {
    switch(Layout) {
      case 'sameSize':
        return this.props.w / this.props.FilterItems[0].props.w;
    }

    // default case
    return this.props.w / this.props.FilterItems[0].props.w;
  }

  // Helpers determining dimensions
  updateHeight(newHeight) {
    this.props.h = newHeight;
    this.$node.css('height', newHeight);    
  }

  getWidth() {
    return this.$node.innerWidth();
  }

  // Event helpers
  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterContainer;
