import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoBObjectStore, IoBObjectState } from './io-bobject.store';
import { from, Observable } from 'rxjs';

/** to query the ioBObject Store */
@Injectable({ providedIn: 'root' })
export class IoBObjectQuery extends QueryEntity<IoBObjectState> {

  /** @ignore */
  constructor(protected store: IoBObjectStore) {
    super(store);
  }

  /** select the name Obserbable by id */
  public selectNameByID (id:string) : Observable<string | object>{
    return this.selectEntity(id, entity => entity.common.name)
  }

  public getWritableByID (id:string): boolean {
    return this.getEntity(id).common.write;
  }

}
