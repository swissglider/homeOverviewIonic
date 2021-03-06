import { Injector, Injectable, NgZone, OnDestroy } from "@angular/core";
import { ILevelStruct, ElementStates, IInputLevelObject, levelIDCases, IElementState } from './level.struct.model';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { IoBEnum } from '../../../app/store/enum/io-benum.model';
import { IoBObject } from '../../../app/store/object/io-bobject.model';
import { IoBState } from '../../../app/store/state/io-bstate.model';
import { IoBEnumQuery } from '../../../app/store/enum/io-benum.query';
import { IoBObjectQuery } from '../../../app/store/object/io-bobject.query';
import { distinctUntilChanged } from 'rxjs/operators';
import { IoBStateQuery } from '../../../app/store/state/io-bstate.query';
import { NewIOBStateStore } from '../../../app/store/newstate/new-iobstate.store';
import { wholeClassMeasureTime } from '../../decorator/timeMeasure.decorator';
import { ErrorMsgStore } from 'src/app/homeoverview/app/store/error/error-msg.store';
import { ErrorMsgSeverity, ErrorMsgScope, ErrorMsgLogging } from 'src/app/homeoverview/app/store/error/error-msg.model';



export class ServiceLocator {
    static injector: Injector;
}

export enum levelIDType {
    noneType = 0,
    enumType = 1,
    objectType = 2,
    stringType = 3, // levelIDCases
}

const BATTERYPERCLOW: number = 20;

/**
 * Creates an empty/base IInputLevelStruct to be used for example in a Form to select the Levels
 * Creates an IInputLevelStruct from HTML Input values
 * Creates an ILevelStruct from a IInputLevelStruct
 */
@Injectable({
    providedIn: 'root'
})
@wholeClassMeasureTime({ print: false })
export class LevelStructService implements OnDestroy {

    private _LevelStructs: { [key: string]: { ls: LevelStruct; sub$: BehaviorSubject<ILevelStruct>; subscribtions: Subscription[] } } = {};
    constructor(
        public enumQuery: IoBEnumQuery,
        public objectQuery: IoBObjectQuery,
        public stateQuery: IoBStateQuery,
        public newIoBStateStore: NewIOBStateStore,
        public errorStateSotre: ErrorMsgStore,
        // public iconsService: IconsService,
        // public helperService: HelperService,
        // private ioBrokerService: IOBrokerService,
        public ngZone: NgZone,
    ) { }

    ngOnDestroy() {
        // Object.values(this._LevelStructs).forEach(e => { e.subscribtions.forEach(s => s.unsubscribe()); e.sub$.complete(); e.ls.destroy();})
        // Object.keys(this._LevelStructs).forEach(e => delete this._LevelStructs[e])
        Object.keys(this._LevelStructs).forEach(e => this.destroyLSByKey(e));
    }

