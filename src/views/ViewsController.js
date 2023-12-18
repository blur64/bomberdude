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

export default class ViewsController {
  constructor(arena, explosionTextures, characterAnimations, arenaSectionTexture, wallTexture, bombTexture, stage) {
    this.views = [];
    this.arena = arena;
    this.explosionTextures = explosionTextures;
    this.arenaSectionTexture = arenaSectionTexture;
    this.wallTexture = wallTexture;
    this.bombTexture = bombTexture;
    this.characterAnimations = characterAnimations;
    this.stage = stage;
    this.charactersViews = [];
  }

  update() {
    this.arena.items.flat().forEach(i => {
      if (!i) {
        return;
      }
      if (!this.views.find(v => v.model === i)) {
        this._trackView(this._createViewOf(i));
      }
    });
    this.views.forEach(v => this.arena.isItemExist(v.model) ?
      null : this.stage.removeChild(v));
    this.views.forEach(v => v.updateView());

    const charactersViewsToRemove = [];
    this.charactersViews.forEach(cw => {
      if (this.arena.isCharacterDead(cw.model)) {
        charactersViewsToRemove.push(cw);
      }
    });
    charactersViewsToRemove.forEach(cw => {
      this.charactersViews.splice(this.charactersViews.indexOf(cw), 1);
      this.stage.removeChild(cw);
    });
    this.arena.characters.forEach(c => {
      if (!this.charactersViews.find(cw => cw.model === c)) {
        this._trackCharacterView(this._createViewOf(c));
      }
    });
    this.charactersViews.forEach(cv => cv.updateView());
  }

  _createViewOf(item) {
    let view = null;

    if (item instanceof Character) {
      view = new CharacterView(this.characterAnimations, item, 2000);
    } else if (item instanceof Wall) {
      view = new WallView(this.wallTexture, item);
    } else if (item instanceof ArenaSection) {
      view = new ArenaSectionView(this.arenaSectionTexture, item);
    } else if (item instanceof Bomb) {
      view = new BombView(this.bombTexture, item);
    } else if (item instanceof Explosion) {
      view = new ExplosionView(this.explosionTextures, item);
    }

    return view;
  }

  _trackView(view) {
    this.views.push(view);
    this.stage.addChild(view);
  }

  _trackCharacterView(view) {
    this.charactersViews.push(view);
    this.stage.addChild(view);
  }
}