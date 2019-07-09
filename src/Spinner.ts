import { Destructible } from './types/interfaces';
import { makeSpinner } from './makeSpinner/makeSpinner';
import FilterizrOptions from './FilterizrOptions';
import FilterContainer from './FilterContainer';
import animate from './animate';

export default class Spinner implements Destructible {
  private node: HTMLElement;
  private filterContainer: FilterContainer;

  public constructor(
    filterContainer: FilterContainer,
    options: FilterizrOptions
  ) {
    this.filterContainer = filterContainer;
    this.node = makeSpinner(options.get().spinner);
    this.render();
  }

  public async destroy(): Promise<void> {
    await animate(this.node, { opacity: 0 });
    this.filterContainer.node.removeChild(this.node);
  }

  private render(): void {
    this.filterContainer.node.appendChild(this.node);
  }
}
