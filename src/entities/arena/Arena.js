import { CELL_SIZE, CHARACTER_SIZE, directions } from "../../constants/constants.js";
import ArenaSection from "./ArenaSection.js";
import Wall from "../wall/Wall.js";
import Bomb from "../bomb/Bomb.js";
import Explosion from "../bomb/Explosion.js";

class ItemContext {
  constructor(item, isDestroyable, crossableFor) {
    this._item = item;
    this._isDestroyable = isDestroyable;
    this._crossableFor = crossableFor;
  }

  get item() {
    return this._item;
  }

  get isDestroyable() {
    return this._isDestroyable;
  }

  set isDestroyable(is) {
    this._isDestroyable = is;
  }

  get crossableFor() {
    return this._crossableFor;
  }

  addToCrossable(item) {
    this._crossableFor.push(item);
  }

  removeFromCrossable(item) {
    this._crossableFor.splice(this._crossableFor.indexOf(item), 1);
  }

  isItCrossableFor(item) {
    return this._crossableFor.includes(item);
  }
}

// class CharacterContext {}

export default class Arena {
  constructor(rowsCount, colsCount) {
    this._rowsCount = rowsCount;
    this._colsCount = colsCount;

    this._items = Array(rowsCount).fill().map(() => Array(colsCount).fill(null))
    this._itemsContexts = [];
    this._characters = [];

    this._generateItems();
  }

  update() {
    this._updateBombsCrossability();
    this._checkCharactersToRemove();
    this._characters.forEach(c => {
      c.update();
      if (c.isDead) {
        this._characters.splice(this._characters.indexOf(c), 1);
      }
    });
  }

  _updateBombsCrossability() {
    // Check character is out of bomb's bounds. If it is, mark this bomb as
    // uncrossable for the character.
    this._itemsContexts
      .filter(ic => ic.item instanceof Bomb)
      .forEach(bc => {
        const markedToRemove = [];
        bc.crossableFor.forEach(i => {
          if (Math.abs(i.coors.x - bc.item.coors.x) > bc.item.sizeX ||
            Math.abs(i.coors.y - bc.item.coors.y) > bc.item.sizeY) {
            markedToRemove.push(i);
          }
        });
        markedToRemove.forEach(i => bc.removeFromCrossable(i));
      });
  }

  _checkCharactersToRemove() {
    const charactersToRemove = [];
    this._characters.forEach(c => {
      const pointsToCheck = [
        { x: c.hitbox.coors.x, y: c.hitbox.coors.y },
        { x: c.hitbox.coors.x + c.hitbox.sizeX, y: c.hitbox.coors.y },
        { x: c.hitbox.coors.x + c.hitbox.sizeX, y: c.hitbox.coors.y + c.hitbox.sizeY },
        { x: c.hitbox.coors.x, y: c.hitbox.coors.y + c.hitbox.sizeY },
      ];
      pointsToCheck.some(p => {
        if (this.getItemThePointIn(p.x, p.y) instanceof Explosion) {
          charactersToRemove.push(c);
          return true;
        }
      });
    });
    charactersToRemove.forEach(c => c.kill());
  }

  get characters() {
    return this._characters;
  }

  get items() {
    return this._items;
  }

  get wallsCount() {
    return this._items.flat().filter(i => i instanceof Wall).length;
  }

  get rowsCount() {
    return this._rowsCount;
  }

  get colsCount() {
    return this._colsCount;
  }

  _generateItems() {
    this._generateArenaSections();
    this._generateWalls();
  }

  _generateArenaSections() {
    // let i = 0;
    // while(i < this._colsCount) {
    //   this.
    // }

    let row = 1;
    let column = 1;

    while (row < this._rowsCount) {
      while (column < this._colsCount) {
        this._items[row][column] = new ArenaSection(column * CELL_SIZE, row * CELL_SIZE, this);
        column += 2;
      }
      row += 2;
      column = 1;
    }
  }

