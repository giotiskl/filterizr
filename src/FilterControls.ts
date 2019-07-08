import Filterizr from './Filterizr';
import { debounce } from './utils';
import EventReceiver from './EventReceiver';
import { Destructible } from './types/interfaces';

export default class FilterControls implements Destructible {
  private filterControls: EventReceiver;
  private filterizr: Filterizr;
  private multiFilterControls: EventReceiver;
  private searchControls: EventReceiver;
  private selector: string;
  private shuffleControls: EventReceiver;
  private sortAscControls: EventReceiver;
  private sortDescControls: EventReceiver;

  /**
   * @param filterizr keep a ref to the Filterizr object to control actions
   * @param selector selector of controls in case of multiple Filterizr instances
   */
  public constructor(filterizr: Filterizr, selector: string = '') {
    this.filterizr = filterizr;
    this.selector = selector;

    this.filterControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-filter]`)
    );
    this.multiFilterControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-multifilter]`)
    );
    this.shuffleControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-shuffle]`)
    );
    this.searchControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-search]`)
    );
    this.sortAscControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-sortAsc]`)
    );
    this.sortDescControls = new EventReceiver(
      document.querySelectorAll(`${selector}[data-sortDesc]`)
    );

    this.initialize();
  }

  public destroy(): void {
    this.filterControls.destroy();
    this.multiFilterControls.destroy();
    this.shuffleControls.destroy();
    this.searchControls.destroy();
    this.sortAscControls.destroy();
    this.sortDescControls.destroy();
  }

  private initialize(): void {
    const { filterizr, selector } = this;

    // Filter EventReceiver
    this.filterControls.on('click', (evt): void => {
      const ctrl: Element = evt.currentTarget as Element;
      const targetFilter: string = ctrl.getAttribute('data-filter');
      filterizr.filter(targetFilter);
    });
    this.multiFilterControls.on('click', (evt): void => {
      const ctrl: Element = evt.target as Element;
      const targetFilter = ctrl.getAttribute('data-multifilter');
      filterizr.toggleFilter(targetFilter);
    });

    // Shuffle EventReceiver
    this.shuffleControls.on('click', filterizr.shuffle.bind(filterizr));

    // Search EventReceiver
    this.searchControls.on('keyup', debounce(
      (evt: Event): void => {
        const textfield: HTMLInputElement = evt.target as HTMLInputElement;
        const searchTerm = textfield.value;
        filterizr.search(searchTerm);
      },
      250,
      false
    ) as EventListener);

    // Sort EventReceiver
    this.sortAscControls.on('click', (): void => {
      const sortAttr: string = (document.querySelector(
        `${selector}[data-sortOrder]`
      ) as HTMLInputElement).value;
      filterizr.sort(sortAttr, 'asc');
    });
    this.sortDescControls.on('click', (): void => {
      const sortAttr = (document.querySelector(
        `${selector}[data-sortOrder]`
      ) as HTMLInputElement).value;
      filterizr.sort(sortAttr, 'desc');
    });
  }
}
