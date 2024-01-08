import { AnimatedSprite, Sprite } from 'pixi.js';
import ViewPositionManager from './ViewPositionManager.js';

export default class ExplosionView extends AnimatedSprite {
  constructor(textures, model) {
    super(textures);
    this.model = model;
    new ViewPositionManager(this, model, false);
    this.animationSpeed = 0.27;
    this.loop = false;
    this.play();
  }

  updateView() { }
}