  _generateWalls() {
    const arenaSectionsCount = this._items.flat()
      .filter(i => i instanceof ArenaSection).length;
    const cellsCount = this._colsCount * this._rowsCount;
    const countOfCellsAreEmptyAtStart = 12;
    const maxWallsCount = cellsCount - arenaSectionsCount - countOfCellsAreEmptyAtStart;
    const wallsCountLimiter = 15;
    const wallsCount = maxWallsCount - wallsCountLimiter;
    let i = 0;

    while (i < wallsCount) {
      const row = Math.round(Math.random() * (this._rowsCount - 1));
      const column = Math.round(Math.random() * (this._colsCount - 1));
      const gotIndexesOfCellIsEmptyAtStart = (row <= 1 || row >= this._rowsCount - 2) &&
        (column <= 1 || column >= this._colsCount - 2);
      const cellIsFilled = this._items[row][column];

      if (cellIsFilled || gotIndexesOfCellIsEmptyAtStart) {
        continue;
      }

      const wall = new Wall({ x: column * CELL_SIZE, y: row * CELL_SIZE, arena: this });
      this._items[row][column] = wall;
      this._itemsContexts.push(new ItemContext(wall, true, []));
      i++;
    }
  }

  addCharacter(character) {
    this._characters.push(character);
  }

  _getIndexesOfCellThePointIn(pointX, pointY) {
    return [Math.floor(pointY / CELL_SIZE), Math.floor(pointX / CELL_SIZE)];
  }

  addItem(item) {
    const [row, column] = this
      ._getIndexesOfCellThePointIn(item.coors.x + CELL_SIZE / 2, item.coors.y + CELL_SIZE / 2);
    if (row < 0 || row >= this._rowsCount || column < 0 || column >= this._colsCount) {
      return;
    }
    this._items[row][column] = item;
    // !!!
    if (item instanceof Bomb) {
      const charactersIn = this._getCharactersInCell(row, column);
      this._itemsContexts.push(new ItemContext(item, true, charactersIn));
    } else {
      this._itemsContexts.push(new ItemContext(item, true, this._characters));
    }
  }

  removeItem(item) {
    const [row, column] = this._getIndexesOfCellThePointIn(item.coors.x, item.coors.y);
    this._items[row][column] = null;
  }

  _getCharactersInCell(row, column) {
    return this._characters.filter(c => {
      const x = c.coors.x;
      const y = c.coors.y;
      const sizeX = c.movementComponent.sizeX;
      const sizeY = c.movementComponent.sizeY;
      const pointsToCheck = [
        { x, y },
        { x: x + sizeX, y },
        { x: x + sizeX, y: y + sizeY },
        { x, y: y + sizeY },
      ];
      return pointsToCheck.some(p => {
        const [pRow, pColumn] = this._getIndexesOfCellThePointIn(p.x, p.y);
        return pRow === row && pColumn === column;
      });
    });
  }

  _isPointOutOfBounds(x, y) {
    return !((0 <= x && x < this._colsCount * CELL_SIZE) &&
      (0 <= y && y < this._rowsCount * CELL_SIZE));
  }

  getItemThePointIn(x, y) {
    if (this._isPointOutOfBounds(x, y)) {
      return undefined;
    }
    const [row, column] = this._getIndexesOfCellThePointIn(x, y);
    return this._items[row][column];
  }

  _findContextOf(item) {
    return this._itemsContexts.find(c => c.item === item);
  }

  isItemCrossableFor(item, relativeTo) {
    if (item instanceof ArenaSection) {
      return false;
    }
    return this._findContextOf(item).isItCrossableFor(relativeTo);
  }

  isItemDestroyable(item) {
    if (item instanceof ArenaSection) {
      return false;
    }
    return this._findContextOf(item).isDestroyable;
  }

  isItemExist(item) {
    return this._items.flat().find(i => i === item);
  }

  isCharacterDead(character) {
    return !this._characters.includes(character);
  }

