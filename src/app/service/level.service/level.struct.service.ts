import { Injector, Injectable } from "@angular/core";
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { IoBObject } from 'src/app/store/object/io-bobject.model';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { isArray } from 'util';
import { IInputLevelObject, ILevelStruct, levelIDCases, ElementStates, IElementState } from './level.struct.model';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { IoBState } from 'src/app/store/state/io-bstate.model';
import { IconsService } from 'src/app/service/icons.service';
import { HelperService } from 'src/app/service/helper.service';


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
    totalOpen = false;
    detailOpen = false;
    private members: ILevelStruct[];
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

    public getBase64Icon(): string {
        try {
            return this.levelStructService.enumQuery.getEntity(this.getParentMemberID()).common.icon;
        } catch (e) {
            return '';
        }
    }

    private init() {
        if (!this.lo || !this.lo.id) {
            this.lo = { id: 'all' }
        }
        this.id = this.lo.id;

        this.members = [];
        this.level = (this.parentLS) ? this.parentLS.level + 1 : 0;

        if (this.parentLS == null) {
            // all states fitting valueSelecetedID or valueSelectedFilters if parent is null
            let allFittingValueSelectedStates = []
            if (this.valueSelectionFilters && isArray(this.valueSelectionFilters) && this.valueSelectionFilters.length > 0) {
                // merge all valueSelectionFilters
                this.valueSectionStates = { subStates: {} }
                this.valueSelectionFilters.forEach(fID => {
                    this.valueSectionStates.subStates[fID] = this.levelStructService.getAllRecursiveStates(fID);
                    allFittingValueSelectedStates.push(...this.valueSectionStates.subStates[fID]);
                })
            } else if (this.valueSelectionID) {
                allFittingValueSelectedStates = this.levelStructService.getAllRecursiveStates(this.valueSelectionID);
                let vsIDSub = this.levelStructService.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(this.valueSelectionID + '.') });
                if (vsIDSub.length === 0) {
                    this.valueSectionStates = { states: allFittingValueSelectedStates }
                } else {
                    this.valueSectionStates = { subStates: {} }
                    this.levelStructService.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(this.valueSelectionID + '.') }).forEach((e: IoBEnum) => {
                        this.valueSectionStates.subStates[e.id] = this.levelStructService.getAllRecursiveStates(e.id);
                    });
                }
            }

            // all states fitting the id - only if no parent
            let totalStatesID = this.levelStructService.getAllRecursiveStates(this.id);

            // intersection of the two states
            if (allFittingValueSelectedStates.length === 0) {
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
                            this.members.push(
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, e.id, this.valueSectionStates));
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
                            this.members.push(
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, e.id, this.valueSectionStates));
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
                                this.members.push(
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, iID, this.valueSectionStates));
                            }
                        })
                        break;
                    case levelIDCases.channels:
                        this.levelStructService.objectQuery.getAllChannelIDS().forEach(cID => {
                            let allMemberStates = this.levelStructService.getAllRecursiveStates(cID);
                            if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                                this.members.push(
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, cID, this.valueSectionStates));
                            }
                        })
                        break;
                    case levelIDCases.devices:
                        this.levelStructService.objectQuery.getAllDeviceIDS().forEach(dID => {
                            let allMemberStates = this.levelStructService.getAllRecursiveStates(dID);
                            if (this.allFittingStates.filter(x => allMemberStates.includes(x)).length > 0) {
                                this.members.push(
                                    new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                        this.levelStructService, this, dID, this.valueSectionStates));
                            }
                        })
                        break;
                    case levelIDCases.states:
                        let allMemberStates = this.levelStructService.getAllRecursiveStates(this.parentMemberID);
                        this.allFittingStates.filter(x => allMemberStates.includes(x)).forEach(sID => {
                            this.members.push(
                                new LevelStruct(this.lo.subLevel, this.valueSelectionID, this.valueSelectionFilters,
                                    this.levelStructService, this, sID, this.valueSectionStates));
                        });
                        break;
                    case levelIDCases.all:
                        if (!this.elementStates) {
                            this.elementStates = {};
                        }
                        if (this.valueSectionStates && this.valueSectionStates.subStates) {
                            this.allFittingStates.forEach(sID => {
                                for (var val in this.valueSectionStates.subStates) {
                                    if (this.valueSectionStates.subStates[val].includes(sID)) {
                                        if (!(val in this.elementStates)) {
                                            let tmpE = this.levelStructService.objectQuery.getEntity(sID);
                                            this.elementStates[val] = new ElementState(
                                                val,
                                                [],
                                                (tmpE && 'common' in tmpE) ? tmpE.common : {},
                                                this.levelStructService
                                            );
                                        }
                                        (this.elementStates[val] as ElementState).stateIDs.push(sID)
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
                                    let unit = (tmpE && 'common' in tmpE && 'unit' in tmpE.common) ? tmpE.common.unit : '';
                                    if (!(role + '_' + write + '_' + read + '_' + type in this.elementStates)) {
                                        this.elementStates[role + '_' + write + '_' + read + '_' + type] = new ElementState(
                                            null,
                                            [],
                                            (tmpE && 'common' in tmpE) ? tmpE.common : {},
                                            this.levelStructService
                                        )
                                    }
                                    (this.elementStates[role + '_' + write + '_' + read + '_' + type] as ElementState).stateIDs.push(sID)
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
                                let unit = (tmpE && 'common' in tmpE && 'unit' in tmpE.common) ? tmpE.common.unit : '';
                                if (!(role + '_' + write + '_' + read + '_' + type in this.elementStates)) {
                                    this.elementStates[role + '_' + write + '_' + read + '_' + type] = new ElementState(
                                        null,
                                        [],
                                        (tmpE && 'common' in tmpE) ? tmpE.common : {},
                                        this.levelStructService
                                    )
                                }
                                (this.elementStates[role + '_' + write + '_' + read + '_' + type] as ElementState).stateIDs.push(sID)
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
        if (this.parentLS) {
            if (!this.parentLS.elementStates) {
                this.parentLS.elementStates = {};
            }
            Object.keys(this.elementStates).forEach(fmID => {
                if (!(fmID in this.parentLS.elementStates)) {
                    this.parentLS.elementStates[fmID] = this.elementStates[fmID];
                    this.parentLS.elementStates[fmID] = new ElementState(
                        (this.elementStates[fmID] as ElementState).selectValueSelection,
                        [],
                        (this.elementStates[fmID] as ElementState).common,
                        this.levelStructService
                    );
                }
                (this.parentLS.elementStates[fmID] as ElementState).stateIDs.push(...(this.elementStates[fmID] as ElementState).stateIDs);
                this.parentLS.elementStates[fmID].init();
            })
        }
        // init all ElementStates
        Object.values(this.elementStates).forEach(es => {
            es.init();
        });
    }

    public getName(): string | Object {
        return (this.parentMemberID) ? this.levelStructService.getNameFromID(this.parentMemberID) : this.levelStructService.getNameFromID(this.id);
    }

    public getParentMemberID(): string {
        return (this.parentMemberID) ? this.parentMemberID : this.id;
    }

    public getMembers(): ILevelStruct[] {
        return this.members.sort((a, b) => {
            
            var nameA = a.getParentMemberID().toUpperCase(); // Groß-/Kleinschreibung ignorieren
            var nameB = b.getParentMemberID().toUpperCase(); // Groß-/Kleinschreibung ignorieren
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // Namen müssen gleich sein
            return 0;
        })
    }

    public hasMembers(): boolean {
        return (this.members && this.members.length > 0);
    }
}

export class ElementState implements IElementState {

    public value$: Observable<number | string | boolean>;
    private subscription: Subscription;
    public uniqID: string;

    constructor(
        public selectValueSelection: string,
        public stateIDs: string[],
        public common: {
            role?: string;
            write?: boolean;
            read?: boolean;
            type?: string;
            unit?: string;
            desc?: string;
            min?: number;
            max?: number;
        },
        private levelStructService: LevelStructService,
    ) {
        this.uniqID = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    }

    public init() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.value$ = this.selectValue();
        // if(this.stateIDs.includes('sonoff.0.shelly_licht_office.POWER')){
        //     this.value.subscribe(e => console.log(this.stateIDs, e))
        // }
    }

    private selectValue(): Observable<number | string | boolean> {
        let tmpVal: number | string | boolean;
        let subject = new BehaviorSubject<number | string | boolean>(tmpVal);
        let tmpFunction;
        if (this.selectValueSelection in this.valueCalculators) {
            tmpFunction = this.valueCalculators[this.selectValueSelection];
        }
        else if (this.common.role in this.valueCalculators) {
            tmpFunction = this.valueCalculators[this.common.role];
        }
        else if (this.common.type in this.valueCalculators) {
            tmpFunction = this.valueCalculators[this.common.type];
        }
        else if (typeof tmpVal[0] in this.valueCalculators) {
            tmpFunction = this.valueCalculators[typeof tmpVal[0]];
        }
        else {
            tmpFunction = () => { return undefined };
        }
        this.subscription = this.levelStructService.stateQuery.selectMany(this.stateIDs, (entity: IoBState) => entity.val).
            subscribe((values: (string | number | boolean)[]) => {
                subject.next(tmpFunction(values));
            })
        return subject.asObservable();
    };

    public getSelectValueSelection(): string {
        return this.selectValueSelection;
    }

    public getSelectValueSelectionName(): string | Object {
        return this.levelStructService.getNameFromID(this.selectValueSelection);
    }

    public getStateIDs(): string[] {
        return this.stateIDs;
    }

    public getRole(): string {
        return this.common.role;
    }

    public getWrite(): boolean {
        return this.common.write;
    }

    public getRead(): boolean {
        return this.common.read;
    }

    public getType(): string {
        return this.common.type;
    }

    public getUnit(): string {
        return this.common.unit;
    }

    public getBase64IconNeutral(size?: number): string {
        return this._getBase64Icon('default', size);
    }

    public getBase64IconOn(size?: number): string {
        return this._getBase64Icon(true, size);
    }

    public getBase64IconOff(size?: number): string {
        return this._getBase64Icon(false, size);
    }

    private _getBase64Icon(fall?: boolean | string, size?: number): string {
        if (fall === undefined || fall === null) {
            fall = 'neutral';
        }
        if (size === undefined || size === null) {
            size = 20;
        }
        let iconName = 'icon_' + fall + '_' + size;
        let tmpEnum = this.levelStructService.enumQuery.getEntity(this.selectValueSelection);
        if (iconName in tmpEnum.common) {
            return tmpEnum.common[iconName];
        }
        iconName = 'icon_' + fall + '_' + 20;
        if (iconName in tmpEnum.common) {
            return tmpEnum.common[iconName];
        }
        iconName = 'icon_' + 'neutral' + '_' + size;
        if (iconName in tmpEnum.common) {
            return tmpEnum.common[iconName];
        }
        iconName = 'icon_' + 'neutral' + '_' + 20;
        if (iconName in tmpEnum.common) {
            return tmpEnum.common[iconName];
        }
        return tmpEnum.common.icon;
    }

    public getBase64Icon(fall?: boolean | string, size?: number): string {
        return this._getBase64Icon(fall, size);
    }

    public setNewState(value: number | string | boolean) {
        try {
            if (!this.common.write) { return }
            if (typeof value !== this.common.type) { return }
            this.levelStructService.helperService.functionToggle(this.stateIDs, value);
        } catch (e) {
            return
        }
    }

    private valueCalculators = {
        'enum.functions.batterie': (values: number[]): boolean => {
            return !values.some(e => e < 20);
        },
        'enum.functions.hum': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'enum.functions.temp': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'enum.functions.pressure': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'enum.functions.low_batterie': (values: number[]): boolean => {
            return values.some(e => e === 1);
        },
        'enum.functions.light': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'enum.functions.window': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'enum.functions.doors': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'enum.functions.motion': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'enum.functions.rain': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'enum.functions.wind_': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'switch': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'number': (values: number[]): number => {
            return this.getAvarage(values);
        },
        'boolean': (values: boolean[]): boolean => {
            return this.hasTrue(values);
        },
        'string': (): string => {
            return this.stateIDs[0]
        },
    }

    private getAvarage(values: number[]): number {

        const round = (x, n) => {
            var a = Math.pow(10, n);
            return (Math.round(x * a) / a);
        }
        if (!values || !isArray(values) || values.length === 0) {
            return 0;
        }
        let sum = values.reduce((previous, current) => current += previous);
        return round(sum / values.length, 1);
    }

    private hasTrue(values: boolean[]): boolean {
        return values.some(e => e);
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
        public stateQuery: IoBStateQuery,
        public iconsService: IconsService,
        public helperService: HelperService,
    ) { }

    public transformLevelObjectToLevelStruct(lo: IInputLevelObject, valueSelectionID: string, valueSelectionFilters: string[]): Observable<ILevelStruct> {

        // console.log([...new Set(this.objectQuery.getAll().map((e: IoBObject) => (e.common.role) ? e.common.role : '').filter((e: string) => (e !== '')))]);
        // let tmpTypes = {}
        // this.objectQuery.getAll().forEach((e: IoBObject) => {
        //     if (e.common.type) {
        //         if (!(e.common.type in tmpTypes)) {
        //             tmpTypes[e.common.type] = [];
        //         }
        //         tmpTypes[e.common.type].push(e.id);
        //     }
        // })
        // console.log(tmpTypes);
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
    public getNameFromID(id: string): string | object {
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
