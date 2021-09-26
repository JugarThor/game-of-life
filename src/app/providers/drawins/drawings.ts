import { DrawingObject } from '@models/drawing.model';

export const spaceShipRight: DrawingObject = {
  grid: [
    [1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
  ],
};
export const spaceShipLeft: DrawingObject = {
  grid: [
    [0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
};
export const spaceShipUp: DrawingObject = {
  grid: [
    [0, 1, 1, 1],
    [1, 0, 0, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 1, 0],
  ],
};
export const spaceShipDown: DrawingObject = {
  grid: [
    [1, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
  ],
};
export const miniShipDiagonalRight: DrawingObject = {
  grid: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
};