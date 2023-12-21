export default class Explosion {
  constructor({ x, y, duration, arena }) {
    this.coors = { x, y };
    this.arena = arena;
    setTimeout(() => this._destroySelf(), duration);
    // ПОДПИСАТЬСЯ НА СОБЫТИЕ ВЗРЫВА???
  }

  update() {
    // this.arena.characters.forEach(c => this.arena.isItemTouchingMe());
    // А ТЕПЕРЬ МНЕ КАЖЕТСЯ, ЧТО АРЕНА ДОЛЖНА СЛЕДИТЬ ЗА ЭТИМ, НО ОПОВЕЩАТЬ
    // ОБЪЕКТ ВЗРЫВА, ЕСЛИ ПЕРСОНАЖ ПОПАЛ ВО ВЗРЫВ, ЧТОБЫ ОБЪЕКТ ВЗРЫВА РЕШИЛ,
    // ЧТО С ПЕРСОНАЖЕМ ДЕЛАТЬ
    // const charactersToKill = [];
    // this.arena.characters.forEach(c => );
    // charactersToKill.forEach(c => c.kill());
  }

  _destroySelf() {
    this.arena.removeItem(this);
  }
}