import { debounce } from './utils';

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
