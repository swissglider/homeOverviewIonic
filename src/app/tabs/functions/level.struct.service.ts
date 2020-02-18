import { Injector, Injectable } from "@angular/core";
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { IoBObject } from 'src/app/store/object/io-bobject.model';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { isArray } from 'util';
import { IInputLevelObject, ILevelStruct, levelIDCases, ElementStates } from './level.struct.model';


export class ServiceLocator {
    static injector: Injector;
}

export enum levelIDType {
    noneType = 0,
    enumType = 1,
    objectType = 2,
    stringType = 3, // levelIDCases
}

class LevelStruct implements ILevelStruct {
    id: string;
    level: number;
    members: { [key: string]: ILevelStruct };
    elementStates: ElementStates;
    protected allFittingStates: string[];
    private valueSectionStates: {
        states?: string[]
        subStates?: {
            [key: string]: string[]
        }
    } = {}


    constructor(
        private lo: IInputLevelObject,
        private valueSelectionID: string,
        private valueSelectionFilters: string[],
        private levelStructService: LevelStructService,
        private parentLS: ILevelStruct,
        private parentMemberID: string,
        valueSelectionStates?: {},
    ) {
        if (!valueSelectionStates) {
            this.valueSectionStates = null;
        } else {
            this.valueSectionStates = valueSelectionStates;
        }
        this.init();
    }

    public setNewInputLevelObject(lo: IInputLevelObject) {
        this.lo = lo;
        this.init();
    }

    public setNewValueSelection(valueSelectionID: string, valueSelectionFilters: string[]) {
        this.valueSelectionID = valueSelectionID;
        this.valueSelectionFilters = this.valueSelectionFilters;
        this.valueSectionStates = null;
        this.init();
    }

