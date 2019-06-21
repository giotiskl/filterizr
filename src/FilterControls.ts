import Filterizr from './Filterizr';
import { debounce } from './utils';

class FilterControls {
  filterControls: NodeListOf<Element>;
  multiFilterControls: NodeListOf<Element>;
  shuffleControls: NodeListOf<Element>;
  searchControls: NodeListOf<Element>;
  sortAscControls: NodeListOf<Element>;
  sortDescControls: NodeListOf<Element>;
  props: {
    Filterizr: Filterizr;
    selector: string;
    handlers: {
      filterControlsHandler: EventListener;
      multiFilterControlsHandler: EventListener;
      shuffleControlsHandler: EventListener;
      searchControlsHandler: EventListener;
      sortAscControlsHandler: EventListener;
      sortDescControlsHandler: EventListener;
    };
  };

  /**
   * @param {object} Filterizr keep a ref to the Filterizr object to control actions
   * @param {string} selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  constructor(Filterizr: Filterizr, selector = '') {
    this.filterControls = document.querySelectorAll(`${selector}[data-filter]`);
    this.multiFilterControls = document.querySelectorAll(
      `${selector}[data-multifilter]`
    );
    this.shuffleControls = document.querySelectorAll(
      `${selector}[data-shuffle]`
    );
    this.searchControls = document.querySelectorAll(`${selector}[data-search]`);
    this.sortAscControls = document.querySelectorAll(
      `${selector}[data-sortAsc]`
    );
    this.sortDescControls = document.querySelectorAll(
      `${selector}[data-sortDesc]`
    );

    this.props = {
      Filterizr,
      selector,
      handlers: {
        filterControlsHandler: null,
        multiFilterControlsHandler: null,
        shuffleControlsHandler: null,
        searchControlsHandler: null,
        sortAscControlsHandler: null,
        sortDescControlsHandler: null,
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
   * @returns {undefined}
   */
  setupFilterControls(): void {
    const {
      filterControls,
      multiFilterControls,
      props: { Filterizr },
    } = this;

    // Single filter mode controls
    if (filterControls) {
      this.props.handlers.filterControlsHandler = evt => {
        const ctrl: Element = <Element>evt.currentTarget;
        const targetFilter: string = ctrl.getAttribute('data-filter');
        // Update active filter in Filterizr's options
        Filterizr.options.filter = targetFilter;
        // Trigger filter
        Filterizr.filter(Filterizr.options.filter);
      };

      filterControls.forEach((control: Element) =>
        control.addEventListener(
          'click',
          this.props.handlers.filterControlsHandler
        )
      );
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      this.props.handlers.multiFilterControlsHandler = evt => {
        const ctrl: Element = <Element>evt.target;
        const targetFilter = ctrl.getAttribute('data-multifilter');
        Filterizr.toggleFilter(targetFilter);
      };

      multiFilterControls.forEach(control =>
        control.addEventListener(
          'click',
          this.props.handlers.multiFilterControlsHandler
        )
      );
    }
  }

  destroyFilterControls(): void {
    const { filterControls, multiFilterControls } = this;

    // Single filter mode controls
    if (filterControls) {
      filterControls.forEach(control =>
        control.removeEventListener(
          'click',
          this.props.handlers.filterControlsHandler
        )
      );
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      multiFilterControls.forEach(control =>
        control.removeEventListener(
          'click',
          this.props.handlers.multiFilterControlsHandler
        )
      );
    }
  }

  /**
   * Sets up the controls for shuffling
   * @returns {undefined}
   */
  setupShuffleControls(): void {
    const {
      shuffleControls: controls,
      props: { Filterizr },
    } = this;

    if (controls) {
      this.props.handlers.shuffleControlsHandler = () => {
        Filterizr.shuffle();
      };

      controls.forEach(control =>
        control.addEventListener(
          'click',
          this.props.handlers.shuffleControlsHandler
        )
      );
    }
  }

  destroyShuffleControls(): void {
    const { shuffleControls: controls } = this;

    if (controls) {
      controls.forEach(control =>
        control.removeEventListener(
          'click',
          this.props.handlers.shuffleControlsHandler
        )
      );
    }
  }
  /**
   * Sets up the controls for searching
   * @returns {undefined}
   */
  setupSearchControls(): void {
    const {
      searchControls: controls,
      props: { Filterizr },
    } = this;

    if (controls) {
      this.props.handlers.searchControlsHandler = <EventListener>debounce(
        (evt: Event) => {
          const textfield: HTMLInputElement = <HTMLInputElement>evt.target;
          const val = textfield.value;
          Filterizr.props.searchTerm = val.toLowerCase();
          Filterizr.search(Filterizr.props.searchTerm);
        },
        250,
        false
      );

      controls.forEach(control =>
        control.addEventListener(
          'keyup',
          this.props.handlers.searchControlsHandler
        )
      );
    }
  }

  destroySearchControls(): void {
    const { searchControls: controls } = this;

    if (controls) {
      controls.forEach(control =>
        control.removeEventListener(
          'keyup',
          this.props.handlers.searchControlsHandler
        )
      );
    }
  }

  /**
   * Sets up the controls for sorting
   * @returns {undefined}
   */
  setupSortControls(): void {
    const {
      sortAscControls,
      sortDescControls,
      props: { Filterizr, selector },
    } = this;

    if (sortAscControls) {
      this.props.handlers.sortAscControlsHandler = () => {
        const sortAttr: string = (<HTMLInputElement>(
          document.querySelector(`${selector}[data-sortOrder]`)
        )).value;
        Filterizr.props.sortOrder = 'asc';
        Filterizr.sort(sortAttr, 'asc');
      };

      sortAscControls.forEach(control =>
        control.addEventListener(
          'click',
          this.props.handlers.sortAscControlsHandler
        )
      );
    }

    if (sortDescControls) {
      this.props.handlers.sortDescControlsHandler = () => {
        const sortAttr = (<HTMLInputElement>(
          document.querySelector(`${selector}[data-sortOrder]`)
        )).value;
        Filterizr.props.sortOrder = 'desc';
        Filterizr.sort(sortAttr, 'desc');
      };

      sortDescControls.forEach(control =>
        control.addEventListener(
          'click',
          this.props.handlers.sortDescControlsHandler
        )
      );
    }
  }

  destroySortControls(): void {
    const { sortAscControls, sortDescControls } = this;

    if (sortAscControls) {
      sortAscControls.forEach(control =>
        control.removeEventListener(
          'click',
          this.props.handlers.sortAscControlsHandler
        )
      );
    }

    if (sortDescControls) {
      sortDescControls.forEach(control =>
        control.removeEventListener(
          'click',
          this.props.handlers.sortDescControlsHandler
        )
      );
    }
  }
}

export default FilterControls;
