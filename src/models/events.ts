/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Model } from "./main";
import {
  AfterQueryEvent,
  BeforeQueryEvent,
} from "typeorm/subscriber/event/QueryEvent";

@EventSubscriber()
export class ModelSubscriber implements EntitySubscriberInterface<Model> {
  // Indicates that this subscriber only listens to Model events.
  listenTo() {
    return Model;
  }

  async afterLoad(entity: Model) {
    // Code to execute after the entity is loaded
    console.log(`Model with ID ${entity} has been loaded.`);
  }

  afterQuery(event: AfterQueryEvent<Model>): void {}
  async afterInsert(event: InsertEvent<Model>) {
    // Code to execute after an entity is inserted
    console.log(`Model with ID ${event.entity} has been inserted.`);
  }

  async afterUpdate(event: UpdateEvent<Model>) {
    // Code to execute after an entity is updated
    // console.log(`Model with ID ${event.entity.id} has been updated.`);
  }

  async afterRemove(event: RemoveEvent<Model>) {
    // Code to execute after an entity is removed
    // console.log(`Model with ID ${event.entity.id} has been removed.`);
  }
}
