import Entity from "./entity";

export default class EntityManager extends Entity {
  entityList: Entity[] = [];

  constructor() {
    super();
  }

  add(entity: Entity) {
    this.entityList.push(entity);
  }

  init(scene: Phaser.Scene) {
    this.entityList.forEach((entity) => entity.init(scene));
  }
  preload(scene: Phaser.Scene) {
    this.entityList.forEach((entity) => entity.preload(scene));
  }
  create(scene: Phaser.Scene) {
    this.entityList.forEach((entity) => entity.create(scene));
  }
  update(scene: Phaser.Scene) {
    this.entityList.forEach((entity) => entity.update(scene));
  }
}
