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


export interface ElementStates {
    name: string | object,
    functionStates: {
        [key: string]: {                // key = functionID
            [key: string]: string[],    // key = enumID         value = stateIDs
        },
    },
}

export enum levelIDCases {
    instances = 0,
    channels = 1,
    devices = 2,
    states = 3,
    enums = 4,
}

export const levelIDCases1: string[] = [
    'instances',
    'channels',
    'devices',
    'states',
    'enums'
]

/**
 * Naming convention:
 *  -    Level          => corrent level of the ILevelStruct
 *  -    RootLevel      => all EnumRootDomain or RootInstance
 *  -    SubLevel       => all Defined SubLevel, must follow the rules described below
 *  -    SubLevelFilter => if empty no Filter. Filter are direct EnumSubDomain or Members. Only the one in the Filter will be accepted for SubLevels
 *  -    EnumRootDomain => all enums only have one points (normally they have no members)
 *  -    EnumSubDomain  => all enums that have two points. Sub because they are a subEnumDomain of EnumRootDomain (normally they have members)
 * 
 * 
 * SubLevel Rules
 *  -    subLevel ID's must be in the enumSubDomain or in any of the enumSubDomain/members -members 
 *         or any of the levelIDCases it can be 'instances' 'channels', 'devices', 'states', 'enums'; than all ... for all enumSubDomains/members will be taken
 * 
 * 
 */
export interface ILevelStruct {
    id: string,
    name?: string | object,
    subLevels?: ILevelStruct[],
    subLevelFilters?: string[],
    elementStates?: ElementStates,
}

export interface IInputLevelStruct {
    id?: string,
    // name?: string | object,
    level: number,
    subLevel?: IInputLevelStruct,
    availableLevelIDs?: { id: string; name: string | object; type: string }[],
    subLevelFilters?: string[],
    subLevelAvailableFilters?: { id: string; name: string | object; type: string }[],
    parent: IInputLevelStruct
}

export interface IInputLevelObject {
    id?: string,
    // name?: string | object,
    subLevel?: IInputLevelStruct,
    subLevelFilters?: string[],
}

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
export class LevelStruct {

    private enumQuery: IoBEnumQuery;
    private objectQuery: IoBObjectQuery;
    private observable: Subject<ILevelStruct>;


    constructor(
        private levelStruct: ILevelStruct,
    ) {
        this.enumQuery = ServiceLocator.injector.get(IoBEnumQuery);
        this.objectQuery = ServiceLocator.injector.get(IoBObjectQuery);
        this.observable = new Subject<ILevelStruct>();
        try {
            this.checkLevelStruct(this.levelStruct);
            this.observable.next(this.levelStruct);
        } catch (e) {
            throw 'The following error occured while checking the levelStruct: ' + e;
        }
        try {
            this.generateElementStates(this.levelStruct);
        } catch (e) {
            throw 'The following error occured while checking the LevelStruct: ' + e;
        }
    }

    /**
     * Select the LevelStruct Observable
     */
    public selectLevelStruct(): Observable<ILevelStruct> {
        return this.observable;
    }

    /** 
     * checks if the LevelStruct follows the rules (descrbed above), if not it throws an error. 
     * 
     */
    private checkLevelStruct(levelStruct: ILevelStruct) {
        if ('subLevels' in levelStruct) {
            levelStruct.subLevels.forEach((subLevel: ILevelStruct) => {
                if (!this.checkIfSubLevelIsInLevel(levelStruct.id, subLevel.id)) {
                    throw `${subLevel.id} is not included in any enumSubDomain or Members from ${levelStruct.id}`
                }
                this.checkLevelStruct(subLevel);
            });
        }
    }

