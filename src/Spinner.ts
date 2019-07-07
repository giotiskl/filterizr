import FilterizrOptions from './FilterizrOptions';
import { makeSpinner } from './makeSpinner/makeSpinner';
import FilterContainer from './FilterContainer';
import EventReceiver from './EventReceiver';
import animate from './animate';

export default class Spinner {
  public spinner: HTMLElement;
  private eventReceiver: EventReceiver;
  private parent: FilterContainer;

  public constructor(parent: FilterContainer, options: FilterizrOptions) {
    this.parent = parent;
    this.spinner = makeSpinner(options.get().spinner);
    this.eventReceiver = new EventReceiver(this.spinner);
    this.render();
  }

  private render(): void {
    this.parent.node.appendChild(this.spinner);
  }

  public async destroy(): Promise<void> {
    await animate(this.spinner, { opacity: 0 });
    this.eventReceiver.destroy();
    this.parent.node.removeChild(this.spinner);
  }
}
