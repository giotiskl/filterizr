export default class Controls {
  private controls: NodeListOf<Element>;
  private eventType?: string;
  private eventHandler?: EventListener;

  public constructor(selector: string = '') {
    this.controls = document.querySelectorAll(selector);
    this.eventType = null;
    this.eventHandler = null;
  }

  public on(eventType: string, eventHandler: EventListener): void {
    const { controls } = this;

    if (!!controls.length) {
      this.eventType = eventType;
      this.eventHandler = eventHandler;
      controls.forEach((control: Element): void =>
        control.addEventListener(eventType, eventHandler)
      );
    }
  }

  public destroy(): void {
    const { controls } = this;

    if (!!controls.length) {
      controls.forEach((control: Element): void =>
        control.removeEventListener(this.eventType, this.eventHandler)
      );
      this.eventType = null;
      this.eventHandler = null;
    }
  }
}
