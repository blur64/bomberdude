import { directions } from "../constants/constants.js";

export default class MovementComponent {
  constructor({ collisionsDetector, item, velocityX, velocityY }) {
    this._item = item;
    this._inputDirectionsState = {
      isUp: false,
      isDown: false,
      isRight: false,
      isLeft: false,
    };
    this._lookingDirection = directions.DOWN;
    this._movementX = 0;
    this._movementY = 0;
    this._velocityX = velocityX;
    this._velocityY = velocityY;
    this._collisionsDetector = collisionsDetector;
  }

  update() {
    this._updateMovementsBasedOnInputDirections();
    this._updateMovementsBasedOnCollisions();
    this._updateMovementsBasedOnAutoShift();
    this._changeLookingDirection();
    this._updateCoors();
  }

  get lookingDirection() {
    return this._lookingDirection;
  }
  get movementX() {
    return this._movementX;
  }
  get movementY() {
    return this._movementY;
  }

  _changeLookingDirection() {
    if (this._movementX || this._movementY) {
      if (this._movementX > 0) {
        this._lookingDirection = directions.RIGHT;
      } else if (this._movementX < 0) {
        this._lookingDirection = directions.LEFT;
      } else if (this._movementY > 0) {
        this._lookingDirection = directions.DOWN;
      } else if (this._movementY < 0) {
        this._lookingDirection = directions.UP;
      }
    } else {
      if (this._inputDirectionsState.isUp) {
        this._lookingDirection = directions.UP;
      } else if (this._inputDirectionsState.isDown) {
        this._lookingDirection = directions.DOWN;
      } else if (this._inputDirectionsState.isRight) {
        this._lookingDirection = directions.RIGHT;
      } else if (this._inputDirectionsState.isLeft) {
        this._lookingDirection = directions.LEFT;
      }
    }
  }

  _updateMovementsBasedOnAutoShift() {
    if (Object.values(this._inputDirectionsState).some(v => v) &&
      !this._movementX && !this._movementY) {
      const charCenterX = Math.round(this._item.coors.x + this._item.width / 2);
      const charCenterY = Math.round(this._item.coors.y + this._item.height / 2);
      const cellX = Math.floor(charCenterX / 60) * 60;
      const cellY = Math.floor(charCenterY / 60) * 60;

      if (this._item.coors.x < cellX) {
        this._movementX = 1;
      } else if (this._item.coors.x > cellX) {
        this._movementX = -1;
      } else if (this._item.coors.y < cellY) {
        this._movementY = 1;
      } else if (this._item.coors.y > cellY) {
        this._movementY = -1;
      }
    }
  }

  _updateMovementsBasedOnCollisions() {
    const { vertical, horizontal } = this._collisionsDetector
      .getOrientCollisions({ nextItemCoors: this._getNextCoors(), item: this._item });

    if (vertical) {
      this._movementY = 0;
    }
    if (horizontal) {
      this._movementX = 0;
    }
  }

  _updateCoors() {
    const { x: nextX, y: nextY } = this._getNextCoors();
    this._item.coors.x = nextX;
    this._item.coors.y = nextY;
  }

  _getNextCoors() {
    return {
      x: this._item.coors.x + this._movementX * this._velocityX,
      y: this._item.coors.y + this._movementY * this._velocityY
    };
  }

  _updateMovementsBasedOnInputDirections() {
    if (this._inputDirectionsState.isUp) {
      this._movementY = -1;
    }
    if (this._inputDirectionsState.isDown) {
      this._movementY = 1;
    }
    if (this._inputDirectionsState.isDown &&
      this._inputDirectionsState.isUp ||
      !this._inputDirectionsState.isDown &&
      !this._inputDirectionsState.isUp) {
      this._movementY = 0;
    }

    if (this._inputDirectionsState.isRight) {
      this._movementX = 1;
    }
    if (this._inputDirectionsState.isLeft) {
      this._movementX = -1;
    }
    if (this._inputDirectionsState.isRight &&
      this._inputDirectionsState.isLeft ||
      !this._inputDirectionsState.isRight &&
      !this._inputDirectionsState.isLeft) {
      this._movementX = 0;
    }
  }

  setMoveUp(isMove) {
    this._inputDirectionsState.isUp = isMove;
  }
  setMoveDown(isMove) {
    this._inputDirectionsState.isDown = isMove;
  }
  setMoveLeft(isMove) {
    this._inputDirectionsState.isLeft = isMove;
  }
  setMoveRight(isMove) {
    this._inputDirectionsState.isRight = isMove;
  }
}

// _updateMovementsBasedOnModificators() {
//   if (this.entity.modificators.reversedMoves) {
//     this._movementX = -this._movementX;
//     this._movementY = -this._movementY;
//   }
// }