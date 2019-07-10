import FilterizrOptions from '../FilterizrOptions';
import { Dictionary, Position } from '../types/interfaces';

function getTransitionDelay(index: number, options: FilterizrOptions): number {
  const { delay, delayMode } = options.get();
  if (delayMode === 'progressive') {
    return delay * index;
  }
  if (index % 2 === 0) {
    return delay;
  }
  return 0;
}

export const makeInitialStyles = (options: FilterizrOptions): object =>
  Object.assign({}, options.get().filterOutCss, {
    '-webkit-backface-visibility': 'hidden',
    perspective: '1000px',
    '-webkit-perspective': '1000px',
    '-webkit-transform-style': 'preserve-3d',
    position: 'absolute',
  });

export const makeFilteringStyles = (
  targetPosition: Position,
  cssOptions: Dictionary
): object =>
  Object.assign({}, cssOptions, {
    transform: `${cssOptions.transform || ''} translate3d(${
      targetPosition.left
    }px, ${targetPosition.top}px, 0)`,
  });

export const makeTransitionStyles = (
  index: number,
  options: FilterizrOptions
): object => {
  const { animationDuration, easing } = options.get();
  return {
    transition: `all ${animationDuration}s ${easing} ${getTransitionDelay(
      index,
      options
    )}ms, width 1ms`,
  };
};
