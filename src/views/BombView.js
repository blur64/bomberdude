import { AnimatedSprite, Sprite } from 'pixi.js';
import { CELL_SIZE } from '../constants/constants.js';

export default class ExplosionView extends AnimatedSprite {
  constructor(textures, model) {
    super(textures);
    this.model = model;
    const [paddingX, paddingY] = this._calculatePaddings();
    this.x = model.coors.x + paddingX;
    this.y = model.coors.y + paddingY;
    this.animationSpeed = 0.27;
    this.loop = false;
    this.play();
  }

  updateView() { }

  _calculatePaddings() {
    const widthDifference = CELL_SIZE - this.width;
    const heightDifference = CELL_SIZE - this.height;
    // !!! АХТУНГ, ДЕЛИМ НА ДВА И hightDifference тоже, чтобы центрировалось
    // и по вертикали !!!
    return [Math.floor(widthDifference / 2), Math.floor(heightDifference)];
  }
}

// export default class BombView extends Sprite {
//   constructor(texture, model) {
//     super(texture);
//     this.model = model;
//     const [paddingX, paddingY] = this._calculatePaddings();
//     this.x = model.coors.x + paddingX;
//     this.y = model.coors.y + paddingY;
//   }

//   updateView() { }

//   _calculatePaddings() {
//     const widthDifference = CELL_SIZE - this.width;
//     const heightDifference = CELL_SIZE - this.height;
//     return [Math.floor(widthDifference / 2), Math.floor(heightDifference)];
//   }
// }