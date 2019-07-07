import FilterizrOptions from './FilterizrOptions';
import { makeSpinner } from './makeSpinner/makeSpinner';
import FilterContainer from './FilterContainer';
import EventReceiver from './EventReceiver';

export default class Spinner {
  private parent: FilterContainer;
  private eventReceiver: EventReceiver;
  private spinner: HTMLElement;

  public constructor(parent: FilterContainer, options: FilterizrOptions) {
    this.parent = parent;
    this.spinner = makeSpinner(options.get().spinner);
    this.eventReceiver = new EventReceiver(parent.node);
    this.eventReceiver.on('init', this.destroy.bind(this));
    this.render();
  }

  private render(): void {
    this.parent.node.appendChild(this.spinner);
  }

  private destroy(): void {
    this.eventReceiver.destroy();
    this.parent.node.removeChild(this.spinner);
  }
}
