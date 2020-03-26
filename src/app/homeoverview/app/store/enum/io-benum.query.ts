import { Injectable } from '@angular/core';
import { QueryEntity, EntityActions } from '@datorama/akita';
import { IoBEnumStore, IoBEnumState } from './io-benum.store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IoBEnum } from './io-benum.model';
import { IoBObjectQuery } from '../object/io-bobject.query';
import { measureTime, wholeClassMeasureTime } from 'src/app/homeoverview/_global/decorator/timeMeasure.decorator';

type PairObserver = Observable<{ id: string; name: string | object; members: string[]; allMembers: string[] }[]>

/** to query the ioBEnum Store */
@Injectable({ providedIn: 'root' })
@wholeClassMeasureTime({print:false})
export class IoBEnumQuery extends QueryEntity<IoBEnumState> {

  /** @ignore */
  constructor(
    protected store: IoBEnumStore,
    private objectQuery: IoBObjectQuery,
  ) {
    super(store);
  }

  /** get all states id from all enum Subdomains and members */
  public getAllStatesRecursiveFromEnumID(id: string): string[] {
    let returnArray: string[] = [];
    //members
    if ((id.match(/\./g) || []).length > 1) {
      returnArray = this.getAllStatesRecursiveFromEnumIDIfSubEnumDomain(id);
    }
    //subDomains
    if ((id.match(/\./g) || []).length === 1) {
      returnArray = this.getAllStatesRecursiveFromEnumIDIfMainEnumDomain(id);
    }

    return returnArray;
  }

  private getAllStatesRecursiveFromEnumIDIfSubEnumDomain(id: string): string[] {
    let returnArray: string[] = [];
    if (this.hasEntity(id)) {
      let levelEntity: IoBEnum = this.getEntity(id);
      if ('common' in levelEntity && 'members' in levelEntity.common && Array.isArray(levelEntity.common.members) && levelEntity.common.members.length > 0) {
        let step: number;
        let tmpMembers = this.getEntity(id).common.members;
        for(step = 0; step < tmpMembers.length; step++){
          let mID = tmpMembers[step];
          if (mID.startsWith('enum.')) {
            returnArray = returnArray.concat(this.getAllStatesRecursiveFromEnumID(mID));
          } else {
            returnArray = returnArray.concat(this.objectQuery.getAllStatesIDWithinParentID(mID));
          }
        }
      }
    }
    return returnArray
  }

  private getAllStatesRecursiveFromEnumIDIfMainEnumDomain(id: string): string[] {
    let returnArray: string[] = [];
    let all = this.getAll();
    for (let step = 0; step < all.length; step++){
      let tmpEnum: IoBEnum = all[step];
      if(tmpEnum.id.startsWith(id + '.') ){
        returnArray = returnArray.concat(this.getAllStatesRecursiveFromEnumID(tmpEnum.id));
      }
    }
    return returnArray;
  }
}
