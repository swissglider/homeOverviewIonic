import { Injectable } from '@angular/core';
import { NewIOBState } from './new-iobstate.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IoBObjectQuery } from '../object/io-bobject.query';

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
  constructor(
    private objectQuery: IoBObjectQuery
  ) {
    super();
  }

  public functionToggle(ids: Array<string>, state) {
    ids.forEach((id: string) => {
        try {
            if(this.objectQuery.getEntity(id).common.write){
                this.upsert(id, {
                    val: state,
                    id: id,
                });
            }
        } catch (error) {
            console.log(id)
            console.log('error')
        }
        
    })
}

}

