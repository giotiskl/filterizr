import { debounce } from './utils';

class FilterControls {
  /**
   * @param {object} Filterizr keep a ref to the Filterizr object to control actions
   * @param {string} selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  constructor(Filterizr, selector = '') {
    this.filterControls = document.querySelectorAll(`${selector}[data-filter]`);
    this.multiFilterControls = document.querySelectorAll(`${selector}[data-multifilter]`);
    this.shuffleControls = document.querySelectorAll(`${selector}[data-shuffle]`);
    this.searchControls = document.querySelectorAll(`${selector}[data-search]`);
    this.sortAscControls = document.querySelectorAll(`${selector}[data-sortAsc]`);
    this.sortDescControls = document.querySelectorAll(`${selector}[data-sortDesc]`);

    this.props = {
      Filterizr,
      selector,
      handlers: {
        filterControlsHandler: () => {},
        multiFilterControlsHandler: () => {},
        shuffleControlsHandler: () => {},
        searchControlsHandler: () => {},
        sortAscControlsHandler: () => {},
        sortDescControlsHandler: () => {},
      },
    };
  }

  initialize() {
    this.setupFilterControls();
    this.setupShuffleControls();
    this.setupSearchControls();
    this.setupSortControls();
  }

  destroy() {
    this.destroyFilterControls();
    this.destroyShuffleControls();
    this.destroySearchControls();
    this.destroySortControls();
  }

  /**
   * Sets up the controls for filtering
   */
  setupFilterControls() {
    const { filterControls, multiFilterControls, props: { Filterizr } } = this;

    // Single filter mode controls
    if (filterControls) {
      this.props.handlers.filterControlsHandler = (evt) => {
        const ctrl = evt.currentTarget;
        const targetFilter = ctrl.getAttribute('data-filter');
        // Update active filter in Filterizr's options
        Filterizr.options.filter = targetFilter;
        // Trigger filter
        Filterizr.filter(Filterizr.options.filter);
      };

      filterControls.forEach((control) => control.addEventListener('click', this.props.handlers.filterControlsHandler));
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      this.props.handlers.multiFilterControlsHandler = (evt) => {
        const ctrl = evt.target;
        const targetFilter = ctrl.getAttribute('data-multifilter');
        Filterizr.toggleFilter(targetFilter);
      };

      multiFilterControls.forEach((control) => control.addEventListener('click', this.props.handlers.multiFilterControlsHandler));
    }
  }

  destroyFilterControls() {
    const { filterControls, multiFilterControls } = this;

    // Single filter mode controls
    if (filterControls) {
      filterControls.forEach((control) => control.removeEventListener('click', this.props.handlers.filterControlsHandler));
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      multiFilterControls.forEach((control) => control.removeEventListener('click', this.props.handlers.multiFilterControlsHandler));
    }
  }

  /**
   * Sets up the controls for shuffling
   */
  setupShuffleControls() {
    const { shuffleControls: controls, props: { Filterizr } } = this;

    if (controls) {
      this.props.handlers.shuffleControlsHandler = () => {
        Filterizr.shuffle();
      };

      controls.forEach((control) => control.addEventListener('click', this.props.handlers.shuffleControlsHandler));
    }
  }

  destroyShuffleControls() {
    const { shuffleControls: controls } = this;

    if (controls) {
      controls.forEach((control) => control.removeEventListener('click', this.props.handlers.shuffleControlsHandler));
    }
  }
  /**
   * Sets up the controls for searching
   */
  setupSearchControls() {
    const { searchControls: controls, props: { Filterizr } } = this;

    if (controls) {
      this.props.handlers.searchControlsHandler = debounce((evt) => {
        const textfield = evt.target;
        const val = textfield.value;
        Filterizr.props.searchTerm = val.toLowerCase();
        Filterizr.search(Filterizr.props.searchTerm);
      }, 250);

      controls.forEach((control) => control.addEventListener('keyup', this.props.handlers.searchControlsHandler));
    }
  }

  destroySearchControls() {
    const { searchControls: controls } = this;

    if (controls) {
      controls.forEach((control) => control.removeEventListener('keyup', this.props.handlers.searchControlsHandler));
    }
  }

  /**
   * Sets up the controls for sorting
   */
  setupSortControls() {
    const { sortAscControls, sortDescControls, props: { Filterizr, selector } } = this;

    if (sortAscControls) {
      this.props.handlers.sortAscControlsHandler = () => {
        const sortAttr = document.querySelector(`${selector}[data-sortOrder]`).value;
        Filterizr.props.sortOrder = 'asc';
        Filterizr.sort(sortAttr, 'asc');
      };

      sortAscControls.forEach((control) => control.addEventListener('click', this.props.handlers.sortAscControlsHandler));
    }

    if (sortDescControls) {
      this.props.handlers.sortDescControlsHandler = () => {
        const sortAttr = document.querySelector(`${selector}[data-sortOrder]`).value;
        Filterizr.props.sortOrder = 'desc';
        Filterizr.sort(sortAttr, 'desc');
      };

      sortDescControls.forEach((control) => control.addEventListener('click', this.props.handlers.sortDescControlsHandler));
    }
  }

  destroySortControls() {
    const { sortAscControls, sortDescControls } = this;

    if (sortAscControls) {
      sortAscControls.forEach((control) => control.removeEventListener('click', this.props.handlers.sortAscControlsHandler));
    }

    if (sortDescControls) {
      sortDescControls.forEach((control) => control.removeEventListener('click', this.props.handlers.sortDescControlsHandler));
    }
  }
}

export default FilterControls;

