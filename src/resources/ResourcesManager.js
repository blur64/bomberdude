import { Assets, Spritesheet } from "pixi.js";
import { texturesUrls, spritesheets, spritesheetsDataUrls, spritesheetsImagesUrls } from "../constants/constants";

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

  load() {
    Assets.addBundle('textures', texturesUrls);
    Assets.addBundle('spritesheetsImages', spritesheetsImagesUrls);
    Assets.addBundle('spritesheetsData', spritesheetsDataUrls);

    return Promise.all([
      Assets.loadBundle('textures'),
      Assets.loadBundle('spritesheetsImages'),
      Assets.loadBundle('spritesheetsData'),
    ])
      .then(bundles => {
        this._textures = bundles[0];
        Object.values(spritesheets).forEach(sheetName => {
          const spritesheet = new Spritesheet(bundles[1][sheetName], bundles[2][sheetName].data);
          spritesheet.parse()
            .then(() => this._spritesheets[sheetName] = spritesheet);
        });
      });
  }
}