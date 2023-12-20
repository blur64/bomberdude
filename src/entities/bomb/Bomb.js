import { CHARACTER_SIZE } from "../../constants/constants.js";
import Explosion from "./Explosion.js";

export default class Bomb {
  constructor(x, y, power, detonationTimeout, arena, bombSize) {
    this.coors = { x, y };
    this.detonationTimeout = detonationTimeout;
    this.sizeX = CHARACTER_SIZE;
    this.sizeY = CHARACTER_SIZE;
    this.power = power;
    this.arena = arena;
    this.bombSize = bombSize;
    this._detonationTimerID = '';
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
    this.arena.addItem(new Explosion(this.coors.x, this.coors.y, 1000, this.arena));

    for (let degr = 0; degr < 360; degr += 90) {
      const degrSin = Math.round(Math.sin(degr * Math.PI / 180));
      const degrCos = Math.round(Math.cos(degr * Math.PI / 180));

      for (let j = 1; j < this.power; j++) {
        const explosionX = this.coors.x + degrCos * this.bombSize * j;
        const explosionY = this.coors.y + degrSin * this.bombSize * j;
        const itemOnTheExplosionWay = this.arena
          .getItemThePointIn(explosionX, explosionY);

        if (itemOnTheExplosionWay === undefined) {
          break;
        }
        if (itemOnTheExplosionWay && !(itemOnTheExplosionWay instanceof Explosion)) {
          if (this.arena.isItemDestroyable(itemOnTheExplosionWay)) {
            itemOnTheExplosionWay.destroy(1000);
          }
          break;
        }

        const explosion = new Explosion(explosionX, explosionY, 1000, this.arena);
        this.arena.addItem(explosion);
      }
    }
  }
}