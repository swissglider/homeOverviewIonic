import { Injectable } from '@angular/core';
import { IoBObject } from './io-bobject.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/** IOBObject state */
export interface IoBObjectState extends EntityState<IoBObject> {}

/**
 * Represents all the ioBObjects
 * mainly used for ObjectState creation
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ioBobject', idKey: '_id' })
export class IoBObjectStore extends EntityStore<IoBObjectState> {

  /** @ignore */
  constructor() {
    super();
  }

}

