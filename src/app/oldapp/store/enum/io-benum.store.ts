import { Injectable } from '@angular/core';
import { IoBEnum } from './io-benum.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/** IOBEnum state */
export interface IoBEnumState extends EntityState<IoBEnum> {}

/**
 * Represents all the ioBEnum
 * mainly used for ObjectState creation
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ioBobject', idKey: '_id' })
export class IoBEnumStore extends EntityStore<IoBEnumState> {

  /** @ignore */
  constructor() {
    super();
  }

}

