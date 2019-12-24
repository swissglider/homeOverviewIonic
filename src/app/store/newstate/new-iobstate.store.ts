import { Injectable } from '@angular/core';
import { NewIOBState } from './new-iobstate.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/** NewIOB State */
export interface NewIOBStateState extends EntityState<NewIOBState> {}

/**
 * the NewIOBStateStore is used to update a value on ioBroker.
 * This is the way to change and state/value on the ioBroker
 * and should be only used from the components
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'newioBstate' })
export class NewIOBStateStore extends EntityStore<NewIOBStateState> {

  /** @ignore */
  constructor() {
    super();
  }

}

