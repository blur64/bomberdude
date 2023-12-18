export default class KeyboardController {
  constructor({ keysToDetect, onKeyDown, onKeyUp }) {
    this._keysToDetect = keysToDetect;
    this._notifyKeyDown = onKeyDown;
    this._notifyKeyUp = onKeyUp;
    this._keysStates = [];

    this._initKeysStates();
    this._bindEventsListeners();
  }

  _initKeysStates() {
    this._keysStates = this._keysToDetect.map(key => ({ key, isPressed: false }));
  }

  _bindEventsListeners() {
    document.addEventListener('keydown', e => this._handleKeyDown(e.code));
    document.addEventListener('keyup', e => this._handleKeyUp(e.code));
  }

  _handleKeyDown(key) {
    let keyState = null;
    if (this._keysToDetect.includes(key) &&
      !(keyState = this._findKeyState(key)).isPressed) {
      this._notifyKeyDown(key);
      keyState.isPressed = true;
    }
  }

  _handleKeyUp(key) {
    if (this._keysToDetect.includes(key)) {
      this._notifyKeyUp?.(key);
      this._findKeyState(key).isPressed = false;
    }
  }

  _findKeyState(key) {
    return this._keysStates.find(s => s.key === key);
  }
}