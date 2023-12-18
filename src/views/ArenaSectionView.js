import { Sprite } from 'pixi.js';
import { CELL_SIZE } from '../constants/constants.js';

export default class ArenaSectionView extends Sprite {
  constructor(texture, model) {
    super(texture);
    this.model = model;
    this.scale.x = 0.12;
    this.scale.y = 0.12;
    const [paddingX, paddingY] = this._calculatePaddings();
    this.x = model.coors.x + paddingX;
    this.y = model.coors.y + paddingY;
  }

  updateView() { }

  _calculatePaddings() {
    const widthDifference = CELL_SIZE - this.width;
    const heightDifference = CELL_SIZE - this.height;
    return [Math.floor(widthDifference / 2), Math.floor(heightDifference)];
  }
}