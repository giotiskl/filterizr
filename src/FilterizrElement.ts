import {
  Destructible,
  Dimensions,
  Resizable,
  Styleable,
} from './types/interfaces';
import FilterizrOptions from './FilterizrOptions';
import EventReceiver from './EventReceiver';
import StyledFilterizrElement from './StyledFilterizrElement';

export default abstract class FilterizrElement
  implements Destructible, Resizable, Styleable {
  public node: Element;
  public options: FilterizrOptions;
  protected eventReceiver: EventReceiver;

  public constructor(node: Element, options: FilterizrOptions) {
    this.node = node;
    this.options = options;
    this.eventReceiver = new EventReceiver(this.node);
  }

  public get dimensions(): Dimensions {
    return {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
  }

  public destroy(): void | Promise<void> {
    this.styles.destroy();
  }

  public trigger(eventType: string): void {
    const event = new Event(eventType);
    this.node.dispatchEvent(event);
  }

  public abstract get styles(): StyledFilterizrElement;

  protected abstract bindEvents(): void;

  protected abstract unbindEvents(): void;
}
