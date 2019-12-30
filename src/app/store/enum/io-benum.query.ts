import { Injectable } from '@angular/core';
import { QueryEntity, EntityActions } from '@datorama/akita';
import { IoBEnumStore, IoBEnumState } from './io-benum.store';
import { Observable } from 'rxjs';
import { IoBEnum } from './io-benum.model';

/** to query the ioBEnum Store */
@Injectable({ providedIn: 'root' })
export class IoBEnumQuery extends QueryEntity<IoBEnumState> {

  /** @ignore */
  constructor(protected store: IoBEnumStore) {
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
  public selectDeviceIDByFunctionalEnum(functionalEnum:string){
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
  public selectNameByID (id:string) : Observable<string | object>{
    return this.selectEntity(id, entity => entity.common.name)
  }

  /** select first roomName enum where the object id belongs to */
  public selectRoomNameFromObjectID(objectID: string) : Observable<string | object>{
    return this.selectEntity(entity => {
      if(entity.id.startsWith('enum.rooms.')){
        for(let member of entity.common.allMembers){
          if(objectID.startsWith(member)){
            return true;
          }
        }
      }
      return false;
    }, entity => entity.common.name)
  }

  /** select first floorName enum where the object id belongs to */
  public selectFloorNameFromObjectID(objectID: string) : Observable<string | object>{
    return this.selectEntity(entity => {
      if(entity.id.startsWith('enum.floor.')){
        for(let member of entity.common.allMembers){
          if(objectID.startsWith(member)){
            return true;
          }
        }
      }
      return false;
    }, entity => entity.common.name)
  }

  /** select first floorID enum where the object id belongs to */
  public selectFloorIDFromObjectID(objectID: string) : Observable<string>{
    return this.selectEntity(entity => {
      if(entity.id.startsWith('enum.floor.')){
        for(let member of entity.common.allMembers){
          if(objectID.startsWith(member)){
            return true;
          }
        }
      }
      return false;
    }, entity => entity.id)
  }

}
