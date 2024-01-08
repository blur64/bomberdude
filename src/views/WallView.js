import { Sprite } from 'pixi.js';
import ViewPositionManager from './ViewPositionManager.js';

export default class WallView extends Sprite {
  constructor(texture, model) {
    super(texture);
    this.model = model;
    this.scale.x = 0.47;
    this.scale.y = 0.47;
    new ViewPositionManager(this, model, true);
    this._timeOfLastDyingAnimationChange = 0;
    this._isDestroingAnimationOn = false;
  }

  updateView() {
    if (this.model.isDestroing) {
      if (!this._isDestroingAnimationOn) {
        this._isDestroingAnimationOn = true;
        this._tint = 0xffa600;
      }
      if (Date.now() - this._timeOfLastDyingAnimationChange > 120) {
        this._timeOfLastDyingAnimationChange = Date.now();
        this.tint -= 1000;
      }
    }
  }
}