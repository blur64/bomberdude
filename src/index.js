import { Application } from 'pixi.js';
import ResourcesManager from './resources/ResourcesManager.js';
import Arena from './entities/arena/Arena.js';
import Character from './entities/character/Character.js';
import PlayerCharacterController from './input/PlayerCharacterController.js';
import AICharacterController from './input/AICHaracterController.js';
import ViewsController from './views/ViewsController.js';
import ArenaView from './views/ArenaView.js';
import {
  CELL_SIZE,
  actionKeys1,
  movementKeys1,
  textures,
  spritesheets,
  CHARACTER_DYING_TIME,
  CHARACTER_SIZE,
  INITIAL_BOMB_POWER,
  BOMB_TIMEOUT,
  CHARACTER_HITBOX_PADDING,
  CHARACTER_HITBOX_HEIGHT,
  CHARACTER_HITBOX_WIDTH,
  ARENA_COLS_COUNT,
  ARENA_ROWS_COUNT
} from './constants/constants.js';

function createCharacter(characterParams) {
  return new Character(Object.assign({
    initialX: 0,
    initialY: 0,
    arena: null,
    dyingTime: CHARACTER_DYING_TIME,
    height: CHARACTER_SIZE,
    width: CHARACTER_SIZE,
    initialBombPower: INITIAL_BOMB_POWER,
    bombTimeout: BOMB_TIMEOUT,
    hitboxPadding: CHARACTER_HITBOX_PADDING,
    hitboxHeight: CHARACTER_HITBOX_HEIGHT,
    hitboxWidth: CHARACTER_HITBOX_WIDTH
  }, characterParams));
}

function start() {
  const resources = new ResourcesManager();
  resources.load().then(() => {
    const app = new Application({ width: 1000, height: 800 });
    document.body.appendChild(app.view);

    const arena = new Arena(ARENA_ROWS_COUNT, ARENA_COLS_COUNT);

    const character = createCharacter({
      initialX: 0,
      initialY: 0,
      arena
    });
    const aiCharacter = createCharacter({
      initialX: 0,
      initialY: (ARENA_ROWS_COUNT - 1) * CELL_SIZE,
      arena
    });
    const aiCharacter2 = createCharacter({
      initialX: (ARENA_COLS_COUNT - 1) * CELL_SIZE,
      initialY: 0,
      arena
    });
    const aiCharacter3 = createCharacter({
      initialX: (ARENA_COLS_COUNT - 1) * CELL_SIZE,
      initialY: (ARENA_ROWS_COUNT - 1) * CELL_SIZE,
      arena
    });
    new PlayerCharacterController(character, movementKeys1, actionKeys1);
    const aiCharacterController = new AICharacterController(aiCharacter, arena);
    const aiCharacterController2 = new AICharacterController(aiCharacter2, arena);
    const aiCharacterController3 = new AICharacterController(aiCharacter3, arena);
    arena.addCharacter(character);
    arena.addCharacter(aiCharacter);
    arena.addCharacter(aiCharacter2);
    arena.addCharacter(aiCharacter3);

    const arenaView = new ArenaView(arena, resources.getTexture(textures.ARENA_GROUND), app.stage);
    arenaView.renderGround();

    const viewsController = new ViewsController({
      arena,
      stage: app.stage,
      viewsTextures: {
        [textures.ARENA_SECTION]: resources.getTexture(textures.ARENA_SECTION),
        [textures.WALL]: resources.getTexture(textures.WALL),
        [textures.BOMB]: resources.getTexture(textures.BOMB),
      },
      viewsSpritesheets: {
        [spritesheets.EXPLOSION]: resources.getSpritesheet(spritesheets.EXPLOSION),
        [spritesheets.CHARACTER]: resources.getSpritesheet(spritesheets.CHARACTER),
      }
    });

    app.ticker.add(() => {
      arena.update();
      aiCharacterController.update();
      aiCharacterController2.update();
      aiCharacterController3.update();
      viewsController.update();
    })
  });
}

window.onload = start;