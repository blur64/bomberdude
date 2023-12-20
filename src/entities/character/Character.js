import MovementComponent from '../../components/MovementComponent.js';
import Bomb from '../bomb/Bomb.js';
import CollisionsDetector from '../../collisions/CollisionsDetector.js';
import { CELL_SIZE, CHARACTER_SIZE } from '../../constants/constants.js';

export default class Character {
  constructor(x, y, arena, dyingTime) {
    this.coors = { x, y };
    this.hitboxPadding = 20;
    this.hitbox = {
      coors: { x: x + this.hitboxPadding, y: y + this.hitboxPadding },
      sizeX: 20,
      sizeY: 20,
    };
    this.sizeX = CHARACTER_SIZE;
    this.sizeY = CHARACTER_SIZE;
    this.arena = arena;
    this.bombPower = 4;
    this.dyingTime = dyingTime;
    this.isDead = false;
    this.isDying = false;
    this._bombTimeout = 2000;
    this._canPlantBomb = true;
    this.movementComponent = new
      MovementComponent(this.coors, new CollisionsDetector(arena), this);
  }

  update() {
    if (this.isDead || this.isDying) {
      return;
    }
    this.movementComponent.update();
    this._updateHitbox();
  }

  _updateHitbox() {
    this.hitbox.coors.x = this.coors.x + this.hitboxPadding;
    this.hitbox.coors.y = this.coors.y + this.hitboxPadding;
  }

  plantBomb() {
    if (!this._canPlantBomb || this.isDead || this.isDying) {
      return;
    }
    this._canPlantBomb = false;
    setTimeout(() => this._canPlantBomb = true, this._bombTimeout);
    const [bombX, bombY] = [
      Math.floor((this.coors.x + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
      Math.floor((this.coors.y + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE
    ];
    const bomb = new Bomb(bombX, bombY, this.bombPower, this._bombTimeout, this.arena, CELL_SIZE);
    this.arena.addItem(bomb);
    bomb.turnOnTimer();
  }

  kill() {
    // БАГ! Персонаж сохраняет направление движения после того, как дотронулся
    // до взрыва
    this.isDying = true;
    setTimeout(() => {
      this.isDead = true;
      this.isDying = false;
    }, this.dyingTime);
  }
}
