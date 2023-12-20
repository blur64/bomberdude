import {
  CHARACTER_SIZE,
  INITIAL_CHARACTER_VELOCITY_X,
  INITIAL_CHARACTER_VELOCITY_Y,
  directions
} from "../constants/constants.js";

export default class MovementComponent {
  constructor(coordinates, collisionsDetector, item) {
    this.item = item;
    this.coors = coordinates;
    // Скорее всего эти состояния должны приходить извне как аргумент
    // в метод update
    this.inputDirectionsState = {
      isUp: false,
      isDown: false,
      isRight: false,
      isLeft: false,
    };
    this.lookingDirection = directions.DOWN;
    this.movementX = 0;
    this.movementY = 0;
    this.velocityX = INITIAL_CHARACTER_VELOCITY_X;
    this.velocityY = INITIAL_CHARACTER_VELOCITY_Y;
    this.collisionsDetector = collisionsDetector;
    this.sizeX = CHARACTER_SIZE;
    this.sizeY = CHARACTER_SIZE;
  }

  update() {
    this._updateMovementsBasedOnInputDirections();
    this._updateMovementsBasedOnCollisions();
    this._updateMovementsBasedOnAutoShift();
    this._changeLookingDirection();
    this._updateCoors();
  }

  _changeLookingDirection() {
    if (this.movementX || this.movementY) {
      if (this.movementX > 0) {
        this.lookingDirection = directions.RIGHT;
      } else if (this.movementX < 0) {
        this.lookingDirection = directions.LEFT;
      } else if (this.movementY > 0) {
        this.lookingDirection = directions.DOWN;
      } else if (this.movementY < 0) {
        this.lookingDirection = directions.UP;
      }
    } else {
      if (this.inputDirectionsState.isUp) {
        this.lookingDirection = directions.UP;
      } else if (this.inputDirectionsState.isDown) {
        this.lookingDirection = directions.DOWN;
      } else if (this.inputDirectionsState.isRight) {
        this.lookingDirection = directions.RIGHT;
      } else if (this.inputDirectionsState.isLeft) {
        this.lookingDirection = directions.LEFT;
      }
    }
  }

  _updateMovementsBasedOnAutoShift() {
    if (Object.values(this.inputDirectionsState).some(v => v) &&
      !this.movementX && !this.movementY) {
      const charCenterX = Math.round(this.coors.x + CHARACTER_SIZE / 2);
      const charCenterY = Math.round(this.coors.y + CHARACTER_SIZE / 2);
      const cellX = Math.floor(charCenterX / 60) * 60;
      const cellY = Math.floor(charCenterY / 60) * 60;

      if (this.coors.x < cellX) {
        this.movementX = 1;
      } else if (this.coors.x > cellX) {
        this.movementX = -1;
      } else if (this.coors.y < cellY) {
        this.movementY = 1;
      } else if (this.coors.y > cellY) {
        this.movementY = -1;
      }
    }
  }

  _updateMovementsBasedOnCollisions() {
    const { vertical, horizontal } = this.collisionsDetector
      .getOrientCollisions({ nextItemCoors: this._getNextCoors(), item: this.item });

    if (vertical) {
      this.movementY = 0;
    }
    if (horizontal) {
      this.movementX = 0;
    }
  }

  _updateCoors() {
    const { x: nextX, y: nextY } = this._getNextCoors();
    this.coors.x = nextX;
    this.coors.y = nextY;
  }

  _getNextCoors() {
    return {
      x: this.coors.x + this.movementX * this.velocityX,
      y: this.coors.y + this.movementY * this.velocityY
    };
  }

  _updateMovementsBasedOnInputDirections() {
    if (this.inputDirectionsState.isUp) {
      this.movementY = -1;
    }
    if (this.inputDirectionsState.isDown) {
      this.movementY = 1;
    }
    if (this.inputDirectionsState.isDown &&
      this.inputDirectionsState.isUp ||
      !this.inputDirectionsState.isDown &&
      !this.inputDirectionsState.isUp) {
      this.movementY = 0;
    }

    if (this.inputDirectionsState.isRight) {
      this.movementX = 1;
    }
    if (this.inputDirectionsState.isLeft) {
      this.movementX = -1;
    }
    if (this.inputDirectionsState.isRight &&
      this.inputDirectionsState.isLeft ||
      !this.inputDirectionsState.isRight &&
      !this.inputDirectionsState.isLeft) {
      this.movementX = 0;
    }
  }


  setMoveUp(isMove) {
    this.inputDirectionsState.isUp = isMove;
  }
  setMoveDown(isMove) {
    this.inputDirectionsState.isDown = isMove;
  }
  setMoveLeft(isMove) {
    this.inputDirectionsState.isLeft = isMove;
  }
  setMoveRight(isMove) {
    this.inputDirectionsState.isRight = isMove;
  }
}

// _updateMovementsBasedOnModificators() {
//   if (this.entity.modificators.reversedMoves) {
//     this.movementX = -this.movementX;
//     this.movementY = -this.movementY;
//   }
// }