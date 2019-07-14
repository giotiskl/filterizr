import { ContainerLayout, Position, Dimensions } from '../types/interfaces';
import Packer from './Packer';

/**
 * Packed layout for items that can have varying width as well as varying height.
 */
export default (
  containerWidth: number,
  itemsDimensions: Dimensions[],
  gutterPixels: number
): ContainerLayout => {
  //Instantiate new Packer, set up grid
  const packer = new Packer(containerWidth);
  const itemsDimensionsWithGutter = itemsDimensions.map(
    ({ width, height }): object => ({
      w: width + gutterPixels,
      h: height + gutterPixels,
    })
  );

  // Enhance array with coordinates
  // added in an extra object named fit
  // by the packing algorithm
  packer.fit(itemsDimensionsWithGutter);

  const itemsPositions = itemsDimensionsWithGutter.map(
    ({ fit }: { fit: { x: number; y: number } }): Position => ({
      left: fit.x,
      top: fit.y,
    })
  );

  return {
    containerHeight: packer.root.h + gutterPixels,
    itemsPositions,
  };
};