    /** checks if an subLevel is in the Level (enumSubDomain/members) */
    private checkIfSubLevelIsInLevel(levelID: string, subLevelID: string): boolean {
        if (subLevelID === 'all') {
            return true;
        }
        let levelEntity: IoBEnum | IoBObject;
        let subDomains: IoBEnum[] | IoBObject[];
        if (this.enumQuery.hasEntity(levelID)) {
            levelEntity = this.enumQuery.getEntity(levelID);
            subDomains = this.enumQuery.getAll(({ filterBy: entity => entity.id.startsWith(levelID + '.') }))
        } else if (this.objectQuery.hasEntity(levelID)) {
            levelEntity = this.objectQuery.getEntity(levelID);
            subDomains = this.objectQuery.getAll(({ filterBy: entity => entity.id.startsWith(levelID + '.') }))
        } else {
            return false;
        }

        if (levelEntity && 'common' in levelEntity && 'members' in levelEntity.common) {
            // check if subLevelID is in a member
            if (levelEntity.common.members.includes(subLevelID)) {
                return true;
            }
            // check if subLevelID is in a members enumSubDomain/members
            if (levelEntity.common.members.some(e => this.checkIfSubLevelIsInLevel(e, subLevelID))) {
                return true;
            }
        }
        if (subDomains && subDomains.length > 0) {
            // check if subLevelID is a enumSubDomain
            if (subDomains.some((e: IoBEnum | IoBObject) => e.id === subLevelID || e._id === subLevelID)) {
                return true;
            }
            // check if subLevelID is in a members enumSubDomain/members
            if (subDomains.some((e: IoBEnum | IoBObject) => this.checkIfSubLevelIsInLevel(e.id, subLevelID))) {
                return true
            }
        }
        return false;
    }

    private generateElementStates(levelStruct: ILevelStruct) {
        // ==> ToDo
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
        private enumQuery: IoBEnumQuery,
        private objectQuery: IoBObjectQuery,
    ) { }

    /**
     * 
     * Returns a fill InputLevelStruct with all the subLevels 
     * 
     * @param rootID root ID (ioBroker ID)
     * @param levelDeep
     * @param functionsSelection if empty [] all functions are taken, else the functions in the Array are taken. If ['*'], no filter for function taken at all
     */
    public getFullInputLevelStruct(rootID: string, levelDeep: number, functionsSelection: string[]): ILevelStruct {
        // => ToDo functions filter
        let withoutSubLevel = true;
        let inputLevelStruct: ILevelStruct = {
            id: rootID,
        };
        let levelEntity: IoBEnum | IoBObject;
        let subDomains: IoBEnum[] | IoBObject[];

        if (this.enumQuery.hasEntity(rootID)) {
            levelEntity = this.enumQuery.getEntity(rootID);
            subDomains = this.enumQuery.getAll(({ filterBy: entity => entity.id.startsWith(rootID + '.') }))
        }
        else if (this.objectQuery.hasEntity(rootID)) {
            levelEntity = this.objectQuery.getEntity(rootID);
            subDomains = this.objectQuery.getAll(({
                filterBy: (entity: IoBEnum | IoBObject) =>
                    entity.id.startsWith(rootID + '.')
            }))
        }
        if (levelDeep <= 1) {
            // needed to check if Functions meet
            withoutSubLevel = false
            levelDeep = 300;
        }
        if (levelEntity && 'common' in levelEntity && 'members' in levelEntity.common && levelEntity.common.members.length > 0) {
            // add all members to sublevel
            if (inputLevelStruct.subLevels === undefined) { inputLevelStruct.subLevels = []; }
            inputLevelStruct.subLevels = inputLevelStruct.subLevels.concat(levelEntity.common.members
                .map(e => this.getFullInputLevelStruct(e, levelDeep - 1, functionsSelection)));
        }
        if (subDomains && subDomains.length > 0) {
            if (inputLevelStruct.subLevels === undefined) { inputLevelStruct.subLevels = []; }
            // add all enumSubDomain to sublevel
            subDomains.forEach(e => {
                inputLevelStruct.subLevels = inputLevelStruct.subLevels.concat(this.getFullInputLevelStruct(e.id, levelDeep - 1, functionsSelection))
            })
        }
        if (inputLevelStruct.subLevels === undefined) {
            if (!(this.enumQuery.getEntity('enum.functions.light').common.members.filter(e => e === rootID).length > 0)) {
                return null;
            }
            return inputLevelStruct;
        }
        inputLevelStruct.subLevels = inputLevelStruct.subLevels.filter(e => e);
        if (inputLevelStruct.subLevels.length === 0) {
            return null;
        }
        if (!withoutSubLevel) {
            // if withoutSubLevel, we no longer need the subLevels
            delete inputLevelStruct.subLevels;
        }
        return inputLevelStruct;
    }

    /** gets the IDNameTypePairs out from an Entity Array */
    private getIdNameTypePairs(entities: IoBEnum[] | IoBObject[]): { id: string; name: string | object; type: string }[] {
        let returnV: { id: string; name: string | object; type: string }[] = []
        entities.forEach(e => returnV.push(this.getIdNameTypePairByObject(e)))
        return returnV;
    }