  getClearDirectionsFor(item) {
    let isNeedToFindWaysWithExplosionsInFuture = true;
    const indexesOfCellTheItemIn1 = this
      ._getIndexesOfCellThePointIn(item.coors.x, item.coors.y);
    const indexesOfCellTheItemIn2 = this
      ._getIndexesOfCellThePointIn(item.coors.x + CHARACTER_SIZE, item.coors.y + CHARACTER_SIZE);

    // first
    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn1[1] + i > this._colsCount - 1) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn1[0]][indexesOfCellTheItemIn1[1] + i];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn1[1] - i < 0) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn1[0]][indexesOfCellTheItemIn1[1] - i];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn1[0] + i > this._rowsCount - 1) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn1[0] + i][indexesOfCellTheItemIn1[1]];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn1[0] - i < 0) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn1[0] - i][indexesOfCellTheItemIn1[1]];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    // second
    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn2[1] + i > this._colsCount - 1) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn2[0]][indexesOfCellTheItemIn2[1] + i];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn2[1] - i < 0) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn2[0]][indexesOfCellTheItemIn2[1] - i];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn2[0] + i > this._rowsCount - 1) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn2[0] + i][indexesOfCellTheItemIn2[1]];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      if (indexesOfCellTheItemIn2[0] - i < 0) {
        break;
      }
      const anItem = this._items[indexesOfCellTheItemIn2[0] - i][indexesOfCellTheItemIn2[1]];
      if (anItem instanceof Wall || anItem instanceof ArenaSection) {
        break;
      }
      if (anItem instanceof Bomb) {
        isNeedToFindWaysWithExplosionsInFuture = false;
        break;
      }
    }

    return Object.values(directions).filter(d => {
      let coorsToCheck = { x: item.coors.x, y: item.coors.y };
      switch (d) {
        case directions.UP:
          coorsToCheck.y -= 1;
          break;
        case directions.RIGHT:
          coorsToCheck.x += 1;
          break;
        case directions.DOWN:
          coorsToCheck.y += 1;
          break;
        case directions.LEFT:
          coorsToCheck.x -= 1;
          break;
      }
      const pointsToCheck = [
        { x: coorsToCheck.x, y: coorsToCheck.y },
        { x: coorsToCheck.x + CHARACTER_SIZE, y: coorsToCheck.y },
        { x: coorsToCheck.x + CHARACTER_SIZE, y: coorsToCheck.y + CHARACTER_SIZE },
        { x: coorsToCheck.x, y: coorsToCheck.y + CHARACTER_SIZE },
      ];
      // return pointsToCheck.every(p => this.getItemThePointIn(p.x, p.y) === null);
      if (!pointsToCheck.every(p => {
        const itemThePointIn = this.getItemThePointIn(p.x, p.y);
        return itemThePointIn === null || (itemThePointIn instanceof Bomb ?
          this._findContextOf(itemThePointIn).isItCrossableFor(item) : false);
      })) {
        return false;
      } else {
        if (!isNeedToFindWaysWithExplosionsInFuture) {
          return true;
        }
        const pToCheck = { x: item.coors.x, y: item.coors.y };
        switch (d) {
          case directions.UP:
            pToCheck.y -= 1;
            break;
          case directions.RIGHT:
            pToCheck.x += CELL_SIZE;
            break;
          case directions.DOWN:
            pToCheck.y += CELL_SIZE;
            break;
          case directions.LEFT:
            pToCheck.x -= 1;
            break;
        }

        const indexesOfCellWhereItemWillBe = this._getIndexesOfCellThePointIn(pToCheck.x, pToCheck.y);

        for (let i = 0; i < 4; i++) {
          if (indexesOfCellWhereItemWillBe[1] + i > this._colsCount - 1) {
            break;
          }
          const anItem = this._items[indexesOfCellWhereItemWillBe[0]][indexesOfCellWhereItemWillBe[1] + i];
          if (anItem instanceof Wall || anItem instanceof ArenaSection) {
            break;
          }
          if (anItem instanceof Bomb) {
            return false;
          }
        }

        for (let i = 0; i < 4; i++) {
          if (indexesOfCellWhereItemWillBe[1] - i < 0) {
            break;
          }
          const anItem = this._items[indexesOfCellWhereItemWillBe[0]][indexesOfCellWhereItemWillBe[1] - i];
          if (anItem instanceof Wall || anItem instanceof ArenaSection) {
            break;
          }
          if (anItem instanceof Bomb) {
            return false;
          }
        }

        for (let i = 0; i < 4; i++) {
          if (indexesOfCellWhereItemWillBe[0] + i > this._rowsCount - 1) {
            break;
          }
          const anItem = this._items[indexesOfCellWhereItemWillBe[0] + i][indexesOfCellWhereItemWillBe[1]];
          if (anItem instanceof Wall || anItem instanceof ArenaSection) {
            break;
          }
          if (anItem instanceof Bomb) {
            return false;
          }
        }

        for (let i = 0; i < 4; i++) {
          if (indexesOfCellWhereItemWillBe[0] - i < 0) {
            break;
          }
          const anItem = this._items[indexesOfCellWhereItemWillBe[0] - i][indexesOfCellWhereItemWillBe[1]];
          if (anItem instanceof Wall || anItem instanceof ArenaSection) {
            break;
          }
          if (anItem instanceof Bomb) {
            return false;
          }
        }

        return true;
      }
    });
  }
}