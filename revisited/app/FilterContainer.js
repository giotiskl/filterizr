import FilterItem from './FilterItem';
import { map } from 'lodash';

class FilterContainer {
  constructor(selector, options) {
    // cache jQuery node
    this.$node = $(selector);

    // set props
    this.props = {
      w: this.getWidth(),
      h: this.getHeight(),
    }

    // set up initial styles of container
    this.$node.css({
      'padding' : 0,
      'position': 'relative'
    });
  }

  getFilterItems() {
    return map(this.$node.find('.filtr-item'), (item) => {
      return new FilterItem($(item));
    });
  }

  getHeight() {
    return this.$node.innerHeight();
  }

  getWidth() {
    return this.$node.innerWidth();
  }

  /**
   * Calculates the amounts of columns the FilterContainer
   * should have based on how many items can fit per row.
   */
  getColumns() {

  }

  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterContainer;
