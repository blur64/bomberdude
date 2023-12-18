import { Assets, Spritesheet } from "pixi.js";

export default class ResourcesManager {
  constructor() {
    this._textures = {};
    this._spritesheets = {};
  }

  getTexture(textureName) {
    return this._textures[textureName];
  }

  getSpritesheet(spritesheetName) {
    return this._spritesheets[spritesheetName];
  }

  async load() {
    const arenaGroundTexture = await Assets.load('./assets/grass.png');
    const arenaSectionTexture = await Assets.load('./assets/wall.png');
    const wallTexture = await Assets.load('./assets/wall_destroyable.png');
    const bombTexture = await Assets.load('./assets/bomb.png');

    this._textures.ground = arenaGroundTexture;
    this._textures.arenaSection = arenaSectionTexture;
    this._textures.wall = wallTexture;
    this._textures.bomb = bombTexture;

    const characterTexture = await Assets.load('./assets/dude_spritesheet.png');
    const characterTextureData = await Assets.load('./assets/sprites.json');
    const explosionTexture = await Assets.load('./assets/explosion.png');
    const explosionTextureData = await Assets.load('./assets/explosion_data.json');

    const characterSpritesheet = new Spritesheet(characterTexture, characterTextureData.data);
    const explosionSpritesheet = new Spritesheet(explosionTexture, explosionTextureData.data);

    await characterSpritesheet.parse();
    await explosionSpritesheet.parse();

    this._spritesheets.character = characterSpritesheet;
    this._spritesheets.explosion = explosionSpritesheet;
  }
}