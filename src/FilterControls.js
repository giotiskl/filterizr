import {
  debounce, 
} from './utils';

class FilterControls {
  /**
   * @param {object} Filterizr keep a ref to the Filterizr object to control actions
   * @param {string} selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  constructor(Filterizr, selector = '') {
    this.props = {
      Filterizr,
      selector,
    };

    this.setupFilterControls();
    this.setupShuffleControls();
    this.setupSearchControls();
    this.setupSortControls();
  }

  /**
   * Sets up the controls for filtering
   */
  setupFilterControls() {
    const {
      Filterizr,
      selector,
    } = this.props;

    // Single filter mode controls
    const filterControls = document.querySelectorAll(`${selector}[data-filter]`);
    if (filterControls) {
      filterControls.forEach((control) => {
        control.addEventListener('click', (evt) => {
          const ctrl = evt.currentTarget;
          const targetFilter = ctrl.getAttribute('data-filter');
          // Update active filter in Filterizr's options
          Filterizr.options.filter = targetFilter;
          // Trigger filter
          Filterizr.filter(Filterizr.options.filter);
        });
      });
    }

    // Multifilter mode controls
    const multiFilterControls = document.querySelectorAll(`${selector}[data-multifilter]`);
    if (multiFilterControls) {
      multiFilterControls.forEach((control) => {
        control.addEventListener('click', (evt) => {
          const ctrl = evt.target;
          const targetFilter = ctrl.getAttribute('data-multifilter');
          Filterizr.toggleFilter(targetFilter);
        });
      });
    }
  }

  /**
   * Sets up the controls for shuffling
   */
  setupShuffleControls() {
    const {
      Filterizr,
      selector,
    } = this.props;

    const controls = document.querySelectorAll(`${selector}[data-shuffle]`);
    if (controls) {
      controls.forEach((control) => {
        control.addEventListener('click', () => {
          Filterizr.shuffle();
        });
      });
    }
  }

  /**
   * Sets up the controls for searching
   */
  setupSearchControls() {
    const {
      Filterizr,
      selector,
    } = this.props;

    const controls = document.querySelectorAll(`${selector}[data-search]`);
    if (controls) {
      controls.forEach((control) => {
        control.addEventListener('keyup', debounce((evt) => {
          const textfield = evt.target;
          const val = textfield.value;
          Filterizr.props.searchTerm = val.toLowerCase();
          Filterizr.search(Filterizr.props.searchTerm);
        }, 250));
      });
    }
  }

  /**
   * Sets up the controls for sorting
   */
  setupSortControls() {
    const {
      Filterizr,
      selector,
    } = this.props;

    const sortAscControls = document.querySelectorAll(`${selector}[data-sortAsc]`);
    if (sortAscControls) {
      sortAscControls.forEach((control) => {
        control.addEventListener('click', () => {
          const sortAttr = document.querySelector(`${selector}[data-sortOrder]`).value;
          Filterizr.props.sortOrder = 'asc';
          Filterizr.sort(sortAttr, 'asc');
        });
      });
    }

    const sortDescControls = document.querySelectorAll(`${selector}[data-sortDesc]`);
    if (sortDescControls) {
      sortDescControls.forEach((control) => {
        control.addEventListener('click', () => {
          const sortAttr = document.querySelector(`${selector}[data-sortOrder]`).value;
          Filterizr.props.sortOrder = 'desc';
          Filterizr.sort(sortAttr, 'desc');
        });
      });
    }
  }
}

export default FilterControls;

