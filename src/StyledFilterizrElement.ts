import { Destructible } from './types/interfaces/Destructible';
import animate from './animate';
import { setStyles } from './utils';
import FilterizrOptions from './FilterizrOptions';

export default abstract class StyledFilterizrElement implements Destructible {
  protected options: FilterizrOptions;
  protected node: HTMLElement;

  public constructor(node: HTMLElement, options: FilterizrOptions) {
    this.node = node;
    this.options = options;
  }

  public destroy(): void {
    this.node.removeAttribute('style');
  }

  protected async animate(targetStyles: object): Promise<void> {
    animate(this.node, targetStyles);
  }

  protected set(targetStyles: object): void {
    setStyles(this.node, targetStyles);
  }

  protected remove(propertyName: string): void {
    this.node.style.removeProperty(propertyName);
  }

  public abstract initialize(): void | Promise<void>;
}
