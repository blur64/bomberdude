export default class Wall {
  constructor({ x, y, arena }) {
    this.coors = { x, y };
    this.arena = arena;
    this._isDestroing = false;
  }

  get isDestroing() {
    return this._isDestroing;
  }

  destroy(destroingTime) {
    this._isDestroing = true;
    setTimeout(() => this.arena.removeItem(this), destroingTime);
  }
}