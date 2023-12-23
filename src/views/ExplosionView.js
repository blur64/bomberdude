import { AnimatedSprite } from 'pixi.js';
import { CELL_SIZE } from '../constants/constants.js';

export default class ExplosionView extends AnimatedSprite {
  constructor(textures, model) {
    super(textures);
    this.model = model;
    const [paddingX, paddingY] = this._calculatePaddings();
    this.x = model.coors.x + paddingX;
    this.y = model.coors.y + paddingY;
    this.animationSpeed = 0.13;
    this.loop = false;
    this.play();
  }

  updateView() { }

  _calculatePaddings() {
    const widthDifference = CELL_SIZE - this.width;
    const heightDifference = CELL_SIZE - this.height;
    // !!! АХТУНГ, ДЕЛИМ НА ДВА И hightDifference тоже, чтобы центрировалось
    // и по вертикали !!!
    return [Math.floor(widthDifference / 2), Math.floor(heightDifference / 2)];
  }
}