    /** get the IdNameTypePair out of an entity */
    private getIdNameTypePairByObject(entity: IoBEnum | IoBObject): { id: string; name: string | object; type: string } {
        return { id: entity.id, name: entity.common.name, type: entity.type }
    }

    /** get all ValueSelected ID's (only enums) returns all the members from all subDomain and it self */
    private getAllValueSelectedMemberIDs(valueSelectionID: string, valueSelectionFilter: string[], level?: number): string[] {
        if (!valueSelectionID) { return []; }
        let hasFilter = (valueSelectionFilter && isArray(valueSelectionFilter) && valueSelectionFilter.length > 0) ? true : false;
        if (!level) { level = 0; }
        try {
            let ioObjectIDs: string[] = [];
            // get own members enum.members and subMembers
            this.enumQuery.getEntity(valueSelectionID).common.members.forEach(mID => {
                if ((mID.startsWith('enum.'))) {
                    // check for the level 0 if the mID is in the valueSelectionFilter
                    if (hasFilter && level == 0 && (!valueSelectionFilter.includes(mID))) { return; }
                    ioObjectIDs = ioObjectIDs.concat(this.getAllValueSelectedMemberIDs(mID, valueSelectionFilter, level + 1));
                } else {
                    ioObjectIDs.push(mID)
                }
            });
            // get members from enumSubDomain
            this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(valueSelectionID + '.') }).forEach(entity => {
                let mID = entity.id;
                // check for the level 0 if the mID is in the valueSelectionFilter
                if (hasFilter && level == 0 && (!valueSelectionFilter.includes(mID))) { return; }
                ioObjectIDs = ioObjectIDs.concat(this.getAllValueSelectedMemberIDs(mID, valueSelectionFilter, level + 1));
            })
            return ioObjectIDs;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    /** tests if any of the ObjectSubDomain is in the Filter List */
    private hasObjectSubDomainInFilterList(objectID: string, allValueSelectedIDs: string[]): boolean {
        return allValueSelectedIDs.some(e => e.startsWith(objectID));
    }

