import { Dictionary } from '../types/interfaces';

type Receiver = NodeListOf<Element> | Element | Window;

export default class EventReceiver {
  private receiver: Receiver;
  private eventDictionary: Dictionary;

  public constructor(receiver: Receiver) {
    this.receiver = receiver;
    this.eventDictionary = {};
  }

  public on(eventType: string, eventHandler: EventListener): void {
    const { receiver } = this;
    const receiversAreMany = receiver instanceof NodeList;

    const eventExists = !!this.eventDictionary[eventType];
    if (eventExists) {
      delete this.eventDictionary[eventType];
    }

    if (receiversAreMany && !!(receiver as NodeList).length) {
      this.eventDictionary[eventType] = eventHandler;
      Array.from(receiver as NodeList).forEach((node: Element): void => {
        node.addEventListener(eventType, eventHandler);
      });
    } else if (!receiversAreMany && !!receiver) {
      this.eventDictionary[eventType] = eventHandler;
      (receiver as Element | Window).addEventListener(eventType, eventHandler);
    }
  }

  public destroy(): void {
    const { receiver } = this;
    const receiversAreMany = receiver instanceof NodeList;

    if (receiversAreMany && !!(receiver as NodeList).length) {
      Array.from(receiver as NodeList).forEach((node: Element): void =>
        this.removeAllEvents(node)
      );
    } else if (!receiversAreMany && !!receiver) {
      this.removeAllEvents(receiver as Element | Window);
    }
  }

  private removeAllEvents(node: Element | Window): void {
    Object.keys(this.eventDictionary).forEach((key: string): void => {
      node.removeEventListener(key, this.eventDictionary[key]);
      delete this.eventDictionary[key];
    });
  }
}