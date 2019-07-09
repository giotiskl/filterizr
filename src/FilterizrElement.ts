import { Destructible } from './types/interfaces';
import FilterizrOptions from './FilterizrOptions';
import EventReceiver from './EventReceiver';
import animate from './animate';
import { setStyles } from './utils';

export default abstract class FilterizrElement implements Destructible {
  public node: Element;
  public options: FilterizrOptions;
  protected eventReceiver: EventReceiver;

  public constructor(node: Element, options: FilterizrOptions) {
    this.node = node;
    this.options = options;
    this.eventReceiver = new EventReceiver(this.node);
  }
  public destroy(): void | Promise<void> {
    this.removeStyles();
  }
  public async animate(targetStyles: object): Promise<void> {
    animate(this.node as HTMLElement, targetStyles);
  }
  public trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }
  public setStyles(targetStyles: object): void {
    setStyles(this.node, targetStyles);
  }

  private removeStyles(): void {
    this.node.removeAttribute('style');
  }

  protected abstract bindEvents(): void;
  protected abstract unbindEvents(): void;
}
