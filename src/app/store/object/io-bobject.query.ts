import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoBObjectStore, IoBObjectState } from './io-bobject.store';
import { from, Observable } from 'rxjs';
import { IoBObject } from './io-bobject.model';

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

  public getAllChildrenIDsByParentID(id:string): Array<string>{
    return this.getAll({
      filterBy: entity => entity._id.startsWith(id + '.')
    }).map(e => e._id);
  }

  public getDirectChildrenIDsByParentID(id:string): Array<string>{
    const pointCounter = id.split('.').length;
    return this.getAllChildrenIDsByParentID(id).filter(e => e.split('.').length - 1 === pointCounter);
  }

  getBrothersIDsByParentID(id:string): Array<string>{
    return this.getDirectChildrenIDsByParentID(id.substr(0, id.lastIndexOf(".")))
  }

}
