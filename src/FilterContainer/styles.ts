import FilterizrOptions from '../FilterizrOptions';

export const makeInitialStyles = (options: FilterizrOptions): object => ({
  padding: `0 ${options.get().gutterPixels / 2}px`,
  position: 'relative',
  // Needed for flex displays
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
});

export const makePaddingStyles = (options: FilterizrOptions): object => ({
  padding: `0 ${options.get().gutterPixels / 2}px`,
});

export const makeHeightStyles = (height: number): object => ({
  height: `${height}px`,
});
