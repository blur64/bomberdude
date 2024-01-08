import { AnimatedSprite } from 'pixi.js';
import { directions } from '../constants/constants.js';
import ViewPositionManager from './ViewPositionManager.js';

export default class CharacterView extends AnimatedSprite {
  constructor(animations, model) {
    super(Object.values(animations)[0]);
    this._animations = animations;
    this.animationSpeed = 0.25;
    this.model = model;
    this.x = model.coors.x;
    this.y = model.coors.y;
    this.tint = Math.random() * 0xFFFFFF;
    this.textures = this._defineAnimationTextures();
    this.positionManager = new ViewPositionManager(this, model, false);
    this.isDyingAnimationOn = false;
    this.onFrameChange = () => {
      if (this.currentFrame === 0 && this.playing) {
        this.gotoAndPlay(1);
      }
    }
  }

  updateView() {
    this.positionManager.update();
    this._animate();
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