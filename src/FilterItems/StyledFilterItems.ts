import StyledFilterItem from '../FilterItem/StyledFilterItem';
import StyledFilterizrElements from '../StyledFilterizrElements';
import FilterItem from '../FilterItem/FilterItem';

export default class StyledFilterItems extends StyledFilterizrElements {
  private _filterItems: StyledFilterItem[];

  public constructor(elements: FilterItem[]) {
    super();
    this._filterItems = elements.map(({ styles }): StyledFilterItem => styles);
  }

  public resetDisplay(): void {
    this._filterItems.forEach((filterItem): void => filterItem.setVisible());
  }

  public removeWidth(): void {
    this._filterItems.forEach((filterItem): void => filterItem.removeWidth());
  }

  public updateWidth(): void {
    this._filterItems.forEach((filterItem): void => filterItem.updateWidth());
  }

  public updateTransitionStyle(): void {
    this._filterItems.forEach((filterItem): void =>
      filterItem.updateTransitionStyle()
    );
  }

  public disableTransitions(): void {
    this._filterItems.forEach((filterItem): void =>
      filterItem.disableTransitions()
    );
  }

  public async enableTransitions(): Promise<void> {
    this._filterItems.forEach(
      async (filterItem): Promise<void> => await filterItem.enableTransitions()
    );
  }

  public updateWidthWithTransitionsDisabled(): void {
    this.disableTransitions();
    this.removeWidth();
    this.updateWidth();
    this.enableTransitions();
  }
}
