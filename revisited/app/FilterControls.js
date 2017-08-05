import { debounce } from 'lodash';

class FilterControls {
  /**
   * @param {object} Filterizr keep a ref to the Filterizr object to control actions
   * @param {string} selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  constructor(Filterizr, selector = '') {
    this.props = {
      Filterizr,
      selector
    }

    this.setupFilterControls();
    this.setupShuffleControls();
    this.setupSearchControls();
    this.setupSortControls();
  }

  setupFilterControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    $(`${selector} *[data-filter]`).on('click', (evt) => {
      const $ctrl = $(evt.target);
      const targetFilter = $ctrl.attr('data-filter');

      // update active filter in Filterizr's options
      Filterizr.setOptions({
        filter: targetFilter,
      });

      Filterizr.filter(Filterizr.options.filter);
    });
  }

  setupShuffleControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    $(`${selector} *[data-shuffle]`).on('click', (evt) => {
      Filterizr.shuffle();
    });
  }

  setupSearchControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    const handler = 

    $(`${selector} *[data-search]`).on('keyup', debounce((evt) => {
      const $textfield = $(evt.target);
      const val = $textfield.val();
      
      Filterizr.props.searchTerm = val.toLowerCase();
      Filterizr.filter(Filterizr.options.filter);
    }, 250));
  }

  setupSortControls() {
    const {
      Filterizr,
      selector
    } = this.props;

    $(`${selector} *[data-sortAsc]`).on('click', (evt) => {
      const sortAttr = $(`${selector} *[data-sortOrder]`).val();
      Filterizr.props.sortOrder = 'asc';
      Filterizr.sort(sortAttr, 'asc');
    });
    $(`${selector} *[data-sortDesc]`).on('click', (evt) => {
      const sortAttr = $(`${selector} *[data-sortOrder]`).val();
      Filterizr.props.sortOrder = 'desc';
      Filterizr.sort(sortAttr, 'desc');
    });
  }
}

export default FilterControls;
