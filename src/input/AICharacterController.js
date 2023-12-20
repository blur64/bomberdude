import { directions } from "../constants/constants";

export default class AICharacterController {
  constructor(character, arena) {
    this._character = character;
    this._arena = arena;
    this._currentCharacterDirection = '';
    this._lastClearDirections = [];
  }

  update() {
    const clearDirections = this._arena.getClearDirectionsFor(this._character);
    if (clearDirections.toString() !== this._lastClearDirections.toString()) {
      this._setCharacterMove(this._currentCharacterDirection, false);
      if (clearDirections.length > 1) {
        const clearDirectionsWithoutOpposite = clearDirections.filter(dir => !this._areDirectionsOpposite(dir, this._currentCharacterDirection));
        if (clearDirectionsWithoutOpposite.length > 1 && Math.round(Math.random() * 1) === 1 && this._arena.getWallsCount < 40) {
          this._character.plantBomb();
        }
        const nextDirection = clearDirectionsWithoutOpposite[Math.floor((Math.random() * clearDirectionsWithoutOpposite.length))];
        this._currentCharacterDirection = nextDirection;
        this._setCharacterMove(this._currentCharacterDirection, true);
      }
      else if (clearDirections.length === 1) {
        if (Math.round(Math.random() * 1) === 1) {
          this._character.plantBomb();
        }
        this._currentCharacterDirection = clearDirections[0];
        this._setCharacterMove(this._currentCharacterDirection, true);
      } else {
        this._currentCharacterDirection = '';
      }
      this._lastClearDirections = clearDirections;
    }
  }

  /*
  update() {
    const clearDirections = this._arena.getClearDirectionsFor(this._character);
    if (clearDirections.length) {
      if (this._lastClearDirections.toString() !== clearDirections.toString()) {
        const clearDirectionsWithoutOpposite = clearDirections.filter(dir => !this._areDirectionsOpposite(dir, this._currentCharacterDirection));
        const nextRandomDirection = clearDirectionsWithoutOpposite[Math.floor((Math.random() * clearDirectionsWithoutOpposite.length))];
        this._setCharacterMove(this._currentCharacterDirection, false);
        this._currentCharacterDirection = nextRandomDirection;
        this._setCharacterMove(this._currentCharacterDirection, true);
      }
      // if (!clearDirections.includes(this._currentCharacterDirection)) {
      //   this._setCharacterMove(this._currentCharacterDirection, false);
      //   this._currentCharacterDirection = clearDirections[Math.floor((Math.random() * clearDirections.length))];
      //   this._setCharacterMove(this._currentCharacterDirection, true)
      // }
    } else {
      if (this._currentCharacterDirection) {
        this._setCharacterMove(this._currentCharacterDirection, false);
        this._currentCharacterDirection = '';
      }
    }
    this._lastClearDirections = clearDirections;
  }
  */

  _areDirectionsOpposite(dir1, dir2) {
    return dir1 === directions.UP && dir2 === directions.DOWN
      || dir1 === directions.DOWN && dir2 === directions.UP
      || dir1 === directions.RIGHT && dir2 === directions.LEFT
      || dir1 === directions.LEFT && dir2 === directions.RIGHT;
  }

  _setCharacterMove(direction, isMove) {
    switch (direction) {
      case directions.UP:
        this._character.movementComponent.setMoveUp(isMove);
        break;
      case directions.DOWN:
        this._character.movementComponent.setMoveDown(isMove);
        break;
      case directions.RIGHT:
        this._character.movementComponent.setMoveRight(isMove);
        break;
      case directions.LEFT:
        this._character.movementComponent.setMoveLeft(isMove);
        break;
    }
  }
}