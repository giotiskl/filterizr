import { Destructible, Styleable } from '../types/interfaces';
import { makeSpinner } from './makeSpinner';
import FilterizrOptions from '../FilterizrOptions';
import FilterContainer from '../FilterContainer';
import StyledSpinner from './StyledSpinner';

export default class Spinner implements Destructible, Styleable {
  private node: HTMLElement;
  private styledNode: StyledSpinner;
  private filterContainer: FilterContainer;

  public constructor(
    filterContainer: FilterContainer,
    options: FilterizrOptions
  ) {
    this.filterContainer = filterContainer;
    this.node = makeSpinner(options.get().spinner);
    this.styledNode = new StyledSpinner(this.node, options);
    this.initialize();
  }

  public get styles(): StyledSpinner {
    return this.styledNode;
  }

  public async destroy(): Promise<void> {
    await this.styles.fadeOut();
    this.filterContainer.node.removeChild(this.node);
  }

  private initialize(): void {
    this.styles.initialize();
    this.filterContainer.node.appendChild(this.node);
  }
}
