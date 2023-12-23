import { directions } from "../constants/constants";

export default class CharacterController {
  constructor(character) {
    this._character = character;
  }

  set character(newCharacter) {
    this._character = newCharacter;
  }
  get character() {
    return this._character;
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