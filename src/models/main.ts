import { BaseEntity } from "typeorm";

export abstract class Model extends BaseEntity {
  static queryBuilder(alias: string) {
    // `this` here refers to the constructor of the class (e.g., Model or its subclasses)
    return BaseEntity.getRepository().createQueryBuilder(alias);
  }
}
