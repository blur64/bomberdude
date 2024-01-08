import { AnimatedSprite } from 'pixi.js';
import ViewPositionManager from './ViewPositionManager';

export default class ExplosionView extends AnimatedSprite {
  constructor(textures, model) {
    super(textures);
    this.model = model;
    new ViewPositionManager(this, model, true);
    this.animationSpeed = 0.13;
    this.loop = false;
    this.play();
  }

  updateView() { }
}