    /** checks id any device from the enum and all the subDomains has members that fits to the Filter List */
    private hasEnumSubDomainMembersInFilterList(enumID: string, allValueSelectedIDs: string[]): boolean {
        try {
            // check if in enum.members
            if (this.enumQuery.getEntity(enumID).common.members.some(mID =>
                (mID.startsWith('enum.'))
                    ? this.hasEnumSubDomainMembersInFilterList(mID, allValueSelectedIDs)
                    : allValueSelectedIDs.some(e => e.startsWith(mID))
            )) {
                return true;
            }
            // check if in enumSubDomain
            return this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(enumID + '.') })
                .some(e => this.hasEnumSubDomainMembersInFilterList(e.id, allValueSelectedIDs));
        } catch (e) {
            return false;
        }
    }

    /** returns all the RootLevel IDs (all EnumRootDomain or RootInstance IDs) */
    public getAllRootLevelIDs(type?: string, valueSelectionID?: string, valueSelectionFilter?: string[]): { id: string; name: string | object; type: string }[] {
        let hasValueSelection: boolean = false;
        if (valueSelectionID && valueSelectionID !== '') {
            hasValueSelection = true;
        }
        const allValueSelectionFilterMembers = this.getAllValueSelectedMemberIDs(valueSelectionID, valueSelectionFilter);

        const getEnumType = () => {
            return this.enumQuery.getAll(({
                filterBy: entity => (entity.id.match(/\./g) || []).length === 1
            })).map(entity =>
                this.getIdNameTypePairByObject(entity)
            ).filter(e => !hasValueSelection || this.hasEnumSubDomainMembersInFilterList(e.id, allValueSelectionFilterMembers));
        }
        const getInstanceType = () => {
            return this.objectQuery.getAll(({ filterBy: entity => entity.type === 'instance' })).map(entity =>
                this.getIdNameTypePairByObject(entity)
            ).filter(e => !hasValueSelection || this.hasObjectSubDomainInFilterList(e.id, allValueSelectionFilterMembers));
        }
        if (type && type === 'enum') {
            return getEnumType();
        } else if (type && type === 'instance') {
            return getInstanceType();
        }
        return getEnumType().concat(getInstanceType());
    }

    //** return all available subLevel IDs (all EnumRootDomain or RootInstance IDs) */
    public getAllAvailableSubLevelIDs(parent: IInputLevelStruct, valueSelectionID: string, valueSelectionFilter: string[]): { id: string; name: string | object; type: string }[] {
        let hasValueSelection = (valueSelectionID && valueSelectionID !== '') ? true : false;
        const allValueSelectedIDs = this.getAllValueSelectedMemberIDs(valueSelectionID, valueSelectionFilter);

        let mainFilter = (parent.subLevelFilters && Array.isArray(parent.subLevelFilters) && parent.subLevelFilters.length > 0)
            ? parent.subLevelFilters
            : (parent.subLevelAvailableFilters && Array.isArray(parent.subLevelAvailableFilters) && parent.subLevelAvailableFilters.length > 0)
                ? parent.subLevelAvailableFilters.map(e => e.id)
                : []

        const calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique = (enumDomainID: string, filter: string[], rootDomainMembers: {}) => {
            let levelEntity = this.enumQuery.getEntity(enumDomainID);
            // check members
            if ('common' in levelEntity && 'members' in levelEntity.common && levelEntity.common.members.length > 0) {
                levelEntity.common.members
                    .filter(e => (filter && Array.isArray(filter) && filter.length > 0 && !filter.includes(e)) ? false : true)
                    .forEach(e => {
                        let tmpNs = e.split('.');
                        let mID = tmpNs[0] + '.' + tmpNs[1];
                        if (mID in rootDomainMembers) { return; }

                        if (!mID.startsWith('enum.')) {
                            if (!hasValueSelection || this.hasObjectSubDomainInFilterList(mID, allValueSelectedIDs)) {
                                rootDomainMembers[mID] = this.objectQuery.getEntity(mID);
                            }
                        }
                        else if (!hasValueSelection || this.hasEnumSubDomainMembersInFilterList(mID, allValueSelectedIDs)) {
                            rootDomainMembers[mID] = this.enumQuery.getEntity(mID);
                            calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique(mID, filter, rootDomainMembers);
                        }
                    });
            }
            // check subEnumDomains
            if ((enumDomainID.match(/\./g) || []).length === 1) {
                this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(enumDomainID + '.') })
                    .filter(e => (filter && Array.isArray(filter) && filter.length > 0 && !filter.includes(e.id)) ? false : true)
                    .forEach(e => {
                        calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique(e.id, e.common.members, rootDomainMembers);
                    });
            }
        }

        const calculateAllChannelSubDomain_RootDomainMembersRecursiveUnique = (enumDomainID: string, filter: string[]): { id: string; name: string | object; type: string; }[] => {

            const getAllSubLevelMembersRekursiveObjectID = (domainID: string, efilter: string[]): boolean => {
                try {
                    let levelEntity = this.enumQuery.getEntity(domainID);
                    let returnArray: boolean[] = []
                    if ('common' in levelEntity && 'members' in levelEntity.common && levelEntity.common.members.length > 0) {
                        levelEntity.common.members.forEach(e => {
                            if (e.startsWith('enum.')) {
                                returnArray.push(getAllSubLevelMembersRekursiveObjectID(e, efilter));
                            }
                            else {
                                if (!hasValueSelection || this.hasObjectSubDomainInFilterList(e, allValueSelectedIDs)) {
                                    returnArray.push(efilter.some(fID => fID.startsWith(e)));
                                }
                            }
                        })
                    }
                    // check subEnumDomains
                    if ((domainID.match(/\./g) || []).length === 1) {
                        this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(domainID + '.') })
                            .forEach(e => {
                                returnArray.push(getAllSubLevelMembersRekursiveObjectID(e.id, efilter));
                            });
                    }
                    return returnArray.some(e => e);
                } catch (e) {
                    console.log(domainID)
                    console.log(e)
                    console.log(efilter)
                    return false;
                }
            }

            // get all memebers form RooEnumDomain and all the subEnumDomains
            let tmpIDDomains = {};
            this.enumQuery.getAll(({ filterBy: entity => (entity.id.match(/\./g) || []).length === 1 }))
                .filter(e => {
                    let tmpDomainMembers = {}
                    calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique(e.id, [], tmpDomainMembers);
                    if (Object.keys(tmpDomainMembers).filter(subE => enumDomainID.startsWith(subE)).length > 0) {
                        tmpIDDomains[e.id] = tmpDomainMembers;
                    }
                });
            return this.getIdNameTypePairs(Object.keys(tmpIDDomains).filter(e => getAllSubLevelMembersRekursiveObjectID(e, filter)).map(e => this.enumQuery.getEntity(e)));
        }

        const getAllStringTypesAsPair = (): { id: string; name: string | object; type: string }[] => {
            return Object.keys(levelIDCases).filter(k => typeof levelIDCases[k as any] === "number").map(e => {
                return { id: e, name: e, type: 'string' }
            });
        }

        if (this.enumQuery.hasEntity(parent.id)) {
            let rootDomainMembers = {};
            calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique(parent.id, Object.values(mainFilter), rootDomainMembers);
            return this.getIdNameTypePairs(Object.values(rootDomainMembers)).concat(getAllStringTypesAsPair());
        } else if (this.objectQuery.hasEntity(parent.id)) {
            let rootDomainMembers = calculateAllChannelSubDomain_RootDomainMembersRecursiveUnique(parent.id, Object.values(mainFilter));
            return rootDomainMembers.concat(getAllStringTypesAsPair())
        } else if (levelIDCases[parent.id] || levelIDCases[parent.id] === 0) {
            return getAllStringTypesAsPair().filter(e => levelIDCases[parent.id] < levelIDCases[e.id]);
        } else {
            return null;
        }
    }

    /** get the SubLevelFilter by id */
    public getSubLevelAvailableFilters(ls: IInputLevelStruct, valueSelectionID?: string, valueSelectionFilter?: string[]): { id: string; name: string | object; type: string }[] {
        let hasValueSelection: boolean = false;
        if (valueSelectionID && valueSelectionID !== '') {
            hasValueSelection = true;
        }
        // console.log(ls)
        const allValueSelectionFilterMembers = this.getAllValueSelectedMemberIDs(valueSelectionID, valueSelectionFilter);
        let mainFilter = (ls.parent && ls.parent.subLevelFilters && Array.isArray(ls.parent.subLevelFilters) && ls.parent.subLevelFilters.length > 0)
            ? ls.parent.subLevelFilters
            : (ls.parent && ls.parent.subLevelAvailableFilters && Array.isArray(ls.parent.subLevelAvailableFilters) && ls.parent.subLevelAvailableFilters.length > 0)
                ? ls.parent.subLevelAvailableFilters.map(e => e.id)
                : []
        let hasFilter = (mainFilter.length > 0) ? true : false;
        const calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique = (efilter: string[], rootDomainMembers: {}) => {
            const caesd_rdmru = (enumDomainID: string, domainMembers: {}) => {
                let levelEntity = this.enumQuery.getEntity(enumDomainID);
                // check members
                if ('common' in levelEntity && 'members' in levelEntity.common && levelEntity.common.members.length > 0) {
                    levelEntity.common.members
                        .forEach(e => {
                            if (!e.startsWith('enum.')) {
                                if (!hasValueSelection || this.hasObjectSubDomainInFilterList(e, allValueSelectionFilterMembers)) {
                                    domainMembers[e] = this.objectQuery.getEntity(e);
                                }
                            }
                            else if (!hasValueSelection || this.hasEnumSubDomainMembersInFilterList(e, allValueSelectionFilterMembers)) {
                                domainMembers[e] = this.enumQuery.getEntity(e);
                                caesd_rdmru(e, domainMembers);
                            }
                        });
                }
                // check subEnumDomains
                if ((enumDomainID.match(/\./g) || []).length === 1) {
                    this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(enumDomainID + '.') })
                        .forEach(e => { caesd_rdmru(e.id, domainMembers); });

                }
            }
            const getEnumIDWhereObjectIDIsIn = (enumDomainID: string, domainMembers: {}, fFilter: string[]): boolean => {
                let levelEntity = this.enumQuery.getEntity(enumDomainID);
                let isIn: boolean[] = []
                if ('common' in levelEntity && 'members' in levelEntity.common && levelEntity.common.members.length > 0) {
                    levelEntity.common.members.forEach(e => {
                        if (!isIn.some(e => e))
                            if (e.startsWith('enum.')) {
                                isIn.push(getEnumIDWhereObjectIDIsIn(e, domainMembers, fFilter));
                            } else {
                                if (fFilter.some(fID => e.startsWith(fID))) {
                                    isIn.push(true);
                                }
                            }
                    })
                }
                if ((enumDomainID.match(/\./g) || []).length === 1) {
                    this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(enumDomainID + '.') })
                        .filter(e => getEnumIDWhereObjectIDIsIn(e.id, domainMembers, fFilter))
                }
                if (isIn.some(e => e)) {
                    if (enumDomainID.startsWith(ls.id)) {
                        domainMembers[enumDomainID] = enumDomainID;
                    }
                    return true;
                }
                return false;
            }
            efilter.forEach(e => {
                if (this.enumQuery.hasEntity(e)) {
                    let t = {}
                    caesd_rdmru(e, t);
                    Object.keys(t).forEach(e => {
                        if (!(e in rootDomainMembers)) {
                            rootDomainMembers[e] = t[e];
                        }
                    })
                }
                else {
                    if (this.enumQuery.hasEntity(ls.id)) {
                        let t = {}
                        getEnumIDWhereObjectIDIsIn(ls.id, t, efilter);
                        Object.keys(t).forEach(e => {
                            if (!(e in rootDomainMembers)) {
                                rootDomainMembers[e] = t[e];
                            }
                        })
                    }
                }
            })
        }
        let allFilterAvailable = {}
        calculateAllEnumSubDomain_RootDomainMembersRecursiveUnique(mainFilter, allFilterAvailable)

        if (this.enumQuery.hasEntity(ls.id)) {
            let members = this.enumQuery.getEntity(ls.id).common.members.filter(id => id.startsWith('enum.')).map(id => this.enumQuery.getEntity(id));
            let subDomains = this.enumQuery.getAll(({
                filterBy: entity => entity.id.startsWith(ls.id + '.') && (entity.id.match(/\./g) || []).length - 1 === (ls.id.match(/\./g) || []).length
            }));
            return this.getIdNameTypePairs(subDomains).concat(this.getIdNameTypePairs(members))
                .filter(e => !hasFilter || Object.keys(allFilterAvailable).includes(e.id))
        }
        else if (this.objectQuery.hasEntity(ls.id)) {
            let subDomains = this.objectQuery.getAll(({
                filterBy: (entity: IoBObject) => {
                    return entity.id.startsWith(ls.id + '.') && (entity.id.match(/\./g) || []).length - 1 === (ls.id.match(/\./g) || []).length
                }
            }));
            return this.getIdNameTypePairs(subDomains)
                .filter(e => !hasValueSelection || this.hasObjectSubDomainInFilterList(e.id, allValueSelectionFilterMembers))
                .filter(e => !hasFilter || Object.keys(allFilterAvailable).includes(e.id))
        }
    }

    /** generates the inputLevelObject from the inputLevelStruct */
    public getInputLevelObjectFromInputLevelStruct(inputLevelStruct: IInputLevelStruct): IInputLevelObject {
        const getCircularReplacer = () => {
            const seen = new WeakSet;
            return (key, value) => {
                if (typeof value === "object" && value !== null) {
                    if (seen.has(value)) { return; }
                    seen.add(value);
                }
                return value;
            };
        };

        const delKeys = (app) => {
            for (let key in app) {
                if (app[key] !== null && typeof (app[key]) === 'object') {
                    delKeys(app[key])
                }
                if (['parent', 'subLevelAvailableFilters', 'availableLevelIDs', 'level'].includes(key)) {
                    delete app[key];
                }
                if (app[key] === null) {
                    delete app[key]
                }
            }
        }

        let outObject = JSON.parse(JSON.stringify(inputLevelStruct, getCircularReplacer()));
        delKeys(outObject);
        return outObject
    }

    /** generates the IInputLevelStruct from the inputLevelObject */
    public getInputLevelStructFromInputLevelObject(inputLevelObject: IInputLevelObject, valueSelectionID?: string, valueSelectionFilter?: string[]): IInputLevelStruct {
        const addKeys = (app, level, parent) => {
            if ('id' in app) {
                app.level = level;
                parent = parent;
                app.availableLevelIDs = (level === 0)
                    ? this.getAllRootLevelIDs(null, valueSelectionID, valueSelectionFilter)
                    : this.getAllAvailableSubLevelIDs(parent, valueSelectionID, valueSelectionFilter);
                app.subLevelAvailableFilters = this.getSubLevelAvailableFilters(app, valueSelectionID, valueSelectionFilter)

            }
            if('subLevel' in app){
                addKeys(app.subLevel, level+1, app);
            }
        }

        let outStruct = JSON.parse(JSON.stringify(inputLevelObject));
        addKeys(outStruct, 0, null);
        return outStruct;
    }
}
