import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { NewIOBStateStore, NewIOBStateState } from './new-iobstate.store';

/** used to query the NewIoBStateStore */
@Injectable({ providedIn: 'root' })
export class NewIOBStateQuery extends QueryEntity<NewIOBStateState> {

  /** @ignore */
  constructor(protected store: NewIOBStateStore) {
    super(store);
  }

}
