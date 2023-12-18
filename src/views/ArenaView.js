import { Sprite } from "pixi.js";

export default class ArenaView {
  constructor(arena, groundTexture, stage) {
    this.arena = arena;
    this.groundTexture = groundTexture;
    this.CELL_SIZE = 60;
    this.stage = stage;
  }

  renderGround() {
    for (let row = 0; row < this.arena.rowsCount; row++) {
      for (let col = 0; col < this.arena.colsCount; col++) {
        const groundSprite = new Sprite(this.groundTexture);
        groundSprite.x = col * this.CELL_SIZE;
        groundSprite.y = row * this.CELL_SIZE;
        this.stage.addChild(groundSprite);
      }
    }
  }
}