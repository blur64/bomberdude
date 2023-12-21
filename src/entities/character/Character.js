import MovementComponent from '../../components/MovementComponent.js';
import Bomb from '../bomb/Bomb.js';
import CollisionsDetector from '../../collisions/CollisionsDetector.js';
import { CELL_SIZE, INITIAL_CHARACTER_VELOCITY_X, INITIAL_CHARACTER_VELOCITY_Y, BOMB_SIZE } from '../../constants/constants.js';

export default class Character {
  constructor({
    initialX, initialY, arena, dyingTime, height, width, initialBombPower,
    bombTimeout, hitboxPadding, hitboxHeight, hitboxWidth
  }) {
    this._coors = {
      x: initialX,
      y: initialY
    };
    this._hitboxPadding = hitboxPadding;
    this._hitbox = {
      coors: { x: initialX + hitboxPadding, y: initialY + hitboxPadding },
      sizeX: hitboxWidth,
      sizeY: hitboxHeight,
    };
    this._width = width;
    this._height = height;
    this._arena = arena;
    this._bombPower = initialBombPower;
    this._dyingTime = dyingTime;
    this._isDead = false;
    this._isDying = false;
    this._bombTimeout = bombTimeout;
    this._canPlantBomb = true;
    this._movementComponent = new MovementComponent({
      item: this,
      collisionsDetector: new CollisionsDetector(arena),
      velocityX: INITIAL_CHARACTER_VELOCITY_X,
      velocityY: INITIAL_CHARACTER_VELOCITY_Y
    });
  }

  update() {
    if (this._isDead || this._isDying) {
      return;
    }
    this.movementComponent.update();
    this._updateHitbox();
  }

  get isDead() {
    return this._isDead;
  }
  get isDying() {
    return this._isDying;
  }
  get movementComponent() {
    return this._movementComponent;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get coors() {
    return this._coors;
  }
  get hitbox() {
    return this._hitbox;
  }

  _updateHitbox() {
    this._hitbox.coors.x = this._coors.x + this._hitboxPadding;
    this._hitbox.coors.y = this._coors.y + this._hitboxPadding;
  }

  plantBomb() {
    if (!this._canPlantBomb || this._isDead || this._isDying) {
      return;
    }
    this._canPlantBomb = false;
    setTimeout(() => this._canPlantBomb = true, this._bombTimeout);
    const [bombX, bombY] = [
      Math.floor((this._coors.x + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
      Math.floor((this._coors.y + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE
    ];
    const bomb = new Bomb({
      x: bombX,
      y: bombY,
      power: this._bombPower,
      detonationTimeout: this._bombTimeout,
      arena: this._arena,
      bombSize: BOMB_SIZE
    });
    this._arena.addItem(bomb);
    bomb.turnOnTimer();
  }

  kill() {
    this._isDying = true;
    setTimeout(() => {
      this._isDead = true;
      this._isDying = false;
    }, this._dyingTime);
  }
}
