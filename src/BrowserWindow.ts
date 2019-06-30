import { debounce } from './utils';

/**
 * A wrapper class around the window object to manage the
 * resize event.
 * 
 * When the user resizes the window, Filterizr needs to trigger
 * a refiltering of the grid so that the grid items can assume
 * their new positions.
 */
export default class BrowserWindow {
  private resizeHandler?: EventListener;

  constructor() {}

  private debounceEventHandler(resizeHandler: EventListener): EventListener {
    return <EventListener>debounce(resizeHandler, 250, false);
  }

  destroy(): void {
    this.removeResizeHandler();
  }

  setResizeEventHandler(resizeHandler: EventListener): void {
    this.removeResizeHandler();
    this.resizeHandler = this.debounceEventHandler(resizeHandler);
    window.addEventListener('resize', this.resizeHandler);
  }

  removeResizeHandler(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.resizeHandler = null;
  }
}
