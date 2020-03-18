import { Injectable } from '@angular/core';
import { QueryEntity, EntityActions } from '@datorama/akita';
import { IoBEnumStore, IoBEnumState } from './io-benum.store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IoBEnum } from './io-benum.model';
import { IoBObjectQuery } from '../object/io-bobject.query';

type PairObserver = Observable<{ id: string; name: string | object; members: string[]; allMembers: string[] }[]>

/** to query the ioBEnum Store */
@Injectable({ providedIn: 'root' })
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
    if ((id.match(/\./g) || []).length >= 1) {
      if (this.hasEntity(id)) {
        let levelEntity: IoBEnum = this.getEntity(id);
        if ('common' in levelEntity && 'members' in levelEntity.common && Array.isArray(levelEntity.common.members) && levelEntity.common.members.length > 0) {
          this.getEntity(id).common.members.forEach(mID => {
            if (mID.startsWith('enum.')) {
              returnArray.push(...this.getAllStatesRecursiveFromEnumID(mID));
            } else {
              returnArray.push(...this.objectQuery.getAllStatesIDWithinParentID(mID));
            }
          });
        }
      }
    }
    //subDomains
    if ((id.match(/\./g) || []).length === 1) {
      this.getAll({ filterBy: entity => entity.id.startsWith(id + '.') })
        .reduce((acc, entity) => {
          acc.push(...this.getAllStatesRecursiveFromEnumID(entity.id));
          return acc;
        }, returnArray);
    }

    return returnArray;
  }
}
