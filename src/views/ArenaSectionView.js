import { Sprite } from 'pixi.js';
import ViewPositionManager from './ViewPositionManager';

export default class ArenaSectionView extends Sprite {
  constructor(texture, model) {
    super(texture);
    this.model = model;
    this.scale.x = 0.12;
    this.scale.y = 0.12;
    new ViewPositionManager(this, model, true);
  }

  updateView() { }
}