    public transformLevelObjectToLevelStruct(lo: IInputLevelObject, valueSelectionID: string, valueSelectionFilters: string[]): Observable<ILevelStruct> {

        let key = JSON.stringify(lo) + valueSelectionID + JSON.stringify(valueSelectionFilters);
        if (key in this._LevelStructs) {
            return this._LevelStructs[key].sub$.asObservable();
        }
        this._LevelStructs[key] = {
            ls: new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null),
            sub$: new BehaviorSubject<ILevelStruct>(undefined),
            subscribtions: [],
        }
        this._LevelStructs[key].sub$.next(this._LevelStructs[key].ls);
        let tempSub = this.enumQuery.selectEntityAction().subscribe(action => {
            if (key in this._LevelStructs) {
                this._LevelStructs[key].ls.destroy();
            }
            let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
            if (!this._LevelStructs) {
                this.errorStateSotre.addNewErrorMsg({
                    errorcode: "LSST-05101",
                    severity: ErrorMsgSeverity.ERROR,
                    text: '_Levelstruct null : ' + key,
                    action: '',
                    scope: ErrorMsgScope.LOCAL,
                    // stack: new Error().stack,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
            else if (!(key in this._LevelStructs)) {
                this._LevelStructs[key] = {
                    ls: null,
                    sub$: null,
                    subscribtions: [tempSub],
                }
            } else if (!('ls' in this._LevelStructs[key])) {
                this.errorStateSotre.addNewErrorMsg({
                    errorcode: "LSST-05102",
                    severity: ErrorMsgSeverity.ERROR,
                    text: 'ls nicht in _Levelstruct: ' + key,
                    action: '',
                    scope: ErrorMsgScope.LOCAL,
                    // stack: new Error().stack,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
            this._LevelStructs[key].ls = t;
            this._LevelStructs[key].sub$.next(this._LevelStructs[key].ls);
        });
        this._LevelStructs[key].subscribtions.push(tempSub);
        let tempSub2 = this.objectQuery.selectEntityAction().subscribe(action => {
            if (key in this._LevelStructs) {
                this._LevelStructs[key].ls.destroy();
            }
            let t = new LevelStruct(lo, valueSelectionID, valueSelectionFilters, this, null, null);
            if (!this._LevelStructs) {
                this.errorStateSotre.addNewErrorMsg({
                    errorcode: "LSST-05111",
                    severity: ErrorMsgSeverity.ERROR,
                    text: '_Levelstruct null : ' + key,
                    action: '',
                    scope: ErrorMsgScope.LOCAL,
                    // stack: new Error().stack,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
            else if (!(key in this._LevelStructs)) {
                this._LevelStructs[key] = {
                    ls: null,
                    sub$: null,
                    subscribtions: [tempSub2],
                }
            } else if (!('ls' in this._LevelStructs[key])) {
                this.errorStateSotre.addNewErrorMsg({
                    errorcode: "LSST-05112",
                    severity: ErrorMsgSeverity.ERROR,
                    text: 'ls nicht in _Levelstruct: ' + key,
                    action: '',
                    scope: ErrorMsgScope.LOCAL,
                    // stack: new Error().stack,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
            this._LevelStructs[key].ls = t;
            this._LevelStructs[key].sub$.next(this._LevelStructs[key].ls);
        });
        this._LevelStructs[key].subscribtions.push(tempSub2);

        return this._LevelStructs[key].sub$.asObservable();
    }

    public destroyLS(lo: IInputLevelObject, valueSelectionID: string, valueSelectionFilters: string[]) {
        let key = JSON.stringify(lo) + valueSelectionID + JSON.stringify(valueSelectionFilters);
        this.destroyLSByKey(key);
    }

    private destroyLSByKey(key) {
        this._LevelStructs[key].subscribtions.forEach(s => s.unsubscribe());
        this._LevelStructs[key].sub$.complete();
        this._LevelStructs[key].ls.destroy();
        delete this._LevelStructs[key];
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
        let performance = window.performance;
        switch (this.getLevelIDType(id)) {
            case levelIDType.enumType:
                let ret1 = this.enumQuery.getAllStatesRecursiveFromEnumID(id);  // <= performance issue
                return ret1;
            case levelIDType.objectType:
                let ret2 = this.objectQuery.getAllStatesIDWithinParentID(id);  // <= performance issue
                return ret2;
            case levelIDType.stringType:
                break;
            case levelIDType.noneType:
                return [];
        }
        return [];
    }
}

@wholeClassMeasureTime({ print: false })
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
        states?: string[],
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
        valueSelectionStates?: { states?: string[], subStates?: { [key: string]: string[] } },
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
            if (this.valueSelectionFilters && Array.isArray(this.valueSelectionFilters) && this.valueSelectionFilters.length > 0) {
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

        let withSubFilter = this.lo && 'subLevelFilters' in this.lo && Array.isArray(this.lo.subLevelFilters) && this.lo.subLevelFilters.length > 0;
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
        if (this._batteryOk$) { this._batteryOk$.complete(); this._batteryOk$.observers.forEach(e => { e.complete() }) }
        if (this._batteryNotOkIDs$) { this._batteryNotOkIDs$.complete(); this._batteryNotOkIDs$.observers.forEach(e => { e.complete() }) }
        this._batteryOk$ = new BehaviorSubject<{ value: boolean }>({ value: tmpVal });
        this._batteryNotOkIDs$ = new BehaviorSubject<{ value: string[] }>({ value: [] });
        if ('enum.functions.low_batterie' in this.elementStates && 'enum.functions.batterie' in this.elementStates) {
            let lowBat$ = this.elementStates['enum.functions.low_batterie'].valueS$; // true = bad / false = good
            let bat$ = this.elementStates['enum.functions.batterie'].valueS$; // true = good / false = bad
            let tt$ = combineLatest(lowBat$, bat$);
            this.batteryOkSubscription = tt$.pipe(distinctUntilChanged()).subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (!p[0].value && p[1].value) ? true : false
                    if (!this._batteryOk) {
                        let _ids: string[] = [];
                        this.elementStates['enum.functions.low_batterie'].getStateIDs().forEach(id => {
                            if (this.levelStructService.stateQuery.getEntity(id).val === true) {
                                _ids.push(id);
                            }
                        });
                        this.elementStates['enum.functions.batterie'].getStateIDs().forEach(id => {
                            if (this.levelStructService.stateQuery.getEntity(id).val < BATTERYPERCLOW) {
                                _ids.push(id);
                            }
                        });
                        this._batteryNotOkIDs$.next({ value: [...new Set(_ids)] })
                    }
                    this._batteryOk$.next({ value: this._batteryOk });
                    this._batteryIcon = this.elementStates['enum.functions.batterie'].getBase64Icon(this._batteryOk);
                });
            });
        }
        else if ('enum.functions.low_batterie' in this.elementStates) {
            let lowBat$ = this.elementStates['enum.functions.low_batterie'].valueS$; // true = bad / false = good
            this.batteryOkSubscription = lowBat$.pipe(distinctUntilChanged()).subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (!p.value) ? true : false
                    if (!this._batteryOk) {
                        let _ids: string[] = [];
                        this.elementStates['enum.functions.low_batterie'].getStateIDs().forEach(id => {
                            if (this.levelStructService.stateQuery.getEntity(id).val === true) {
                                _ids.push(id);
                            }
                        });
                        this._batteryNotOkIDs$.next({ value: [...new Set(_ids)] })
                    }
                    this._batteryOk$.next({ value: this._batteryOk });
                    this._batteryIcon = this.elementStates['enum.functions.low_batterie'].getBase64Icon(this._batteryOk);
                });
            });
        }
        else if ('enum.functions.batterie' in this.elementStates) {
            let bat$ = this.elementStates['enum.functions.batterie'].valueS$; // true = bad / false = good
            this.batteryOkSubscription = bat$.pipe(distinctUntilChanged()).subscribe(p => {
                this.levelStructService.ngZone.run(() => {
                    this._batteryOk = (p.value) ? true : false
                    if (!this._batteryOk) {
                        let _ids: string[] = [];
                        this.elementStates['enum.functions.batterie'].getStateIDs().forEach(id => {
                            if (this.levelStructService.stateQuery.getEntity(id).val < BATTERYPERCLOW) {
                                _ids.push(id);
                            }
                        });
                        this._batteryNotOkIDs$.next({ value: [...new Set(_ids)] })
                    }
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

    public destroy() {
        // ..
        // console.log('LevelStruct: destroy : ', this.id)
        if (this._batteryOk$) { this._batteryOk$.complete(); this._batteryOk$.observers.forEach(e => { e.complete() }) }
        if (this._batteryNotOkIDs$) { this._batteryNotOkIDs$.complete(); this._batteryNotOkIDs$.observers.forEach(e => { e.complete() }) }
        if (this.batteryOkSubscription) { this.batteryOkSubscription.unsubscribe(); }

        this.members.forEach((e: LevelStruct) => e.destroy());
        Object.values(this.elementStates).forEach((e: ElementState) => e.destroy());

        // public elementStates: ElementStates;
    }
}

@wholeClassMeasureTime({ print: false })
export class ElementState implements IElementState {

    private subscription: Subscription;
    private subject: BehaviorSubject<number | string | boolean>;
    private subscriptionS: Subscription;
    private subjectS: BehaviorSubject<{ value: number | string | boolean }>;
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

    public destroy() {
        // console.log('ElementState: destroy : ', this.uniqID)
        if (this.subscription) { this.subscription.unsubscribe(); }
        if (this.subject) { this.subject.complete; }
        if (this.subscriptionS) { this.subscriptionS.unsubscribe(); }
        if (this.subjectS) { this.subjectS.complete; }
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
            this.levelStructService.newIoBStateStore.functionToggle(this.stateIDs, value);
        } catch (e) {
            return
        }
    }

    public init() {
        if (this.subscriptionS) {
            this.subscriptionS.unsubscribe();
        }
        this.value$ = this.selectValueInit();
        this.valueS$ = this.selectValueSInit();
    }

    private selectValueInit(): Observable<number | string | boolean> {
        if (this.subscription) { this.subscription.unsubscribe(); }
        if (this.subject) { this.subject.complete; }
        let tmpVal: number | string | boolean;
        this.subject = new BehaviorSubject<number | string | boolean>(tmpVal);
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
        this.subscription = this.levelStructService.stateQuery.selectMany(this.stateIDs, (entity: IoBState) => entity.val)
            .pipe(distinctUntilChanged()).subscribe((values: (string | number | boolean)[]) => {
                this.levelStructService.ngZone.run(() => {
                    this._value = tmpFunction(values);
                    this.subject.next(this._value);
                });
            })
        return this.subject.asObservable();
    };

    private selectValueSInit(): Observable<{ value: number | string | boolean }> {
        if (this.subscriptionS) { this.subscriptionS.unsubscribe(); }
        if (this.subjectS) { this.subjectS.complete; }
        let tmpVal: number | string | boolean;
        this.subjectS = new BehaviorSubject<{ value: number | string | boolean }>({ value: tmpVal });
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
        this.subscriptionS = this.levelStructService.stateQuery.selectMany(this.stateIDs, (entity: IoBState) => entity.val)
            .pipe(distinctUntilChanged()).subscribe((values: (string | number | boolean)[]) => {
                this.levelStructService.ngZone.run(() => {
                    this.subjectS.next({ value: tmpFunction(values) });
                });
            })
        return this.subjectS.asObservable();
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
            return !values.some(e => e < BATTERYPERCLOW);
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
        if (!values || !Array.isArray(values) || values.length === 0) {
            return 0;
        }
        let sum = values.reduce((previous, current) => current += previous);
        // return round(sum / values.length, 1);
        return sum / values.length;
    }

    private hasTrueInit(values: boolean[]): boolean {
        return values.some(e => e);
    }
}
