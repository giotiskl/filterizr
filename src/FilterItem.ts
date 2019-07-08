import { getDataAttributesOfHTMLNode, setStyles } from './utils';
import {
  Destructible,
  Dictionary,
  Position,
  Resizable,
} from './types/interfaces';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';
import EventReceiver from './EventReceiver';
import FilterizrElement from './FilterizrElement';

const imagesLoaded = require('imagesloaded');

/**
 * Resembles an item in the grid of Filterizr.
 */
export default class FilterItem extends FilterizrElement implements Resizable {
  public dimensions: {
    width: number;
    height: number;
  };

  private filteredOut: boolean;
  private index: number;
  private lastPosition: Position;
  private sortData: Dictionary;

  public constructor(node: Element, index: number, options: FilterizrOptions) {
    super(node, options);
    this.filteredOut = false;
    this.index = index;
    this.lastPosition = { left: 0, top: 0 };
    this.dimensions = {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
    this.sortData = {
      ...getDataAttributesOfHTMLNode(node),
      index,
      sortData: node.getAttribute('data-sort'),
    };

    const { filterOutCss } = this.options.get();
    setStyles(
      this.node,
      Object.assign({}, filterOutCss, {
        '-webkit-backface-visibility': 'hidden',
        perspective: '1000px',
        '-webkit-perspective': '1000px',
        '-webkit-transform-style': 'preserve-3d',
        position: 'absolute',
      })
    );

    this.bindEvents();
  }

  /**
   * Destroys the FilterItem instance
   */
  public destroy(): void {
    this.node.removeAttribute('style');
    this.unbindEvents();
  }

  /**
   * Filters in a specific FilterItem out of the grid.
   * @param targetPosition the position towards which the element should animate
   * @param cssOptions for the animation
   */
  public filterIn(targetPosition: Position, cssOptions: Dictionary): void {
    // Enhance the cssOptions with the target position before animating
    setStyles(
      this.node,
      Object.assign({}, cssOptions, {
        transform: `${cssOptions.transform || ''} translate3d(${
          targetPosition.left
        }px, ${targetPosition.top}px, 0)`,
      })
    );
    this.lastPosition = targetPosition;
    this.filteredOut = false;
  }

  /**
   * Filters out a specific FilterItem out of the grid.
   * @param cssOptions for the animation
   */
  public filterOut(cssOptions: Dictionary): void {
    const { lastPosition: targetPosition } = this;
    // Enhance the cssOptions with the target position before animating
    setStyles(
      this.node,
      Object.assign({}, cssOptions, {
        transform: `${cssOptions.transform || ''} translate3d(${
          targetPosition.left
        }px, ${targetPosition.top}px, 0)`,
      })
    );
    this.filteredOut = true;
  }

  /**
   * Helper method to calculate the animation delay for a given grid item
   * @param delay in ms
   * @param delayMode can be 'alternate' or 'progressive'
   */
  public getTransitionDelay(
    delay: number,
    delayMode: 'progressive' | 'alternate'
  ): number {
    if (delayMode === 'progressive') {
      return delay * this.index;
    }
    if (this.index % 2 === 0) {
      return delay;
    }
    return 0;
  }

  /**
   * Returns true if the text contents of the FilterItem match the search term
   * @param searchTerm to look up
   */
  public contentsMatchSearch(searchTerm: string): boolean {
    return this.node.textContent.toLowerCase().includes(searchTerm);
  }

  /**
   * Recalculates the dimensions of the element and updates them in the state
   */
  public updateDimensions(): void {
    this.dimensions.width = this.node.clientWidth;
    this.dimensions.height = this.node.clientHeight;
  }

  /**
   * Returns all categories of the grid items data-category attribute
   * with a regexp regarding all whitespace.
   */
  public getCategories(): string[] {
    return this.node.getAttribute('data-category').split(/\s*,\s*/g);
  }

  /**
   * Returns the value of the sort attribute
   * @param sortAttribute "index", "sortData" or custom user data-attribute by which to sort
   */
  public getSortAttribute(sortAttribute: string): string | number {
    return this.sortData[sortAttribute];
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
  public async enableCssTransitions(): Promise<void> {
    return new Promise((resolve) => {
      const hasImage = !!this.node.querySelectorAll('img').length;
      if (hasImage) {
        imagesLoaded(this.node, (): void => {
          setTimeout((): void => {
            setStyles(this.node, {
              transition: this.getTransitionStyle(),
            });
            resolve();
          }, 10);
        });
      } else {
        setTimeout((): void => {
          setStyles(this.node, {
            transition: this.getTransitionStyle(),
          });
          resolve();
        }, 10);
      }
    });
  }

  protected bindEvents(): void {
    this.eventReceiver.on('transitionend', (): void => {
      // On transition end determines if the item is filtered out or not.
      // It adds a .filteredOut class so that user can target these items
      // via css if needed. It sets the z-index to -1000 to prevent mouse
      // events from being triggered.
      const { filteredOut } = this;
      if (filteredOut) {
        this.node.classList.add('filteredOut');
        setStyles(this.node, { zIndex: -1000 });
      } else {
        this.node.classList.remove('filteredOut');
        setStyles(this.node, { zIndex: '' });
      }
    });
  }

  protected unbindEvents(): void {
    this.eventReceiver.off('transitionend');
  }

  /**
   * Calculates and returns the transition css property based on options.
   */
  private getTransitionStyle(): string {
    const { animationDuration, easing, delay, delayMode } = this.options.get();
    return `all ${animationDuration}s ${easing} ${this.getTransitionDelay(
      delay,
      delayMode
    )}ms`;
  }
}
