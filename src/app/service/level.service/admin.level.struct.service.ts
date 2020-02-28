import { Injectable } from "@angular/core";
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { isArray } from 'util';
import { levelIDCases, IAdminLevelStruct, IInputLevelObject } from './level.struct.model';


/**
 * Used to dynamically create an IInputLevelObject i.e. for Admin Panel
 */
@Injectable({
    providedIn: 'root'
})
export class AdminLevelStructService {
    constructor(
        private enumQuery: IoBEnumQuery,
        private objectQuery: IoBObjectQuery,
    ) { }

    private getAllStringTypesID(): string[] {
        return Object.keys(levelIDCases).filter(k => typeof levelIDCases[k as any] === "number").map(e => {
            return e
        });
    }

    /** get all state ids within id */
    private getAllStateIDSWithinID(id: string): string[] {
        if (id.startsWith('enum.')) {
            return this.enumQuery.getAllStatesRecursiveFromEnumID(id)
        } else {
            return this.objectQuery.getAllStatesIDWithinParentID(id)
        }
    }

    /** get all root enum and instance IDS */
    private getAllRootEnumAndInstanceIDS(exclusion: string[]): string[] {
        let returnArray: string[] = [];
        returnArray.push(...this.enumQuery.getAllRootDomainEnumIDS());
        returnArray.push(...this.objectQuery.getAllInstanceIDS(exclusion));
        return returnArray;
    }

    /** get all states within all filters  => merge all*/
    private getAllStatesWithinFiltersMerge(filters: string[]): string[] {
        let returnStates: string[] = [];
        filters.forEach(fID => {
            if (fID.startsWith('enum.')) {
                returnStates.push(...this.enumQuery.getAllStatesRecursiveFromEnumID(fID))
            } else {
                returnStates.push(...this.objectQuery.getAllStatesIDWithinParentID(fID))
            }
        });

        return [...new Set(returnStates)];
    }

    /** get all states within any filters ==>  intersection of all subArray */
    private getAllStatesInAllFiltersIntersection(filters: string[][]): string[] {
        let returnStates: string[] = [];
        filters.forEach((subFilters: string[], index: number) => {
            if (index === 0) {
                returnStates = subFilters;
            } else {
                returnStates = returnStates.filter(rID => this.getAllStateIDSWithinID(rID).filter(x => subFilters.includes(x)).length > 0);
            }
        })
        return [...new Set(returnStates)];
    }

    /** get level id + all level ids from parents */
    private getLevelIDS(als: IAdminLevelStruct): string[] {
        let returnArray: string[] = []
        if (als.id) {
            returnArray.push(als.id);
        }
        if (als.parent && als.parent !== null) {
            returnArray.push(...this.getLevelIDS(als.parent));
        }
        return returnArray;
    }

    /** get level id + all level ids from parents */
    private getLevelFiltersArray(als: IAdminLevelStruct): string[][] {
        let returnArray: string[][] = []
        if (als.subLevelFilters && isArray(als.subLevelFilters) && als.subLevelFilters.length > 0) {
            returnArray.push(als.subLevelFilters);
        }
        if (als.parent && als.parent !== null) {
            returnArray.push(...this.getLevelFiltersArray(als.parent));
        }
        return returnArray;
    }

