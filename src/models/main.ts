import { BaseEntity, RemoveOptions, SaveOptions } from "typeorm";

export abstract class Model extends BaseEntity {
  async delete(options?: RemoveOptions) {
    this.remove(options);
  }

  async softDelete(options: SaveOptions) {
    this.softRemove(options);
  }
}
