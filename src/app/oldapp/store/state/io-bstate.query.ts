import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoBStateStore, IoBStateState } from './io-bstate.store';
import { Observable } from 'rxjs';

/** to query the ioBState store --> mainly used from StateObject and should not be used directly in the components */
@Injectable({ providedIn: 'root' })
export class IoBStateQuery extends QueryEntity<IoBStateState> {

  /** @ignore */
  constructor(protected store: IoBStateStore) {
    super(store);
  }

  /** select the state of device per id */
  public selectStateByID (id:string) : Observable<number | string | boolean | object>{
    return this.selectEntity(id, entity => entity.val)
  }

}
