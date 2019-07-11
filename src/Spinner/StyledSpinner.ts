import StyledFilterizrElement from '../StyledFilterizrElement';

export default class StyledSpinner extends StyledFilterizrElement {
  public initialize(): void {
    const { styles } = this.options.get().spinner;
    this.set({
      ...styles,
      opacity: 1,
      transition: 'all ease-out 500ms',
    });
  }

  public async fadeOut(): Promise<void> {
    await this.animate({ opacity: 0 });
  }
}
