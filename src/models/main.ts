/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { empty } from "../utils";
import { AnyObject } from "../interface";
import { modelDirtyProxy } from "./proxy/dirty";

interface ModelCreateOption {
  fillOnly?: boolean;
  preventSilentlyDiscardingAttributes?: boolean;
}

export abstract class Model extends BaseEntity {
  constructor() {
    super();
    return this.applyProxy();
  }

  private changedAttributes: string[] = [];
  private originalValuesChanged: AnyObject = {};
  private freshEntity?: boolean = true;
  private excludedAttributes: string[] = [
    "originalValuesChanged",
    "changedAttributes",
    "fillable",
    "guard",
  ];
  private devHiddenFields: string[] = [
    "newEntity",
    "excludedAttributes",
    "originalValuesChanged",
    "changedAttributes",
    "fillable",
    "guard",
    "hiddenFields",
    "devHiddenFields",
  ];

  abstract id: number | string;

  static queryBuilder(alias: string) {
    // `this` here refers to the constructor of the class (e.g., Model or its subclasses)
    return BaseEntity.getRepository().createQueryBuilder(alias);
  }

  protected fillable: string[];
  protected guard: string[] = [];
  protected hiddenFields: string[] = [];

  @BeforeInsert()
  async beforeInsert() {}

  @BeforeUpdate()
  async beforeUpdate() {}

  @AfterLoad()
  async afterLoad() {
    this.applyHiddenFields();
    this.resetChanges();
  }

  @AfterUpdate()
  async afterUpdate() {
    this.resetChanges();
  }

  @AfterInsert()
  async afterInsert() {
    this.resetChanges();
  }

  isClean(): boolean;
  isClean<K extends keyof this>(attribute: K): boolean;
  isClean<K extends keyof this>(attribute: K[]): boolean;

  isClean<K extends keyof this>(attribute?: K | K[]): boolean {
    return !this.isDirty(attribute as any);
  }

  isDirty(): boolean;
  isDirty<K extends keyof this>(attribute: K): boolean;
  isDirty<K extends keyof this>(attribute: K[]): boolean;

  isDirty<K extends keyof this>(attribute?: K | K[]): boolean {
    if (this.changedAttributes == undefined) return false;
    if (attribute == undefined) {
      return this.changedAttributes.length > 0;
    }

    if (empty(this.changedAttributes)) {
      return false;
    }

    if (Array.isArray(attribute)) {
      if (attribute.length === 0) {
        return this.changedAttributes.length > 0;
      }

      return this.changedAttributes.some((attr) =>
        (attribute as string[]).includes(attr as string)
      );
    }

    return this.changedAttributes.includes(attribute as string);
  }

  getOriginalValues(): this {
    return { ...this, ...this.originalValuesChanged };
  }

  private resetChanges() {
    delete this.freshEntity;
    this.changedAttributes = [];
    this.originalValuesChanged = {};
  }

  private applyProxy() {
    return modelDirtyProxy(this, this.trackChanges.bind(this));
  }

  private usingFillableAndGuard() {
    return !empty(this.fillable) || !empty(this.guard);
  }

  private trackChanges(key: keyof this, oldValue: any) {
    if (this.freshEntity === true) return;
    if (this.excludedAttributes.includes(key as string)) {
      return;
    }

    if (!this.changedAttributes.includes(key as string)) {
      this.originalValuesChanged[key as string] = oldValue;
      this.changedAttributes.push(key as string);
    }
  }

  applyHiddenFields() {
    for (const field of [...this.hiddenFields]) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(field)) {
        delete (this as any)[field];
      }
    }
  }

  create(attributes: Partial<this>, option?: ModelCreateOption) {
    // if (this.usingFillableAndGuard()) {
    // const fillable = this.fillable;
    // const guard = this.guard;

    for (const key in attributes) {
      const oldValue = (this as any)[key];
      if (oldValue == attributes[key]) continue;
      // if (
      //   fillable.length > 0 &&
      //   !fillable.includes(key) &&
      //   !guard.includes(key)
      // ) {
      //   continue;
      // }

      // if (guard.includes(key)) {
      //   continue;
      // }

      (this as any)[key] = attributes[key];
    }
    // }
    if (option?.fillOnly == true) {
      return this;
    }
    this.save();
  }
  fill(attributes: Partial<this>, option?: ModelCreateOption) {
    option = { fillOnly: true, ...option };
    this.create(attributes, option);
  }
}
