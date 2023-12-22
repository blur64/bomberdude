import CharacterView from './CharacterView';
import WallView from './WallView';
import ArenaSectionView from './ArenaSectionView';
import BombView from './BombView';
import ExplosionView from './ExplosionView';

import Character from '../entities/character/Character.js';
import Wall from '../entities/wall/Wall.js';
import ArenaSection from '../entities/arena/ArenaSection.js';
import Bomb from '../entities/bomb/Bomb.js';
import Explosion from '../entities/bomb/Explosion';

import { textures, spritesheets } from '../constants/constants.js';

export default class ViewsController {
  constructor({ arena, stage, viewsTextures, viewsSpritesheets }) {
    this._views = [];
    this._charactersViews = [];
    this._arena = arena;
    this._stage = stage;
    this._textures = viewsTextures;
    this._spritesheets = viewsSpritesheets;
  }

  update() {
    // delete unexistable views
    const viewsToDelete = [];
    this._views.forEach(v => {
      if (!this._arena.isItemExist(v.model)) {
        viewsToDelete.push(v);
      }
    });
    viewsToDelete.forEach(v => {
      this._views.splice(this._views.indexOf(v), 1);
      this._stage.removeChild(v);
    });

    // create views
    this._arena.items.flat().forEach(i => {
      if (!i) {
        return;
      }
      if (!this._views.find(v => v.model === i)) {
        this._trackView(this._createViewOf(i));
      }
    });
    // delete unexistable views
    // this._views.forEach(v => this._arena.isItemExist(v.model) ?
    //   null : this._stage.removeChild(v));

    // update views
    this._views.forEach(v => v.updateView());

    // delete unexistable characters views
    const charactersViewsToRemove = [];
    this._charactersViews.forEach(cw => {
      if (this._arena.isCharacterDead(cw.model)) {
        charactersViewsToRemove.push(cw);
      }
    });
    charactersViewsToRemove.forEach(cw => {
      this._charactersViews.splice(this._charactersViews.indexOf(cw), 1);
      this._stage.removeChild(cw);
    });

    // create characters views
    this._arena.characters.forEach(c => {
      if (!this._charactersViews.find(cw => cw.model === c)) {
        this._trackCharacterView(this._createViewOf(c));
      }
    });

    // update character views
    this._charactersViews.forEach(cv => cv.updateView());
  }

  _createViewOf(item) {
    let view = null;
    if (item instanceof Character) {
      view = new CharacterView(this._spritesheets[spritesheets.CHARACTER].animations, item);
    } else if (item instanceof Wall) {
      view = new WallView(this._textures[textures.WALL], item);
    } else if (item instanceof ArenaSection) {
      view = new ArenaSectionView(this._textures[textures.ARENA_SECTION], item);
    } else if (item instanceof Bomb) {
      view = new BombView(this._textures[textures.BOMB], item);
    } else if (item instanceof Explosion) {
      view = new ExplosionView(this._spritesheets[spritesheets.EXPLOSION].animations.default, item);
    }
    return view;
  }

  _trackView(view) {
    this._views.push(view);
    this._stage.addChild(view);
  }

  _trackCharacterView(view) {
    this._charactersViews.push(view);
    this._stage.addChild(view);
  }
}