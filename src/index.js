/*
- [] Засетапить проект, убрав из него оконный менеджер, сетевой контроллер и
прочий ненужный щлак.
- [] Сделать по-умному загрузку ассетов (у пикси вроде есть апишка, которая 
позволяет загрузить ресурсы пачкой, а не по-одному).
- [] Пройтись по проекту и найти места для рефакторинга и просто небольшие 
недочёты, которые неплохо было бы исправить (то, что нужно исправить, 
записывать сюда как задачи).
*/
import { Application } from 'pixi.js';
import { actionKeys1, movementKeys1 } from './constants/constants.js';
import ResourcesManager from './resources/ResourcesManager.js';
import Arena from './entities/arena/Arena.js';
import Character from './entities/character/Character.js';
import CharacterController from './input/CharacterController.js';
import ViewsController from './views/ViewsController.js';
import ArenaView from './views/ArenaView.js'

async function start() {
  const resources = new ResourcesManager();
  await resources.load();

  const app = new Application({ resizeTo: window });
  document.body.appendChild(app.view);

  const arena = new Arena(11, 15);
  const character = new Character(0, 0, arena, 2000);
  new CharacterController(character, movementKeys1, actionKeys1);
  arena.addCharacter(character);

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
    viewsController.update();
  })
}

window.onload = start;