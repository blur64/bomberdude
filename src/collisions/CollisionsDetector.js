export default class CollisionsDetector {
  constructor(arena) {
    this._arena = arena;
  }

  getOrientCollisions({ item, nextItemCoors }) {
    const collisions = {
      vertical: this._detect(item.coors.x, nextItemCoors.y, item.width, item.height, item),
      horizontal: this._detect(nextItemCoors.x, item.coors.y, item.width, item.height, item)
    };

    const bothOrientsCollision = this
      ._detect(nextItemCoors.x, nextItemCoors.y, item.width, item.height, item);

    if (!collisions.vertical && !collisions.horizontal && bothOrientsCollision)
      collisions.vertical = collisions.horizontal = true;

    return collisions;
  }

  _detect(x, y, width, height, item) {
    const itemVertices = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ];
    return !itemVertices.every(p => {
      const itemThePointIn = this._arena.getItemThePointIn(p.x, p.y);
      if (itemThePointIn === undefined) {
        return false;
      } else if (!itemThePointIn) {
        return true;
      } else {
        return this._arena.isItemCrossableFor(itemThePointIn, item);
      }
    });
  }
}