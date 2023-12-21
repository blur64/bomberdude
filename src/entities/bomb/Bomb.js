import { CELL_SIZE, EXPLOSION_DURATION } from "../../constants/constants.js";
import Explosion from "./Explosion.js";

export default class Bomb {
  constructor({ x, y, power, detonationTimeout, arena, bombSize }) {
    this.coors = { x, y };
    this.detonationTimeout = detonationTimeout;
    this._width = bombSize;
    this._height = bombSize;
    this.power = power;
    this.arena = arena;
    this._detonationTimerID = '';
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  turnOnTimer() {
    this._detonationTimerID = setTimeout(() => this._detonate(), this.detonationTimeout);
  }

  destroy() {
    this._detonate();
    clearTimeout(this._detonationTimerID);
  }

  _detonate() {
    this.arena.removeItem(this);
    this.arena.addItem(new Explosion({
      x: this.coors.x,
      y: this.coors.y,
      duration: EXPLOSION_DURATION,
      arena: this.arena
    }));

    for (let degr = 0; degr < 360; degr += 90) {
      const degrSin = Math.round(Math.sin(degr * Math.PI / 180));
      const degrCos = Math.round(Math.cos(degr * Math.PI / 180));

      for (let j = 1; j < this.power; j++) {
        const explosionX = this.coors.x + degrCos * CELL_SIZE * j;
        const explosionY = this.coors.y + degrSin * CELL_SIZE * j;
        const itemOnTheExplosionWay = this.arena
          .getItemThePointIn(explosionX, explosionY);

        if (itemOnTheExplosionWay === undefined) {
          break;
        }
        if (itemOnTheExplosionWay && !(itemOnTheExplosionWay instanceof Explosion)) {
          if (this.arena.isItemDestroyable(itemOnTheExplosionWay)) {
            itemOnTheExplosionWay.destroy(EXPLOSION_DURATION);
          }
          break;
        }

        const explosion = new Explosion({
          x: explosionX,
          y: explosionY,
          duration: EXPLOSION_DURATION,
          arena: this.arena
        });
        this.arena.addItem(explosion);
      }
    }
  }
}