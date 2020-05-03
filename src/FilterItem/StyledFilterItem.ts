import {
  makeInitialStyles,
  makeFilteringStyles,
  makeTransitionStyles,
} from './styles';
import { Position } from './../types/interfaces';
import StyledFilterizrElement from '../StyledFilterizrElement';
import FilterizrOptions from '../FilterizrOptions';

const imagesLoaded = require('imagesloaded');

export default class StyledFilterItem extends StyledFilterizrElement {
  private _index: number;

  public constructor(
    node: HTMLElement,
    index: number,
    options: FilterizrOptions
  ) {
    super(node, options);
    this._index = index;
  }

  public initialize(): void {
    this.set(makeInitialStyles(this.options));
  }

  public setFilteredStyles(position: Position, cssOptions: object): void {
    this.set(makeFilteringStyles(position, cssOptions));
  }

  public updateTransitionStyle(): void {
    this.set(makeTransitionStyles(this._index, this.options));
  }

  public updateWidth(): void {
    const { gutterPixels } = this.options.get();
    const containerWidth = this.node.parentElement.clientWidth;
    const itemWidth = this.node.clientWidth;
    const timesItFitsContainer = Math.floor(containerWidth / itemWidth);
    const gutterRatio = 1 / timesItFitsContainer + 1;
    const width = `${itemWidth - gutterPixels * gutterRatio}px`;
    this.set({ width });
  }

  /**
   * Sets the transition css property as an inline style on the FilterItem.
   *
   * The idea here is that during the very first render items should assume
   * their positions directly.
   *
   * Following renders should actually trigger the transitions, which is why
   * we need to delay setting the transition property.
   *
   * Unfortunately, JavaScript code executes on the same thread as the
   * browser's rendering. Everything that needs to be drawn waits for
   * JavaScript execution to complete. Thus, we need to use a setTimeout
   * here to defer setting the transition style at the first rendering cycle.
   */
  public async enableTransitions(): Promise<void> {
    return new Promise((resolve): void => {
      const hasImage = !!this.node.querySelectorAll('img').length;
      if (hasImage) {
        imagesLoaded(this.node, (): void => {
          setTimeout((): void => {
            this.updateTransitionStyle();
            resolve();
          }, 10);
        });
      } else {
        setTimeout((): void => {
          this.updateTransitionStyle();
          resolve();
        }, 10);
      }
    });
  }

  public disableTransitions(): void {
    this.remove('transition');
  }

  public setZIndex(zIndex: number): void {
    this.set({ 'z-index': zIndex });
  }

  public removeZIndex(): void {
    this.remove('z-index');
  }

  public removeWidth(): void {
    this.remove('width');
  }

  public setHidden(): void {
    this.set({ display: 'none' });
  }

  public setVisible(): void {
    this.remove('display');
  }
}
