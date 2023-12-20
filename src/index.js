/*
- [x] Засетапить проект, убрав из него оконный менеджер, сетевой контроллер и
прочий ненужный щлак.
- [] Сделать по-умному загрузку ассетов (у пикси вроде есть апишка, которая 
позволяет загрузить ресурсы пачкой, а не по-одному).
- [] Пройтись по проекту и найти места для рефакторинга и просто небольшие 
недочёты, которые неплохо было бы исправить (то, что нужно исправить, 
записывать сюда как задачи).
*/

import { Application } from 'pixi.js';
import { CELL_SIZE, actionKeys1, movementKeys1, actionKeys2, movementKeys2 } from './constants/constants.js';
import ResourcesManager from './resources/ResourcesManager.js';
import Arena from './entities/arena/Arena.js';
import Character from './entities/character/Character.js';
import CharacterController from './input/CharacterController.js';
import AICharacterController from './input/AICHaracterController.js';
import ViewsController from './views/ViewsController.js';
import ArenaView from './views/ArenaView.js'

async function start() {
  const resources = new ResourcesManager();
  await resources.load();

  const app = new Application({ width: 1000, height: 800 });
  document.body.appendChild(app.view);

  const arena = new Arena(11, 15);

  const character = new Character(0, 0, arena, 2000);
  // const character2 = new Character(14 * CELL_SIZE, 0, arena, 2000);
  new CharacterController(character, movementKeys1, actionKeys1);
  // new CharacterController(character2, movementKeys2, actionKeys2);
  arena.addCharacter(character);
  // arena.addCharacter(character2);
  const aiCharacter = new Character(0, 10 * CELL_SIZE, arena, 2000);
  const aiCharacterController = new AICharacterController(aiCharacter, arena);
  arena.addCharacter(aiCharacter);
  const aiCharacter2 = new Character(14 * CELL_SIZE, 0, arena, 2000);
  const aiCharacterController2 = new AICharacterController(aiCharacter2, arena);
  arena.addCharacter(aiCharacter2);
  const aiCharacter3 = new Character(14 * CELL_SIZE, 10 * CELL_SIZE, arena, 2000);
  const aiCharacterController3 = new AICharacterController(aiCharacter3, arena);
  arena.addCharacter(aiCharacter3);

  const arenaView = new ArenaView(arena, resources.getTexture('ground'), app.stage);
  arenaView.renderGround();
  const viewsController = new ViewsController(
    arena,
    resources.getSpritesheet('explosion').animations.default,
    resources.getSpritesheet('character').animations,
    resources.getTexture('arenaSection'),
    resources.getTexture('wall'),
    resources.getTexture('bomb'),
    app.stage
  );
  app.ticker.add(() => {
    arena.update();
    aiCharacterController.update();
    aiCharacterController2.update();
    aiCharacterController3.update();
    viewsController.update();
  })
}

window.onload = start;