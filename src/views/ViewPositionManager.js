import { CELL_SIZE } from '../constants/constants.js';

export default class ViewPositionManager {
  constructor(view, model, isVerticalCenteringNeeded) {
    this._view = view;
    this._model = model;
    const [paddingX, paddingY] = this._calculatePaddings(isVerticalCenteringNeeded);
    this._paddingX = paddingX;
    this._paddingY = paddingY;
    this.update();
  }

  update() {
    this._view.x = this._model.coors.x + this._paddingX;
    this._view.y = this._model.coors.y + this._paddingY;
  }

  _calculatePaddings(isVerticalCenteringNeeded) {
    const widthDifference = CELL_SIZE - this._view.width;
    const heightDifference = CELL_SIZE - this._view.height;
    return [Math.floor(widthDifference / 2), isVerticalCenteringNeeded ?
      Math.floor(heightDifference / 2) : Math.floor(heightDifference)];
  }
}