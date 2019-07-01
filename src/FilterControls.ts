import Filterizr from './Filterizr';
import { debounce } from './utils';

class FilterControls {
  private filterControls: NodeListOf<Element>;
  private multiFilterControls: NodeListOf<Element>;
  private shuffleControls: NodeListOf<Element>;
  private searchControls: NodeListOf<Element>;
  private sortAscControls: NodeListOf<Element>;
  private sortDescControls: NodeListOf<Element>;
  private props: {
    filterizr: Filterizr;
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
   * @param filterizr keep a ref to the Filterizr object to control actions
   * @param selector optionally the selector of the .filtr-controls, used when
   *                          there is a need to have multiple Filterizr instances
   */
  public constructor(filterizr: Filterizr, selector: string = '') {
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
      filterizr,
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

    this.initialize();
  }

  public destroy(): void {
    this.destroyFilterControls();
    this.destroyShuffleControls();
    this.destroySearchControls();
    this.destroySortControls();
  }

  private initialize(): void {
    this.setupFilterControls();
    this.setupShuffleControls();
    this.setupSearchControls();
    this.setupSortControls();
  }

  /**
   * Sets up the controls for filtering
   * @returns {undefined}
   */
  private setupFilterControls(): void {
    const {
      filterControls,
      multiFilterControls,
      props: { filterizr },
    } = this;

    // Single filter mode controls
    if (filterControls) {
      this.props.handlers.filterControlsHandler = (evt): void => {
        const ctrl: Element = evt.currentTarget as Element;
        const targetFilter: string = ctrl.getAttribute('data-filter');
        filterizr.filter(targetFilter);
      };

      filterControls.forEach((control: Element): void =>
        control.addEventListener(
          'click',
          this.props.handlers.filterControlsHandler
        )
      );
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      this.props.handlers.multiFilterControlsHandler = (evt): void => {
        const ctrl: Element = evt.target as Element;
        const targetFilter = ctrl.getAttribute('data-multifilter');
        filterizr.toggleFilter(targetFilter);
      };

      multiFilterControls.forEach((control): void =>
        control.addEventListener(
          'click',
          this.props.handlers.multiFilterControlsHandler
        )
      );
    }
  }

  private destroyFilterControls(): void {
    const { filterControls, multiFilterControls } = this;

    // Single filter mode controls
    if (filterControls) {
      filterControls.forEach((control): void =>
        control.removeEventListener(
          'click',
          this.props.handlers.filterControlsHandler
        )
      );
    }

    // Multifilter mode controls
    if (multiFilterControls) {
      multiFilterControls.forEach((control): void =>
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
  private setupShuffleControls(): void {
    const {
      shuffleControls: controls,
      props: { filterizr },
    } = this;

    if (controls) {
      this.props.handlers.shuffleControlsHandler = (): void => {
        filterizr.shuffle();
      };

      controls.forEach((control): void =>
        control.addEventListener(
          'click',
          this.props.handlers.shuffleControlsHandler
        )
      );
    }
  }

  private destroyShuffleControls(): void {
    const { shuffleControls: controls } = this;

    if (controls) {
      controls.forEach((control): void =>
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
  private setupSearchControls(): void {
    const {
      searchControls: controls,
      props: { filterizr },
    } = this;

    if (controls) {
      this.props.handlers.searchControlsHandler = debounce(
        (evt: Event): void => {
          const textfield: HTMLInputElement = evt.target as HTMLInputElement;
          const searchTerm = textfield.value;
          filterizr.search(searchTerm);
        },
        250,
        false
      ) as EventListener;

      controls.forEach((control): void =>
        control.addEventListener(
          'keyup',
          this.props.handlers.searchControlsHandler
        )
      );
    }
  }

  private destroySearchControls(): void {
    const { searchControls: controls } = this;

    if (controls) {
      controls.forEach((control): void =>
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
  private setupSortControls(): void {
    const {
      sortAscControls,
      sortDescControls,
      props: { filterizr, selector },
    } = this;

    if (sortAscControls) {
      this.props.handlers.sortAscControlsHandler = (): void => {
        const sortAttr: string = (document.querySelector(
          `${selector}[data-sortOrder]`
        ) as HTMLInputElement).value;
        filterizr.sort(sortAttr, 'asc');
      };

      sortAscControls.forEach((control): void =>
        control.addEventListener(
          'click',
          this.props.handlers.sortAscControlsHandler
        )
      );
    }

    if (sortDescControls) {
      this.props.handlers.sortDescControlsHandler = (): void => {
        const sortAttr = (document.querySelector(
          `${selector}[data-sortOrder]`
        ) as HTMLInputElement).value;
        filterizr.sort(sortAttr, 'desc');
      };

      sortDescControls.forEach((control): void =>
        control.addEventListener(
          'click',
          this.props.handlers.sortDescControlsHandler
        )
      );
    }
  }

  private destroySortControls(): void {
    const { sortAscControls, sortDescControls } = this;

    if (sortAscControls) {
      sortAscControls.forEach((control): void =>
        control.removeEventListener(
          'click',
          this.props.handlers.sortAscControlsHandler
        )
      );
    }

    if (sortDescControls) {
      sortDescControls.forEach((control): void =>
        control.removeEventListener(
          'click',
          this.props.handlers.sortDescControlsHandler
        )
      );
    }
  }
}

export default FilterControls;
