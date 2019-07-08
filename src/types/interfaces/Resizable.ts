export interface Resizable {
  dimensions: {
    width: number;
    height: number;
  };
  updateDimensions(): void;
}