    private init() {
        if (!this.lo || !this.lo.id) {
            this.lo = { id: 'all' }
        }
        this.id = this.lo.id;

        this.members = {};
        this.level = (this.parentLS) ? this.parentLS.level + 1 : 0;

        if (this.parentLS == null) {
            // all states fitting valueSelecetedID or valueSelectedFilters if parent is null
            let allFittingValueSelectedStates = []
            if (this.valueSelectionFilters && isArray(this.valueSelectionFilters) && this.valueSelectionFilters.length > 0) {
                // merge all valueSelectionFilters
                this.valueSectionStates = {subStates:{}}
                this.valueSelectionFilters.forEach(fID => {
                    this.valueSectionStates.subStates[fID] = this.levelStructService.getAllRecursiveStates(fID);
                    allFittingValueSelectedStates.push(...this.valueSectionStates.subStates[fID]);
                })
            } else if (this.valueSelectionID) {
                allFittingValueSelectedStates = this.levelStructService.getAllRecursiveStates(this.valueSelectionID);
                let vsIDSub = this.levelStructService.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(this.valueSelectionID + '.') });
                if(vsIDSub.length === 0){
                    this.valueSectionStates = {states:allFittingValueSelectedStates}
                } else {
                    this.valueSectionStates = {subStates:{}}
                    this.levelStructService.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(this.valueSelectionID + '.') }).forEach((e: IoBEnum) => {
                        this.valueSectionStates.subStates[e.id] = this.levelStructService.getAllRecursiveStates(e.id);
                    });
                }
            }

            // all states fitting the id - only if no parent
            let totalStatesID = this.levelStructService.getAllRecursiveStates(this.id);

            // intersection of the two states
            if(allFittingValueSelectedStates.length === 0){
                this.allFittingStates = totalStatesID
            } else {
                this.allFittingStates = [...new Set(allFittingValueSelectedStates.filter(x => totalStatesID.includes(x)))];
            }

        } else {
            let totalStatesParentMemberID = this.levelStructService.getAllRecursiveStates(this.parentMemberID);
            this.allFittingStates = [...new Set((this.parentLS as LevelStruct).allFittingStates.filter(x => totalStatesParentMemberID.includes(x)))];
        }

        let withSubFilter = this.lo && 'subLevelFilters' in this.lo && isArray(this.lo.subLevelFilters) && this.lo.subLevelFilters.length > 0;
        switch (this.levelStructService.getLevelIDType(this.id)) {
            case levelIDType.enumType:
                this.levelStructService.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(this.id + '.') }).forEach((e: IoBEnum) => {
                    if ((withSubFilter && this.lo.subLevelFilters.includes(e.id)) || !withSubFilter) {
                        // all states fitting e.id
                        let allMemberStates = this.levelStructService.getAllRecursiveStates(e.id)
                        if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                            this.members[e.id] =
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, e.id, this.valueSectionStates);
                        }
                    }
                });
                break;
            case levelIDType.objectType:
                this.levelStructService.objectQuery.getAll(
                    { filterBy: entity => entity.id.startsWith(this.id + '.') && (entity.id.match(/\./g) || []).length === 2 }
                ).forEach((e: IoBObject) => {
                    if ((withSubFilter && this.lo.subLevelFilters.includes(e.id)) || !withSubFilter) {
                        // all states fitting e.id
                        let allMemberStates = this.levelStructService.getAllRecursiveStates(e.id);
                        if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                            this.members[e.id] =
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, e.id, this.valueSectionStates);
                        }
                    }
                });
                break;
            case levelIDType.stringType:
                switch (levelIDCases[this.id]) {
                    case levelIDCases.instances:
                        this.levelStructService.objectQuery.getAllInstanceIDS().forEach(iID => {
                            let allMemberStates = this.levelStructService.getAllRecursiveStates(iID);
                            if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                                this.members[iID] =
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, iID, this.valueSectionStates);
                            }
                        })
                        break;
                    case levelIDCases.channels:
                        this.levelStructService.objectQuery.getAllChannelIDS().forEach(cID => {
                            let allMemberStates = this.levelStructService.getAllRecursiveStates(cID);
                            if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                                this.members[cID] =
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, cID, this.valueSectionStates);
                            }
                        })
                        break;
                    case levelIDCases.devices:
                        this.levelStructService.objectQuery.getAllDeviceIDS().forEach(dID => {
                            let allMemberStates = this.levelStructService.getAllRecursiveStates(dID);
                            if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                                this.members[dID] =
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, dID, this.valueSectionStates);
                            }
                        })
                        break;
                    case levelIDCases.states:
                        let allMemberStates = this.levelStructService.getAllRecursiveStates(this.parentMemberID);
                        this.allFittingStates.filter(x => allMemberStates.includes(x)).forEach(sID => {
                            this.members[sID] =
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, sID, this.valueSectionStates);
                        });
                        break;
                    case levelIDCases.all:
                        if (!this.elementStates) {
                            this.elementStates = {};
                        }
                        if (this.valueSectionStates && this.valueSectionStates.subStates) {
                            this.allFittingStates.forEach(sID => {
                                for(var val in this.valueSectionStates.subStates){
                                    if(this.valueSectionStates.subStates[val].includes(sID)){
                                        if(!(val in this.elementStates)){
                                            let tmpE = this.levelStructService.objectQuery.getEntity(sID);
                                            this.elementStates[val] = {
                                                functionID: val,
                                                stateIDs: [],
                                                role: (tmpE && 'common' in tmpE && 'role' in tmpE.common) ? tmpE.common.role : '',
                                                write: (tmpE && 'common' in tmpE && 'write' in tmpE.common) ? tmpE.common.write : false,
                                                read: (tmpE && 'common' in tmpE && 'read' in tmpE.common) ? tmpE.common.read : false,
                                                type: (tmpE && 'common' in tmpE && 'type' in tmpE.common) ? tmpE.common.type : '',
                                            }
                                        }
                                        this.elementStates[val].stateIDs.push(sID)
                                    }
                                }
                            });
                        } else if (this.valueSectionStates && this.valueSectionStates.states) {
                            // id valueSelectionID is set but no valueSecetionFilters ==> all sub enum domains can be taken
                            this.allFittingStates.forEach(sID => {
                                if (this.valueSectionStates.states.includes(sID)) {
                                    let tmpE = this.levelStructService.objectQuery.getEntity(sID);
                                    let role = (tmpE && 'common' in tmpE && 'role' in tmpE.common) ? tmpE.common.role : '';
                                    let write = (tmpE && 'common' in tmpE && 'write' in tmpE.common) ? tmpE.common.write : false;
                                    let read = (tmpE && 'common' in tmpE && 'read' in tmpE.common) ? tmpE.common.read : false;
                                    let type = (tmpE && 'common' in tmpE && 'type' in tmpE.common) ? tmpE.common.type : '';
                                    if (!(role + '_' + write + '_' + read + '_' + type in this.elementStates)) {
                                        this.elementStates[role + '_' + write + '_' + read + '_' + type] = {
                                            functionID: role + '_' + write + '_' + read + '_' + type,
                                            stateIDs: [],
                                            role: role,
                                            write: write,
                                            read: read,
                                            type: type,
                                        }
                                    }
                                    this.elementStates[role + '_' + write + '_' + read + '_' + type].stateIDs.push(sID)
                                }
                            });
                        } else {
                            // if no valueSelection selected, we sort with the common type and
                            this.allFittingStates.forEach(sID => {
                                let tmpE = this.levelStructService.objectQuery.getEntity(sID);
                                let role = (tmpE && 'common' in tmpE && 'role' in tmpE.common) ? tmpE.common.role : '';
                                let write = (tmpE && 'common' in tmpE && 'write' in tmpE.common) ? tmpE.common.write : false;
                                let read = (tmpE && 'common' in tmpE && 'read' in tmpE.common) ? tmpE.common.read : false;
                                let type = (tmpE && 'common' in tmpE && 'type' in tmpE.common) ? tmpE.common.type : '';
                                if (!(role + '_' + write + '_' + read + '_' + type in this.elementStates)) {
                                    this.elementStates[role + '_' + write + '_' + read + '_' + type] = {
                                        functionID: role + '_' + write + '_' + read + '_' + type,
                                        stateIDs: [],
                                        role: role,
                                        write: write,
                                        read: read,
                                        type: type,
                                    }
                                }
                                this.elementStates[role + '_' + write + '_' + read + '_' + type].stateIDs.push(sID)
                            })
                        }
                        break;
                    default:
                        console.log('???')
                }
                break;
            default:
                break;
        }
        // add the states to the parents
        if(this.parentLS){
            if(!this.parentLS.elementStates){
                this.parentLS.elementStates = {};
            }
            Object.keys(this.elementStates).forEach(fmID => {
                if(!(fmID in this.parentLS.elementStates)){
                    this.parentLS.elementStates[fmID] = this.elementStates[fmID];
                } else {
                    this.parentLS.elementStates[fmID].stateIDs.push(...this.elementStates[fmID].stateIDs);
                }
            })
        }
    }
}

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
        public enumQuery: IoBEnumQuery,
        public objectQuery: IoBObjectQuery,
    ) { }

    public transformLevelObjectToLevelStruct(lo: IInputLevelObject, valueSelectionID: string, valueSelectionFilters: string[]): Observable<ILevelStruct> {
        let tmpSubscription = [];
        let tmpILevelStruct = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
        let subject = new BehaviorSubject<ILevelStruct>(tmpILevelStruct)
        tmpSubscription.push(this.enumQuery.selectEntityAction().subscribe(action => {
            let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
            subject.next(t);
        }));
        tmpSubscription.push(this.objectQuery.selectEntityAction().subscribe(action => {
            let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
            subject.next(t);
        }));
        return subject.asObservable();
    }

    public getLevelIDType(levelID: string): levelIDType {
        if (!levelID || typeof levelID !== 'string') {
            return levelIDType.noneType;
        }
        if (levelID.startsWith('enum')) {
            return levelIDType.enumType;
        } else if (levelID && (levelIDCases[levelID] || levelIDCases[levelID] === 0)) {
            return levelIDType.stringType;
        } else if (this.objectQuery.hasEntity(levelID)) {
            return levelIDType.objectType
        }
        return levelIDType.noneType
    }

    /** gets the name of a id */
    public CTRLgetNameFromID(id: string): string | object {
        return (this.enumQuery.hasEntity(id))
            ? this.enumQuery.getEntity(id).common.name
            : (this.objectQuery.hasEntity(id))
                ? this.objectQuery.getEntity(id).common.name
                : id;
    }

    public getAllRecursiveStates(id: string): string[] {
        switch (this.getLevelIDType(id)) {
            case levelIDType.enumType:
                return this.enumQuery.getAllStatesRecursiveFromEnumID(id);
            case levelIDType.objectType:
                return this.objectQuery.getAllStatesIDWithinParentID(id);
            case levelIDType.stringType:
                break;
            case levelIDType.noneType:
                return [];
        }
        return [];
    }
}
