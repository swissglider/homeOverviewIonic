import { Injector, Injectable, NgZone } from "@angular/core";
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { IoBObject } from '../../store/object/io-bobject.model';
import { IoBEnum } from '../../store/enum/io-benum.model';
import { Observable, BehaviorSubject, of, Subscription, concat, combineLatest } from 'rxjs';
import { isArray } from 'util';
import { IInputLevelObject, ILevelStruct, levelIDCases, ElementStates, IElementState } from './level.struct.model';
import { IoBStateQuery } from '../../store/state/io-bstate.query';
import { IoBState } from '../../store/state/io-bstate.model';
import { IconsService } from '../../service/icons.service';
import { HelperService } from '../../service/helper.service';
import { IOBrokerService } from '../io-broker.service';
import { distinctUntilChanged, takeLast, merge } from 'rxjs/operators';
import { IoBEnumState } from '../../store/enum/io-benum.store';


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
    public id: string;
    public level: number;
    public totalOpen = false;
    public detailOpen = false;
    public batteryOk$: Observable<{ value: boolean }>;
    public batteryNotOkIDs$: Observable<{ value: string[] }>;
    public elementStates: ElementStates;

    protected allFittingStates: string[];
    private members: ILevelStruct[];
    private valueSectionStates: {
        states?: string[]
        subStates?: {
            [key: string]: string[]
        }
    } = {}
    private batteryOkSubscription: Subscription;
    private _batteryOk$: BehaviorSubject<{ value: boolean }>;
    private _batteryNotOkIDs$: BehaviorSubject<{ value: string[] }>;

    private _base64Icon: string = '';
    private _hasNotUpdatedTS: boolean = false;
    private _notUpdatedStates: string[] = [];
    private _batteryOk: boolean = false;
    private _batteryNotOkIDs: string[] = [];
    private _batteryIcon: string = '';
    private _name: string | Object = '';


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
        return this._base64Icon;
    }

    public hasNotUpdatedSince1Month(): boolean {
        return this._hasNotUpdatedTS;
    }

    public getNotUpdatedSince1MonthIDs(): string[] {
        return this._notUpdatedStates
    }

    public getName(): string | Object {
        return this._name
    }

    public getParentMemberID(): string {
        return (this.parentMemberID) ? this.parentMemberID : this.id;
    }

    public getMembers(): ILevelStruct[] {
        return this.members;
    }

    public hasMembers(): boolean {
        return (this.members && this.members.length > 0);
    }

    public getBatteryIcon(): string {
        return this._batteryIcon;
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

        // sort members
        this.sortMembers();

        // *** init all values ***
        // _base64Icon
        this.generateBase64Icon();

        // _hasNotUpdatedTS - _notUpdatedStates
        this.generateNotUpdated();

        // _batteryOk - _batteryNotOkIDs - _batteryIcon
        this.generateBatteryOk()

        // _name
        this.generateName();

    }

    private generateBatteryOk() {
        if (this.batteryOkSubscription) {
            this.batteryOkSubscription.unsubscribe();
        }
        this.selectBatteryOk();
    }

    private selectBatteryOk() {
        let tmpVal: boolean;
        this._batteryOk$ = new BehaviorSubject<{ value: boolean }>({ value: tmpVal });
        this._batteryNotOkIDs$ = new BehaviorSubject<{ value: string[] }>({ value: [] });
        if ('enum.functions.low_batterie' in this.elementStates && 'enum.functions.batterie' in this.elementStates) {
            let lowBat$ = this.elementStates['enum.functions.low_batterie'].valueS$; // true = bad / false = good
            let bat$ = this.elementStates['enum.functions.batterie'].valueS$; // true = good / false = bad
            let tt$ = combineLatest(lowBat$, bat$);
            this.batteryOkSubscription = tt$.subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (!p[0].value && p[1].value) ? true : false
                    this._batteryOk$.next({ value: this._batteryOk });
                    this._batteryIcon = this.elementStates['enum.functions.batterie'].getBase64Icon(this._batteryOk);
                });
            });
        }
        else if ('enum.functions.low_batterie' in this.elementStates) {
            let lowBat$ = this.elementStates['enum.functions.low_batterie'].valueS$; // true = bad / false = good
            this.batteryOkSubscription = lowBat$.subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (!p.value) ? true : false
                    this._batteryOk$.next({ value: this._batteryOk });
                    this._batteryIcon = this.elementStates['enum.functions.low_batterie'].getBase64Icon(this._batteryOk);
                });
            });
        }
        else if ('enum.functions.batterie' in this.elementStates) {
            let bat$ = this.elementStates['enum.functions.batterie'].valueS$; // true = bad / false = good
            this.batteryOkSubscription = bat$.subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (p.value) ? true : false
                    this._batteryOk$.next({ value: this._batteryOk });
                    this._batteryIcon = this.elementStates['enum.functions.batterie'].getBase64Icon(this._batteryOk);
                });
            });
        } else {
            this.levelStructService.ngZone.run(() => {
                this._batteryOk = null
                this._batteryOk$.next({ value: this._batteryOk })
            });
        }

        this.batteryOk$ = this._batteryOk$.asObservable();
        this.batteryNotOkIDs$ = this._batteryNotOkIDs$.asObservable();
    }

    private generateBase64Icon() {
        try {
            this._base64Icon = this.levelStructService.enumQuery.getEntity(this.getParentMemberID()).common.icon;
        } catch (e) { }
    }

    private generateNotUpdated() {
        this._hasNotUpdatedTS = false;
        this._notUpdatedStates = [];
        Object.values(this.elementStates).forEach((e: IElementState) => {
            e.getStateIDs().forEach(id => {
                let tsE = this.levelStructService.stateQuery.getEntity(id);
                if (tsE.ts < Date.now() - (1000 * 60 * 60 * 24 * 15)) {
                    this._notUpdatedStates.push(id);
                    this._hasNotUpdatedTS = true;
                }
            });
        });
    }

    private generateName() {
        this._name = (this.parentMemberID) ? this.levelStructService.getNameFromID(this.parentMemberID) : this.levelStructService.getNameFromID(this.id);
    }

    private sortMembers() {
        this.members.sort((a, b) => {

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
}

export class ElementState implements IElementState {

    private subscription: Subscription;
    private subscriptionS: Subscription;
    private _valueSectionCommon: {};
    private _value: number | string | boolean

    public uniqID: string;
    public value$: Observable<number | string | boolean>;
    public valueS$: Observable<{ value: number | string | boolean }>;

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
        this._valueSectionCommon = this.levelStructService.enumQuery.getEntity(this.selectValueSelection).common;
    }

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

    public getBase64Icon(fall?: boolean | string, size?: number): string {
        return this._getBase64Icon(fall, size);
    }

    public toggleState() {
        if (this.getType() === 'boolean') {
            this.setNewState(!this._value);
        }
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

    public init() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.subscriptionS) {
            this.subscriptionS.unsubscribe();
        }
        this.value$ = this.selectValueInit();
        this.valueS$ = this.selectValueSInit();
    }

    private selectValueInit(): Observable<number | string | boolean> {
        let tmpVal: number | string | boolean;
        let subject = new BehaviorSubject<number | string | boolean>(tmpVal);
        let tmpFunction;
        if (this.selectValueSelection in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.selectValueSelection];
        }
        else if (this.common.role in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.common.role];
        }
        else if (this.common.type in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.common.type];
        }
        else if (typeof tmpVal[0] in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[typeof tmpVal[0]];
        }
        else {
            tmpFunction = () => { return undefined };
        }
        this.subscription = this.levelStructService.stateQuery.selectMany(this.stateIDs, (entity: IoBState) => entity.val).
            subscribe((values: (string | number | boolean)[]) => {
                this.levelStructService.ngZone.run(() => {
                    this._value = tmpFunction(values);
                    subject.next(this._value);
                });
            })
        return subject.asObservable();
    };

    private selectValueSInit(): Observable<{ value: number | string | boolean }> {
        let tmpVal: number | string | boolean;
        let subject = new BehaviorSubject<{ value: number | string | boolean }>({ value: tmpVal });
        let tmpFunction;
        if (this.selectValueSelection in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.selectValueSelection];
        }
        else if (this.common.role in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.common.role];
        }
        else if (this.common.type in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[this.common.type];
        }
        else if (typeof tmpVal[0] in this.valueCalculatorsInit) {
            tmpFunction = this.valueCalculatorsInit[typeof tmpVal[0]];
        }
        else {
            tmpFunction = () => { return undefined };
        }
        this.subscriptionS = this.levelStructService.stateQuery.selectMany(this.stateIDs, (entity: IoBState) => entity.val).
            subscribe((values: (string | number | boolean)[]) => {
                this.levelStructService.ngZone.run(() => {
                    subject.next({ value: tmpFunction(values) });
                });
            })
        return subject.asObservable();
    };

    private _getBase64Icon(fall?: boolean | string, size?: number): string {
        if (fall === undefined || fall === null) {
            fall = 'neutral';
        }
        if (size === undefined || size === null) {
            size = 20;
        }
        let iconName = 'icon_' + fall + '_' + size;
        if (iconName in this._valueSectionCommon) {
            return this._valueSectionCommon[iconName];
        }
        iconName = 'icon_' + fall + '_' + 20;
        if (iconName in this._valueSectionCommon) {
            return this._valueSectionCommon[iconName];
        }
        iconName = 'icon_' + 'neutral' + '_' + size;
        if (iconName in this._valueSectionCommon) {
            return this._valueSectionCommon[iconName];
        }
        iconName = 'icon_' + 'neutral' + '_' + 20;
        if (iconName in this._valueSectionCommon) {
            return this._valueSectionCommon[iconName];
        }
        return this._valueSectionCommon['icon'];
    }

    private valueCalculatorsInit = {
        'enum.functions.batterie': (values: number[]): boolean => {
            return !values.some(e => e < 20);
        },
        'enum.functions.hum': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'enum.functions.temp': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'enum.functions.pressure': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'enum.functions.low_batterie': (values: number[]): boolean => {
            return values.some(e => e === 1);
        },
        'enum.functions.light': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'enum.functions.window': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'enum.functions.doors': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'enum.functions.motion': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'enum.functions.rain': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'enum.functions.wind_': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'switch': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'number': (values: number[]): number => {
            return this.getAvarageInit(values);
        },
        'boolean': (values: boolean[]): boolean => {
            return this.hasTrueInit(values);
        },
        'string': (): string => {
            return this.stateIDs[0]
        },
    }

    private getAvarageInit(values: number[]): number {

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

    private hasTrueInit(values: boolean[]): boolean {
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
        private ioBrokerService: IOBrokerService,
        public ngZone: NgZone,
    ) { }

    public transformLevelObjectToLevelStruct(lo: IInputLevelObject, valueSelectionID: string, valueSelectionFilters: string[]): Observable<ILevelStruct> {
        let tmpSubscription = [];
        let subject = new BehaviorSubject<ILevelStruct>(undefined)
        this.ioBrokerService._loaded$.pipe(distinctUntilChanged()).subscribe(loaded => {
            if (loaded) {
                let tmpILevelStruct = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
                this.ngZone.run(() => {
                    subject.next(tmpILevelStruct);
                });
                tmpSubscription.push(this.enumQuery.selectEntityAction().subscribe(action => {
                    let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
                    this.ngZone.run(() => {
                        subject.next(t);
                    });
                }));
                tmpSubscription.push(this.objectQuery.selectEntityAction().subscribe(action => {
                    let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
                    this.ngZone.run(() => {
                        subject.next(t);
                    });
                }));
            }
        });
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
