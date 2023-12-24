import { Sprite } from 'pixi.js';
import { CELL_SIZE } from '../constants/constants.js';

export default class WallView extends Sprite {
  constructor(texture, model) {
    super(texture);
    this.model = model;
    this.scale.x = 0.47;
    this.scale.y = 0.47;
    const [paddingX, paddingY] = this._calculatePaddings();
    this.x = model.coors.x + paddingX;
    this.y = model.coors.y + paddingY;
    this._timeOfLastDyingAnimationChange = 0;
    this._isDestroingAnimationOn = false;
  }

  updateView() {
    if (this.model.isDestroing) {
      if (!this._isDestroingAnimationOn) {
        this._isDestroingAnimationOn = true;
        // this._tint = 0xffa600;
        this._tint = 0xffa600;
      }
      if (Date.now() - this._timeOfLastDyingAnimationChange > 120) {
        this._timeOfLastDyingAnimationChange = Date.now();
        this.tint -= 1000;
      }
    }
  }

  _calculatePaddings() {
    const widthDifference = CELL_SIZE - this.width;
    const heightDifference = CELL_SIZE - this.height;
    return [Math.floor(widthDifference / 2), Math.floor(heightDifference)];
  }
}