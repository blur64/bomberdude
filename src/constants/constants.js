const CELL_SIZE = 60;
const CHARACTER_SIZE = 59;
const INITIAL_CHARACTER_VELOCITY_X = 4;
const INITIAL_CHARACTER_VELOCITY_Y = 4;
const directions = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};
const actions = {
  PLANT_BOMB: 'plant_bomb',
};
const movementKeys1 = {
  'KeyW': directions.UP,
  'KeyS': directions.DOWN,
  'KeyD': directions.RIGHT,
  'KeyA': directions.LEFT,
};
const movementKeys2 = {
  'ArrowUp': directions.UP,
  'ArrowDown': directions.DOWN,
  'ArrowRight': directions.RIGHT,
  'ArrowLeft': directions.LEFT,
};
const actionKeys1 = {
  'KeyZ': actions.PLANT_BOMB,
};
const actionKeys2 = {
  'KeyX': actions.PLANT_BOMB,
};

export {
  CELL_SIZE,
  CHARACTER_SIZE,
  directions,
  actions,
  movementKeys1,
  movementKeys2,
  actionKeys1,
  actionKeys2,
  INITIAL_CHARACTER_VELOCITY_X,
  INITIAL_CHARACTER_VELOCITY_Y
};