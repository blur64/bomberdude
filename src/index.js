import { Application, Graphics, Text, Container } from 'pixi.js';
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
  ARENA_ROWS_COUNT,
  RESTART_GAME_KEY,
  INITIAL_CHARACTERS_POSITIONS
} from './constants/constants.js';
import KeyboardController from './input/KeyboardController.js';

class Match {
  constructor({ resources, playerCharacterController, app, onFinishMatch }) {
    this._resources = resources;
    this._arena = null;
    this._playerCharacterController = playerCharacterController;
    this._aiCharactersControllers = [];
    this._app = app;
    this._onFinishMatch = onFinishMatch;
    this._viewsController = null;
    this._tickerUpdate = null;
    this._characters = [];
  }

  start() {
    this._initGameObjects();
  }

  _initGameObjects() {
    this._arena = new Arena(ARENA_ROWS_COUNT, ARENA_COLS_COUNT);
    const characters = this._initCharacters();
    this._characters = [...characters];
    characters.forEach(c => this._arena.addCharacter(c));
    this._playerCharacterController.character = characters.shift();
    this._playerCharacterController.character.setPlayerCharacter();
    characters.forEach(c => this._aiCharactersControllers.push(new AICharacterController(c, this._arena)));
    (new ArenaView(
      this._arena,
      this._resources.getTexture(textures.ARENA_GROUND),
      this._app.stage
    )).renderGround();
    this._viewsController = new ViewsController({
      arena: this._arena,
      stage: this._app.stage,
      viewsTextures: {
        [textures.ARENA_SECTION]: this._resources.getTexture(textures.ARENA_SECTION),
        [textures.WALL]: this._resources.getTexture(textures.WALL),
        // [textures.BOMB]: this._resources.getTexture(textures.BOMB),
      },
      viewsSpritesheets: {
        [spritesheets.EXPLOSION]: this._resources.getSpritesheet(spritesheets.EXPLOSION),
        [spritesheets.CHARACTER]: this._resources.getSpritesheet(spritesheets.CHARACTER),
        [spritesheets.BOMB]: this._resources.getSpritesheet(spritesheets.BOMB),
      }
    });
    this._tickerUpdate = this._matchUpdater.bind(this);
    this._app.ticker.add(this._tickerUpdate);
  }

  _matchUpdater() {
    this._arena.update();
    this._aiCharactersControllers.forEach(c => c.update());
    this._viewsController.update();
    this._checkMatchIsFinished();
  }

  _initCharacters() {
    return INITIAL_CHARACTERS_POSITIONS.map(pos => this._createCharacter({
      initialX: pos.x,
      initialY: pos.y,
      arena: this._arena
    }));
  }

  _createCharacter(characterParams) {
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

  _checkMatchIsFinished() {
    const playerChar = this._characters.find(c => c.isPlayerCharacter);
    const enemiesChars = this._characters.filter(c => !c.isPlayerCharacter);
    if (playerChar.isDead) {
      this._onFinishMatch(false);
    }
    if (enemiesChars.every(c => c.isDead)) {
      this._onFinishMatch(true);
    }
  }

  finish() {
    this._app.ticker.remove(this._tickerUpdate);
    this._playerCharacterController.removeCharacter();
  }
}

class GameManager {
  constructor() {
    this._resources = new ResourcesManager();
    this._app = new Application({
      width: ARENA_COLS_COUNT * CELL_SIZE,
      height: ARENA_ROWS_COUNT * CELL_SIZE
    });
    document.body.appendChild(this._app.view);
    new KeyboardController({
      keysToDetect: [RESTART_GAME_KEY],
      onKeyDown: this._onRestartMatch.bind(this),
    });
    this._playerCharacterController = new PlayerCharacterController(null, movementKeys1, actionKeys1);
    this._currentMatch = null;
    this._resources.load().then(() => this._startMatch());
  }

  _onRestartMatch() {
    this._currentMatch.finish();
    this._startMatch();
  }

  _startMatch() {
    this._currentMatch = new Match({
      resources: this._resources,
      playerCharacterController: this._playerCharacterController,
      app: this._app,
      onFinishMatch: this._onFinishMatch.bind(this),
    })
    this._currentMatch.start();
  }

  _onFinishMatch(isWin) {
    this._currentMatch.finish();
    this._app.stage.removeChildren();
    const background = new Graphics();
    background.beginFill(0xDE3249)
      .drawRect(0, 0, ARENA_COLS_COUNT * CELL_SIZE, ARENA_ROWS_COUNT * CELL_SIZE)
      .endFill();
    this._app.stage.addChild(background);
    const textContainer = new Container();
    const backgroundText1 = new Text(isWin ? 'Win ^_^' : 'Lose :c');
    const backgroundText2 = new Text('Press R to restart...');
    backgroundText1.anchor.set(0.5);
    backgroundText2.anchor.set(0.5);
    backgroundText2.y = 40;
    textContainer.addChild(backgroundText1);
    textContainer.addChild(backgroundText2);
    textContainer.x = ARENA_COLS_COUNT * CELL_SIZE / 2;
    textContainer.y = ARENA_ROWS_COUNT * CELL_SIZE / 2;
    // backgroundText1.x = ARENA_COLS_COUNT * CELL_SIZE / 2;
    // backgroundText2.x = ARENA_ROWS_COUNT * CELL_SIZE / 2;
    this._app.stage.addChild(textContainer);
  }
}

window.onload = new GameManager();