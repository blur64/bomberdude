import { AnimatedSprite } from 'pixi.js';
import { CELL_SIZE, directions } from '../constants/constants.js';

export default class CharacterView extends AnimatedSprite {
  constructor(animations, model, dyingAnimationTime) {
    super(Object.values(animations)[0]);
    this._animations = animations;
    // this.dyingAnimationTime = dyingAnimationTime;
    this.animationSpeed = 0.25;
    this.model = model;
    this.x = model.coors.x;
    this.y = model.coors.y;
    this.tint = Math.random() * 0xFFFFFF;
    this.textures = this._defineAnimationTextures();
    const [paddingX, paddingY] = this._calculatePaddings();
    this._paddingX = paddingX;
    this._paddingY = paddingY;
    this.isDyingAnimationOn = false;
    this.onFrameChange = () => {
      if (this.currentFrame === 0 && this.playing) {
        this.gotoAndPlay(1);
      }
    }
  }

  updateView() {
    this._updatePosition();
    this._animate();
  }

  _updatePosition() {
    this.x = this.model.coors.x + this._paddingX;
    this.y = this.model.coors.y + this._paddingY;
  }

  _calculatePaddings() {
    const widthDifference = CELL_SIZE - this.width;
    const heightDifference = CELL_SIZE - this.height;
    return [Math.floor(widthDifference / 2), Math.floor(heightDifference)];
  }

  _animate() {
    if (this.model.isDying && !this.isDyingAnimationOn) {
      this.isDyingAnimationOn = true;
      const red = 0xFF0000;
      const initial = this.tint;
      this.tint = red;
      setInterval(() => {
        if (this.tint === red) {
          this.tint = initial;
        } else {
          this.tint = red;
        }
      }, 250);
    }
    if (!this.model.movementComponent.movementX &&
      !this.model.movementComponent.movementY)
      this.gotoAndStop(0);

    const nextTextures = this._defineAnimationTextures();

    if (!nextTextures) {
      return;
    }
    if (this.textures !== nextTextures) {
      this.textures = nextTextures;
    }

    this.play();
  }

  _defineAnimationTextures() {
    let textures = null;
    switch (this.model.movementComponent.lookingDirection) {
      case directions.RIGHT:
        textures = this._animations.moveRight;
        break;
      case directions.LEFT:
        textures = this._animations.moveLeft;
        break;
      case directions.DOWN:
        textures = this._animations.moveDown;
        break;
      case directions.UP:
        textures = this._animations.moveUp;
        break;
    }
    return textures;
  }
}