    private getAllStatesFiltersGeneral(
        possibleReturnIDS: string[], levelIDs: string[], levelFiltersArray: string[][], valueSelectionID: string, valueSelectionFilters: string[], exclusion?: string[]
    ): string[] {
        let filterAndArrays: string[][] = [];
        // get all levelIDStates
        if (levelIDs && isArray(levelIDs) && levelIDs.length > 0) {
            levelIDs.forEach(lID => {
                filterAndArrays.push(this.getAllStatesWithinFiltersMerge([lID]));
            });
        }
        // add valueSelectionID
        if (valueSelectionID && valueSelectionID !== '' && valueSelectionID !== '-') {
            filterAndArrays.push(this.getAllStatesWithinFiltersMerge([valueSelectionID]))
        }
        //add levelFiltersArray
        if (levelFiltersArray && isArray(levelFiltersArray) && levelFiltersArray.length > 0) {
            levelFiltersArray.forEach((levelFilters: string[]) => {
                if (levelFilters && isArray(levelFilters) && levelFilters.length > 0) {
                    filterAndArrays.push(this.getAllStatesWithinFiltersMerge(levelFilters));
                }
            });
        }
        // add valueSelectionFilters
        if (valueSelectionFilters && isArray(valueSelectionFilters) && valueSelectionFilters.length > 0) {
            filterAndArrays.push(this.getAllStatesWithinFiltersMerge(valueSelectionFilters));
        }

        // get all States within valueSelectionID and valueSelectionID
        if (filterAndArrays.length === 0) {
            return possibleReturnIDS
        }

        // Intersection of all filter states
        let allFilteredStates = this.getAllStatesInAllFiltersIntersection(filterAndArrays);
        return possibleReturnIDS.filter(rID => this.getAllStateIDSWithinID(rID).filter(x => allFilteredStates.includes(x)).length > 0);
    }

    /** get all rootDomainEnum IDS */
    public getAllRootEnumIDS(): string[] {
        return this.enumQuery.getAllRootDomainEnumIDS();
    }

