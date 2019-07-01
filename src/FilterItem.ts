import {
  getDataAttributesOfHTMLNode,
  setStylesOnHTMLNode,
  TRANSITION_END_EVENTS,
} from './utils';
import { Dictionary } from './types/interfaces/Dictionary';
import FilterizrOptions from './FilterizrOptions/FilterizrOptions';

const imagesLoaded = require('imagesloaded');

export interface Position {
  left: number;
  top: number;
}

export default class FilterItem {
  public node: Element;
  public options: FilterizrOptions;
  public props: {
    data: Dictionary;
    filteredOut: boolean;
    index: number;
    lastPosition: Position;
    onTransitionEndHandler: EventListener;
    sortData: string;
    w: number;
    h: number;
  };

  /**
   * Constructor of FilterItem
   *
   * @param {Object} node is the HTML node to create the FilterItem out of
   * @param {Number} index is the index of the FilterItem when iterating over them
   * @param {Object} options the options Filterizr was initialized with
   * @returns {Object} FilterItem instance
   */
  public constructor(node: Element, index: number, options: FilterizrOptions) {
    this.options = options;
    this.node = node;
    const { filterOutCss } = this.options.get();

    this.props = {
      data: getDataAttributesOfHTMLNode(this.node),
      filteredOut: false,
      index,
      lastPosition: { left: 0, top: 0 },
      onTransitionEndHandler: (): void => {
        // On transition end determines if the item is filtered out or not.
        // It adds a .filteredOut class so that user can target these items
        // via css if needed. It sets the z-index to -1000 to prevent mouse
        // events from being triggered.
        const { filteredOut } = this.props;
        if (filteredOut) {
          this.node.classList.add('filteredOut');
          setStylesOnHTMLNode(this.node, { zIndex: -1000 });
        } else {
          this.node.classList.remove('filteredOut');
          setStylesOnHTMLNode(this.node, { zIndex: '' });
        }
      },
      sortData: this.node.getAttribute('data-sort'),
      w: this.getWidth(),
      h: this.getHeight(),
    };

    // Set initial styles
    setStylesOnHTMLNode(
      this.node,
      Object.assign({}, filterOutCss, {
        '-webkit-backface-visibility': 'hidden',
        perspective: '1000px',
        '-webkit-perspective': '1000px',
        '-webkit-transform-style': 'preserve-3d',
        position: 'absolute',
      })
    );

    this.setTransitionStyle();

    // Finally bind events
    this.bindEvents();
  }

  /**
   * Destroys the FilterItem instance
   * @returns {undefined}
   */
  public destroy(): void {
    this.unbindEvents();
  }

  /**
   * Filters in a specific FilterItem out of the grid.
   * @param {Object} targetPosition the position towards which the element should animate
   * @param {Object} cssOptions for the animation
   * @returns {undefined}
   */
  public filterIn(targetPosition: Position, cssOptions: Dictionary): void {
    // Enhance the cssOptions with the target position before animating
    setStylesOnHTMLNode(
      this.node,
      Object.assign({}, cssOptions, {
        transform: `${cssOptions.transform || ''} translate3d(${
          targetPosition.left
        }px, ${targetPosition.top}px, 0)`,
      })
    );
    // Update last position to be the targetPosition
    this.props.lastPosition = targetPosition;
    // Update state
    this.props.filteredOut = false;
  }

  /**
   * Filters out a specific FilterItem out of the grid.
   * @param {Object} cssOptions for the animation
   */
  public filterOut(cssOptions: Dictionary): void {
    const { lastPosition: targetPosition } = this.props;
    // Enhance the cssOptions with the target position before animating
    setStylesOnHTMLNode(
      this.node,
      Object.assign({}, cssOptions, {
        transform: `${cssOptions.transform || ''} translate3d(${
          targetPosition.left
        }px, ${targetPosition.top}px, 0)`,
      })
    );
    // Update state
    this.props.filteredOut = true;
  }

  /**
   * Helper method to calculate the animation delay for a given grid item
   * @param {Number} delay in ms
   * @param {String} delayMode can be 'alternate' or 'progressive'
   * @return {Number} delay in ms
   */
  public getTransitionDelay(
    delay: number,
    delayMode: 'progressive' | 'alternate'
  ): number {
    let ret = 0;

    if (delayMode === 'progressive') {
      ret = delay * this.props.index;
    } else {
      if (this.props.index % 2 === 0) ret = delay;
    }

    return ret;
  }

  /**
   * Returns true if the text contents of the FilterItem match the search term
   * @param {String} searchTerm - the search term
   * @return {Boolean} if the innerText matches the term
   */
  public contentsMatchSearch(searchTerm: string): boolean {
    return Boolean(this.getContentsLowercase().includes(searchTerm));
  }

  /**
   * Recalculates the dimensions of the element and updates them in the state
   */
  public updateDimensions(): void {
    this.props.w = this.getWidth();
    this.props.h = this.getHeight();
  }

  /**
   * Returns all categories of the grid items data-category attribute
   * with a regexp regarding all whitespace.
   * @return {String[]} an array of the categories the item belongs to
   */
  public getCategories(): string[] {
    return this.node.getAttribute('data-category').split(/\s*,\s*/g);
  }

  /**
   * Helper method for the search method of Filterizr
   * @return {String} innerText of the FilterItem in lowercase
   */
  private getContentsLowercase(): string {
    return this.node.textContent.toLowerCase();
  }

  /**
   * Calculates the clientHeight (excluding border) of an element
   * @return {Number} height of FilterItem node
   */
  private getHeight(): number {
    return this.node.clientHeight;
  }

  /**
   * Calculates the clientWidth (excluding border) of an element
   * @return {Number} width of FilterItem node
   */
  private getWidth(): number {
    return this.node.clientWidth;
  }

  /**
   * Sets up the events related to the FilterItem instance
   */
  private bindEvents(): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.node.addEventListener(eventName, this.props.onTransitionEndHandler);
    });
  }

  /**
   * Removes all events related to the FilterItem instance
   */
  private unbindEvents(): void {
    TRANSITION_END_EVENTS.forEach((eventName): void => {
      this.node.removeEventListener(
        eventName,
        this.props.onTransitionEndHandler
      );
    });
  }

  /**
   * Calculates and returns the transition css property based on options.
   *
   * @returns {string} transition css property
   */
  private getTransitionStyle(): string {
    const { animationDuration, easing, delay, delayMode } = this.options.get();
    return `all ${animationDuration}s ${easing} ${this.getTransitionDelay(
      delay,
      delayMode
    )}ms`;
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
  private setTransitionStyle(): void {
    const hasImage = !!this.node.querySelectorAll('img').length;
    if (hasImage) {
      imagesLoaded(this.node, (): void => {
        setTimeout((): void => {
          setStylesOnHTMLNode(this.node, {
            transition: this.getTransitionStyle(),
          });
        }, 10);
      });
    } else {
      setTimeout((): void => {
        setStylesOnHTMLNode(this.node, {
          transition: this.getTransitionStyle(),
        });
      }, 10);
    }
  }
}
