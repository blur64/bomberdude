import KeyboardController from './KeyboardController.js';
import { directions, actions } from '../constants/constants.js';

export default class CharacterController {
  constructor(character, movementKeys, actionKeys) {
    this._character = character;
    this._keyToDirection = movementKeys;
    this._keyToAction = actionKeys;
    new KeyboardController({
      keysToDetect: Object.keys(movementKeys),
      onKeyDown: this._onStartMove.bind(this),
      onKeyUp: this._onFinishMove.bind(this)
    });
    new KeyboardController({
      keysToDetect: Object.keys(actionKeys),
      onKeyDown: this._onAction.bind(this)
    });
  }

  _onStartMove(key) {
    this._setCharacterMove(this._keyToDirection[key], true);
  }

  _onFinishMove(key) {
    this._setCharacterMove(this._keyToDirection[key], false);
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

  _onAction(key) {
    switch (this._keyToAction[key]) {
      case actions.PLANT_BOMB:
        this._character.plantBomb();
    }
  }
}