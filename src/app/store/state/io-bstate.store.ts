import { Injectable } from '@angular/core';
import { IoBState } from './io-bstate.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/** IOBState state */
export interface IoBStateState extends EntityState<IoBState> {}

/** stores all the states from ioBroker --> used mainly from StateObject and not be used directly from the components */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ioBstate' })
export class IoBStateStore extends EntityStore<IoBStateState> {

  /** @ignore */
  constructor() {
    super();
  }

}

