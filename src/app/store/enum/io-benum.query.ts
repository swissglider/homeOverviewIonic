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

  /** gets all the enums used on the ioBroker */
  public getEnums$() {
    return this.selectAll({
      asObject: true,
      filterBy: entity => entity && '_id' in entity && entity._id.includes('enum.')
    });
  }

  /** get all members */
  public getMembersPerEntity(id) {
    return this.getEntity(id).common.members;
  }

  /** Returns all Device ID's as observers that fits the functional requirements */
  public selectDeviceIDByFunctionalEnum(functionalEnum: string) {
    return this.selectEntity(functionalEnum, entity => entity.common.allMembers);
  }

  public getAllMembersPerEnumID(objectID: string): Observable<string[]> {
    return this.selectEntity(objectID, entity => entity.common.members);
  }

  /** get all Device ID's as observers */
  public selectEnumsID(): Observable<any[]> {
    return new Observable(observer => {
      this.selectEntityAction(EntityActions.Add).subscribe(iDS => {
        observer.next(iDS);
      });
      this.selectEntityAction(EntityActions.Set).subscribe(iDS => {
        observer.next(iDS);
      });
      this.selectEntityAction(EntityActions.Remove).subscribe(iDS => {
        observer.next(iDS);
      });
    });
  }

  /** select the name Obserbable by id */
  public selectNameByID(id: string): Observable<string | object> {
    return this.selectEntity(id, entity => entity.common.name)
  }

  /** select first roomName enum where the object id belongs to */
  public selectRoomNameFromObjectID(objectID: string): Observable<string | object> {
    return this.selectEntity(entity => {
      if (entity.id.startsWith('enum.rooms.')) {
        for (let member of entity.common.allMembers) {
          if (objectID.startsWith(member)) {
            return true;
          }
        }
      }
      return false;
    }, entity => entity.common.name)
  }

  /** select first floorName enum where the object id belongs to */
  public selectFloorNameFromObjectID(objectID: string): Observable<string | object> {
    return this.selectEntity(entity => {
      if (entity.id.startsWith('enum.floor.')) {
        for (let member of entity.common.allMembers) {
          if (objectID.startsWith(member)) {
            return true;
          }
        }
      }
      return false;
    }, entity => entity.common.name)
  }

  /** select first floorID enum where the object id belongs to */
  public selectFloorIDFromObjectID(objectID: string): Observable<string> {
    return this.selectEntity(entity => {
      if (entity.id.startsWith('enum.floor.')) {
        for (let member of entity.common.allMembers) {
          if (objectID.startsWith(member)) {
            return true;
          }
        }
      }
      return false;
    }, entity => entity.id)
  }

  /** select all pairObserver from an parentID with filter => used in functions.page ! */
  public selectAllPairsPerParentIDWithFilter(parentID: string, filterIds: string[]): PairObserver {
    return this.selectAll({ filterBy: entity => entity.id.startsWith(parentID + '.') }).pipe(map((enumArr: IoBEnum[]) =>
      enumArr.filter(enu => filterIds.includes(enu.id)).map((enu) => {
        // console.log(enu)
        return {
          id: enu.id,
          name: enu.common.name,
          members: enu.common.members.filter(entity => entity.startsWith('enum.')),
          allMembers: enu.common.allMembers,
        }
      })
    ))
  }



  /** select all Floors returned as observer pairs of { id: string; name: string | object; members: string[]}[] => used in functions.page*/
  public selectAllFloorPairs(): PairObserver {
    return this.selectAll({ filterBy: entity => entity.id.startsWith('enum.floor.') }).pipe(map((enumArr: IoBEnum[]) =>
      enumArr.map((enu) => {
        return {
          id: enu.id,
          name: enu.common.name,
          members: enu.common.members.filter(entity => entity.startsWith('enum.')),
          allMembers: enu.common.allMembers,
        };
      })
    ));
  }

  /** select all Rooms/perFloorMembers returned as observer pairs of { id: string; name: string | object; members: string[] }[] => used in functions.page*/
  public selectAllRoomPairsPerFloor(floorMembersIDs: string[]): PairObserver {
    return this.selectMany(floorMembersIDs).pipe(map((enumArr: IoBEnum[]) =>
      enumArr.filter((enu: IoBEnum) => enu.id.startsWith('enum.rooms.')).map((enu: IoBEnum) => {
        return {
          id: enu.id,
          name: enu.common.name,
          members: enu.common.members,
          allMembers: enu.common.allMembers,
        };
      })
    ));
  }

  /** select observer Array of stateID that are member of a function from an given Array of IDS => used in functions.page ! */
  public selectAllStateIDsWithinAFunction(stateIDsToCheck: string[], functionID: string): Observable<string[]> {
    return this.selectEntity(functionID).pipe(map((enu: IoBEnum) => enu.common.members.filter(element => {
      for (let id of stateIDsToCheck) {
        if (element.startsWith(id)) {
          return true;
        }
      }
    }
    )))
  }

  public getAllDevicePairsRecursivePerFilter(parentID: string, functionsID: string[]): PairObserver {
    let functionDeviceIDs = this.getAll({ filterBy: entity => functionsID.includes(entity.id) }).reduce((acc, cur) => acc.concat(cur.common.members), []);
    console.log(functionDeviceIDs);

    return null;
  }

  /** select all Functions returned as observer pairs of { id: string; name: string | object; members: string[] }[] => used in functions.page*/
  public selectAllFunctionPairs(): Observable<{ id: string; name: string | object; members: string[] }[]> {
    return this.selectAll({ filterBy: entity => entity.id.startsWith('enum.functions.') }).pipe(map((enumArr: IoBEnum[]) =>
      enumArr.map((enu) => {
        return {
          id: enu.id,
          name: enu.common.name,
          members: enu.common.members,
        };
      })
    ));
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

  /** get all root domain enum ids */
  public getAllRootDomainEnumIDS(): string[] {
    return this.getAll({ filterBy: entity => (entity.id.match(/\./g) || []).length === 1 }).map(e => e.id);
  }

}
