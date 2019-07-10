import {
  makeInitialStyles,
  makePaddingStyles,
  makeHeightStyles,
} from './styles';
import StyledFilterizrElement from '../StyledFilterizrElement';
import FilterizrOptions from '../FilterizrOptions';

export default class StyledFilterContainer extends StyledFilterizrElement {
  public constructor(node: HTMLElement, options: FilterizrOptions) {
    super(node, options);
  }

  public initialize(): void {
    this.set(makeInitialStyles(this.options));
  }

  public updatePaddings(): void {
    this.set(makePaddingStyles(this.options));
  }

  public setHeight(newHeight: number): void {
    this.set(makeHeightStyles(newHeight));
  }
}
