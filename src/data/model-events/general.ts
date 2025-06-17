/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntitySubscriberInterface, EventSubscriber } from "typeorm";
import { AnyObject } from "../../interface";
import { empty } from "../../utils";

@EventSubscriber()
export class GeneralSubscriber implements EntitySubscriberInterface {
  /**
   * Indicates that this subscriber only listen to Post events.
   */
  // listenTo() {
  //   return Users;
  // }

  private model: any;

  /**
   * Called before post insertion.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterLoad(entity: any) {
    // Example: Construct full name after loading
    this.updateDisplayFields(entity);
    // console.log(entity);
  }

  private updateDisplayFields(data: any) {
    // const displayFields: AnyObject = this.model?.displayFields;
    // if (empty(displayFields)) return;
    // for (const field in displayFields) {
    //   this.model[field] = displayFields[this.model](data);
    // }
  }
}
