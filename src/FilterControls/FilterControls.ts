import Filterizr from '../Filterizr';
import { debounce } from '../utils';
import Controls from './Controls';

class FilterControls {
  private filterControls: Controls;
  private filterizr: Filterizr;
  private multiFilterControls: Controls;
  private searchControls: Controls;
  private selector: string;
  private shuffleControls: Controls;
  private sortAscControls: Controls;
  private sortDescControls: Controls;

  /**
   * @param filterizr keep a ref to the Filterizr object to control actions
   * @param selector selector of controls in case of multiple Filterizr instances
   */
  public constructor(filterizr: Filterizr, selector: string = '') {
    this.filterizr = filterizr;
    this.selector = selector;

    this.filterControls = new Controls(`${selector}[data-filter]`);
    this.multiFilterControls = new Controls(`${selector}[data-multifilter]`);
    this.shuffleControls = new Controls(`${selector}[data-shuffle]`);
    this.searchControls = new Controls(`${selector}[data-search]`);
    this.sortAscControls = new Controls(`${selector}[data-sortAsc]`);
    this.sortDescControls = new Controls(`${selector}[data-sortDesc]`);

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

    // Filter controls
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

    // Shuffle controls
    this.shuffleControls.on('click', filterizr.shuffle.bind(filterizr));

    // Search controls
    this.searchControls.on('keyup', debounce(
      (evt: Event): void => {
        const textfield: HTMLInputElement = evt.target as HTMLInputElement;
        const searchTerm = textfield.value;
        filterizr.search(searchTerm);
      },
      250,
      false
    ) as EventListener);

    // Sort controls
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

export default FilterControls;
