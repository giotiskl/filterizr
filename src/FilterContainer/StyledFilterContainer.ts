import {
  makeInitialStyles,
  makePaddingStyles,
  makeHeightStyles,
} from './styles';
import StyledFilterizrElement from '../StyledFilterizrElement';

export default class StyledFilterContainer extends StyledFilterizrElement {
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