    /** get all direct value selection subLevel Enum IDS */
    public getAllValueSelectionAvailableFilterIDS(valueSelectionID: string, exclusion?: string[]): string[] {
        let slaf: string[] = [];
        slaf = this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(valueSelectionID + '.') }).map(e => e.id);
        return this.getAllStatesFiltersGeneral(slaf, [], [], valueSelectionID, [], exclusion);
    }

    /** get all direct subLevel Filters Enum IDS by AdminStruct */
    public getSubLevelAvailableFilterIDSByAdminStruct(
        ls: IAdminLevelStruct, valueSelectionID: string, valueSelectionFilters: string[], exclusion?: string[]
    ): string[] {
        // get all subLevelAvailableFilters
        let slaf: string[] = []
        if (ls.id.startsWith('enum.')) {
            slaf = this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(ls.id + '.') }).map(e => e.id);
        } else if (levelIDCases[ls.id] || levelIDCases[ls.id] === 0) {
            return []
        } else {
            if (!this.objectQuery.hasEntity(ls.id)) { return [] }
            slaf = this.objectQuery.getAll({ filterBy: entity => entity.id.startsWith(ls.id + '.') }).map(e => e.id);
        }
        return this.getAllStatesFiltersGeneral(slaf, this.getLevelIDS(ls), this.getLevelFiltersArray(ls), valueSelectionID, valueSelectionFilters, exclusion);
    }

    /** get all possible/mathing level IDS that matches the filters */
    public getAllPossibleLevelIDS(
        ls: IAdminLevelStruct, valueSelectionID: string, valueSelectionFilters: string[], exclusion?: string[]
    ): string[] {
        // get all available RootIDS
        let allLevelIDS = this.getLevelIDS(ls)
        let rootIDS: string[] = this.getAllRootEnumAndInstanceIDS(exclusion).filter(e => e !== valueSelectionID)
            .filter(e => (allLevelIDS && allLevelIDS.length > 0) ? !allLevelIDS.includes(e) : true);

        let returnA: string[] = [];
        if (ls.level === 0) {
            returnA = this.getAllStatesFiltersGeneral(rootIDS, allLevelIDS, this.getLevelFiltersArray(ls), valueSelectionID, valueSelectionFilters, exclusion);
        } else if (ls.parent.id && ls.parent.id.startsWith('enum.')) {
            returnA = this.getAllStatesFiltersGeneral(rootIDS, allLevelIDS, this.getLevelFiltersArray(ls), valueSelectionID, valueSelectionFilters, exclusion);
            returnA.push(...this.getAllStringTypesID());
        } else if (ls.parent.id && (levelIDCases[ls.parent.id] || levelIDCases[ls.parent.id] === 0)) {
            returnA = this.getAllStringTypesID().filter(e => levelIDCases[ls.parent.id] < levelIDCases[e]);
        } else {
            returnA = this.getAllStatesFiltersGeneral(rootIDS, allLevelIDS, this.getLevelFiltersArray(ls), valueSelectionID, valueSelectionFilters, exclusion);
            returnA = returnA.filter(e => !e.startsWith('enum.'));
            returnA.push(...this.getAllStringTypesID());
        }
        return returnA;
    }

    /** generates the inputLevelObject from the adminLevelStruct */
    public CTRLgetLevelObjectFromAdminLevelStruct(als: IAdminLevelStruct): IInputLevelObject {
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

        let outObject = JSON.parse(JSON.stringify(als, getCircularReplacer()));
        delKeys(outObject);
        return outObject
    }

    /** generates the IAdminLevelStruct from the inputLevelObject */
    public getLevelStructFromAdminLevelObject(
        inputLevelObject: IInputLevelObject, valueSelectionID?: string, valueSelectionFilter?: string[], exclusion?: string[]
    ): IAdminLevelStruct {
        const addKeys = (app, level, parent) => {
            if ('id' in app) {
                app.level = level;
                app.parent = parent;
                app.availableLevelIDs = (level === 0)
                    ? this.getAllPossibleLevelIDS({ level: 0, parent: null }, valueSelectionID, valueSelectionFilter, exclusion)
                    : this.getAllPossibleLevelIDS(parent, valueSelectionID, valueSelectionFilter, exclusion);
                let subLevelFilters = null;
                if ('subLevelFilters' in app) {
                    subLevelFilters = app.subLevelFilters;
                    delete app.subLevelFilters;
                }
                app.subLevelAvailableFilters = this.getSubLevelAvailableFilterIDSByAdminStruct(app, valueSelectionID, valueSelectionFilter, exclusion);
                if(subLevelFilters){
                    app.subLevelFilters = subLevelFilters
                }

            }
            if ('subLevel' in app) {
                addKeys(app.subLevel, level + 1, app);
            }
        }
        let outStruct = JSON.parse(JSON.stringify(inputLevelObject));
        addKeys(outStruct, 0, null);
        return outStruct;
    }

    test(exclusion?: string[]) {
        let l: string[] = [];
        let t0 = new Date().getTime();
        let enumIDS = this.enumQuery.getAllRootDomainEnumIDS();
        let t1 = new Date().getTime();
        let objectIDS = this.objectQuery.getAllInstanceIDS(exclusion);
        let t2 = new Date().getTime();

        enumIDS.forEach(enumID => {
            l.push(...this.enumQuery.getAllStatesRecursiveFromEnumID(enumID));
        })
        let t3 = new Date().getTime();
        objectIDS.forEach(objectID => {
            l.push(...this.objectQuery.getAllStatesIDWithinParentID(objectID));
        })
        let t4 = new Date().getTime();
        l = [...new Set(l)]
        let t5 = new Date().getTime();
        console.log('T1: ', t1 - t0);
        console.log('T2: ', t2 - t0);
        console.log('T3: ', t3 - t0);
        console.log('T4: ', t4 - t0);
        console.log('T5: ', t5 - t0);
        console.log(l)
        console.log('=================================');
        let t: string[] = [];
        let t10 = new Date().getTime();
        enumIDS.push(...objectIDS)
        enumIDS.forEach(fID => {
            t.push(...getAllStatesWithinFilters(enumIDS))
        })
        let t11 = new Date().getTime();
        console.log('Time: ', t11 - t10);
        console.log(t);

        /** get all states within all filters */
        const getAllStatesWithinFilters = (filters: string[]): string[] => {
            let returnStates: string[] = [];
            filters.forEach(fID => {
                if (fID.startsWith('enum.')) {
                    returnStates.push(...this.enumQuery.getAllStatesRecursiveFromEnumID(fID))
                } else {
                    returnStates.push(...this.objectQuery.getAllStatesIDWithinParentID(fID))
                }
            })
            return returnStates;
        }
    }
}
