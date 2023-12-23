import { Sprite } from "pixi.js";
import { CELL_SIZE } from "../constants/constants";

export default class ArenaView {
  constructor(arena, groundTexture, stage) {
    this.arena = arena;
    this.groundTexture = groundTexture;
    this.stage = stage;
  }

  renderGround() {
    for (let row = 0; row < this.arena.rowsCount; row++) {
      for (let col = 0; col < this.arena.colsCount; col++) {
        const groundSprite = new Sprite(this.groundTexture);
        groundSprite.x = col * CELL_SIZE;
        groundSprite.y = row * CELL_SIZE;
        this.stage.addChild(groundSprite);
      }
    }
  }
}