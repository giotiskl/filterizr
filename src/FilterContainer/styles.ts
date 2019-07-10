import FilterizrOptions from '../FilterizrOptions';

export const makePaddingStyles = (options: FilterizrOptions): object => ({
  padding: `${options.get().gutterPixels}px`,
});

export const makeInitialStyles = (options: FilterizrOptions): object => ({
  ...makePaddingStyles(options),
  position: 'relative',
  // Needed for flex displays
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
});

export const makeHeightStyles = (height: number): object => ({
  height: `${height}px`,
});
