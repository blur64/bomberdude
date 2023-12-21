import KeyboardController from './KeyboardController.js';
import { actions } from '../constants/constants.js';
import CharacterController from './CharacterController.js';

export default class PlayerCharacterController extends CharacterController {
  constructor(character, movementKeys, actionKeys) {
    super(character);
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

  _onAction(key) {
    switch (this._keyToAction[key]) {
      case actions.PLANT_BOMB:
        this._character.plantBomb();
    }
  }
}