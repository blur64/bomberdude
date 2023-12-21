import { areDirectionsOpposite } from "../helpers/helpers.js";
import CharacterController from "./CharacterController.js";

export default class AICharacterController extends CharacterController {
  constructor(character, arena) {
    super(character);
    this._arena = arena;
    this._currentCharacterDirection = '';
    this._lastClearDirections = [];
  }

  update() {
    const clearDirections = this._arena.getClearDirectionsFor(this._character);
    if (clearDirections.toString() !== this._lastClearDirections.toString()) {
      this._setCharacterMove(this._currentCharacterDirection, false);
      if (clearDirections.length > 1) {
        const clearDirectionsWithoutOpposite = clearDirections.filter(dir => !areDirectionsOpposite(dir, this._currentCharacterDirection));
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
}