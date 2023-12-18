export default class CollisionsDetector {
  constructor(arena) {
    this.arena = arena;
  }

  getOrientCollisions({ item, nextItemCoors }) {
    const collisions = {
      vertical: this._detect(item.coors.x, nextItemCoors.y, item.sizeX, item.sizeY, item),
      horizontal: this._detect(nextItemCoors.x, item.coors.y, item.sizeX, item.sizeY, item)
    };

    const bothOrientsCollision = this
      ._detect(nextItemCoors.x, nextItemCoors.y, item.sizeX, item.sizeY, item);

    if (!collisions.vertical && !collisions.horizontal && bothOrientsCollision)
      collisions.vertical = collisions.horizontal = true;

    return collisions;
  }

  _detect(x, y, sizeX, sizeY, item) {
    const itemVertices = [
      { x, y },
      { x: x + sizeX, y },
      { x: x + sizeX, y: y + sizeY },
      { x, y: y + sizeY },
    ];
    return !itemVertices.every(p => {
      const itemThePointIn = this.arena.getItemThePointIn(p.x, p.y);
      if (itemThePointIn === undefined) {
        return false;
      } else if (!itemThePointIn) {
        return true;
      } else {
        return this.arena.isItemCrossableFor(itemThePointIn, item);
      }
    });
  }
}