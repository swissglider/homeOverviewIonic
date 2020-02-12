import { Injector, Injectable } from "@angular/core";
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { IoBObject } from 'src/app/store/object/io-bobject.model';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';
import { Observable, Subject } from 'rxjs';
import { EntityActions } from '@datorama/akita';
import { isArray } from 'util';
import { filter } from 'rxjs/operators';
import { identifierModuleUrl } from '@angular/compiler';
import { IInputLevelObject, ILevelStruct } from './level.struct.model';


export class ServiceLocator {
    static injector: Injector;
}



/**
 * 
 * 
 * HowTo use it:
 * 
 * try {
 *  let ls = new LevelStruct(levelStruct);
 *  ls.selectLevelStruct().subscribe((e: ILevelStruct) => {
 *      console.log(e)
 *  })
 * } catch(e){
 *  console.log(e)
 * }
 * 
 * 
 */
// export class LevelStruct {

//     private enumQuery: IoBEnumQuery;
//     private objectQuery: IoBObjectQuery;
//     private observable: Subject<ILevelStruct>;


//     constructor(
//         private levelStruct: ILevelStruct,
//     ) {
//         this.enumQuery = ServiceLocator.injector.get(IoBEnumQuery);
//         this.objectQuery = ServiceLocator.injector.get(IoBObjectQuery);
//         this.observable = new Subject<ILevelStruct>();
//         try {
//             this.checkLevelStruct(this.levelStruct);
//             this.observable.next(this.levelStruct);
//         } catch (e) {
//             throw 'The following error occured while checking the levelStruct: ' + e;
//         }
//         try {
//             this.generateElementStates(this.levelStruct);
//         } catch (e) {
//             throw 'The following error occured while checking the LevelStruct: ' + e;
//         }
//     }

//     /**
//      * Select the LevelStruct Observable
//      */
//     public selectLevelStruct(): Observable<ILevelStruct> {
//         return this.observable;
//     }

//     /** 
//      * checks if the LevelStruct follows the rules (descrbed above), if not it throws an error. 
//      * 
//      */
//     private checkLevelStruct(levelStruct: ILevelStruct) {
//         if ('subLevels' in levelStruct) {
//             levelStruct.subLevels.forEach((subLevel: ILevelStruct) => {
//                 if (!this.checkIfSubLevelIsInLevel(levelStruct.id, subLevel.id)) {
//                     throw `${subLevel.id} is not included in any enumSubDomain or Members from ${levelStruct.id}`
//                 }
//                 this.checkLevelStruct(subLevel);
//             });
//         }
//     }

//     /** checks if an subLevel is in the Level (enumSubDomain/members) */
//     private checkIfSubLevelIsInLevel(levelID: string, subLevelID: string): boolean {
//         if (subLevelID === 'all') {
//             return true;
//         }
//         let levelEntity: IoBEnum | IoBObject;
//         let subDomains: IoBEnum[] | IoBObject[];
//         if (this.enumQuery.hasEntity(levelID)) {
//             levelEntity = this.enumQuery.getEntity(levelID);
//             subDomains = this.enumQuery.getAll(({ filterBy: entity => entity.id.startsWith(levelID + '.') }))
//         } else if (this.objectQuery.hasEntity(levelID)) {
//             levelEntity = this.objectQuery.getEntity(levelID);
//             subDomains = this.objectQuery.getAll(({ filterBy: entity => entity.id.startsWith(levelID + '.') }))
//         } else {
//             return false;
//         }

//         if (levelEntity && 'common' in levelEntity && 'members' in levelEntity.common) {
//             // check if subLevelID is in a member
//             if (levelEntity.common.members.includes(subLevelID)) {
//                 return true;
//             }
//             // check if subLevelID is in a members enumSubDomain/members
//             if (levelEntity.common.members.some(e => this.checkIfSubLevelIsInLevel(e, subLevelID))) {
//                 return true;
//             }
//         }
//         if (subDomains && subDomains.length > 0) {
//             // check if subLevelID is a enumSubDomain
//             if (subDomains.some((e: IoBEnum | IoBObject) => e.id === subLevelID || e._id === subLevelID)) {
//                 return true;
//             }
//             // check if subLevelID is in a members enumSubDomain/members
//             if (subDomains.some((e: IoBEnum | IoBObject) => this.checkIfSubLevelIsInLevel(e.id, subLevelID))) {
//                 return true
//             }
//         }
//         return false;
//     }

//     private generateElementStates(levelStruct: ILevelStruct) {
//         // ==> ToDo
//     }
// }

/**
 * Creates an empty/base IInputLevelStruct to be used for example in a Form to select the Levels
 * Creates an IInputLevelStruct from HTML Input values
 * Creates an ILevelStruct from a IInputLevelStruct
 */
@Injectable({
    providedIn: 'root'
})
export class LevelStructService {
    constructor(
        private enumQuery: IoBEnumQuery,
        private objectQuery: IoBObjectQuery,
    ) { }

    transformLevelObjectToLevelStruct(levelObject: IInputLevelObject) : ILevelStruct {
        return null;
    }
}
