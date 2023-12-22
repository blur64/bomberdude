const CELL_SIZE = 60;
const CHARACTER_SIZE = 59;
const BOMB_SIZE = 59;
const INITIAL_CHARACTER_VELOCITY_X = 3;
const INITIAL_BOMB_POWER = 4;
const EXPLOSION_DURATION = 1000;
const BOMB_TIMEOUT = 2000;
const INITIAL_CHARACTER_VELOCITY_Y = 3;
const CHARACTER_DYING_TIME = 2000;
const CHARACTER_HITBOX_PADDING = 20;
const CHARACTER_HITBOX_WIDTH = 20;
const CHARACTER_HITBOX_HEIGHT = 20;
const ARENA_COLS_COUNT = 17;
const ARENA_ROWS_COUNT = 13;
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
const textures = {
  ARENA_GROUND: 'arena_ground',
  ARENA_SECTION: 'arena_section',
  WALL: 'wall',
  BOMB: 'bomb',
};
const texturesUrls = {
  [textures.ARENA_GROUND]: './assets/grass.png',
  [textures.ARENA_SECTION]: './assets/wall.png',
  [textures.WALL]: './assets/wall_destroyable.png',
  [textures.BOMB]: './assets/bomb.png',
};
const spritesheets = {
  CHARACTER: 'character',
  EXPLOSION: 'explosion',
};
const spritesheetsImagesUrls = {
  [spritesheets.CHARACTER]: './assets/dude_spritesheet.png',
  [spritesheets.EXPLOSION]: './assets/explosion.png',
};
const spritesheetsDataUrls = {
  [spritesheets.CHARACTER]: './assets/sprites.json',
  [spritesheets.EXPLOSION]: './assets/explosion_data.json',
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
  INITIAL_CHARACTER_VELOCITY_Y,
  textures,
  texturesUrls,
  spritesheets,
  spritesheetsImagesUrls,
  spritesheetsDataUrls,
  CHARACTER_DYING_TIME,
  INITIAL_BOMB_POWER,
  BOMB_TIMEOUT,
  CHARACTER_HITBOX_PADDING,
  CHARACTER_HITBOX_WIDTH,
  CHARACTER_HITBOX_HEIGHT,
  ARENA_COLS_COUNT,
  ARENA_ROWS_COUNT,
  BOMB_SIZE,
  EXPLOSION_DURATION
};