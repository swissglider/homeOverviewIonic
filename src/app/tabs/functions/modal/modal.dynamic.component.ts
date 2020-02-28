import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { AdminLevelStructService } from '../../../service/level.service/admin.level.struct.service';
import { IInputLevelObject, IAdminLevelStruct, levelIDCases, ILevelStruct, IElementState } from '../../../service/level.service/level.struct.model';
import { LevelStructService, levelIDType } from '../../../service/level.service/level.struct.service';
import { Observable, Subscription } from 'rxjs';

export enum TemplatesToShow {
    row1,
    row2,
    functions,
}

const exclusionO: string[] = [
    'node-red.0', 'admin.0', 'discovery.0', 'javascript.0', 'web.0', 'vis.0',
    'js2fs.0', 'info.0', 'backitup.0', 'simple-api.0', 'pushover.0', 'influxdb.0', 'homeoverview.0'];

const exclusion: string[] = [
    'node-red.0', 'admin.0', 'discovery.0', 'javascript.0', 'web.0', 'vis.0', 'js2fs.0', 'info.0',
];

@Component({
    selector: 'app-modal-dynamic',
    templateUrl: './modal.dynamic.component.html',
    styleUrls: ['./modal.dynamic.component.scss']
})
export class ModalDynamicComponent implements OnInit {

    // Data passed in by componentProps
    @Input() inputLevelObject: IInputLevelObject;
    @Input() valueSelectionID: string;
    @Input() valueSelectionFilters: string[];
    @ViewChild('HTMLvalueSelction', { static: false }) HTMLvalueSelction: Selection;
    @ViewChild('HTMLvalueSelctionID', { static: false }) HTMLvalueSelctionID: Selection;

    adminLevelStruct: IAdminLevelStruct;
    tmpAdminLevelStruct: {} = {};
    tmpAdminLevelString: string = '';

    valueSelectionAvailableIds: string[] = [];
    valueSelectionAvailableFilters: string[];


    templateToShow = TemplatesToShow.row1;

    title = 'Filter'

    levelStruct: ILevelStruct;
    public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];


    public html_panel_functions: string[] = [
        'enum.functions.batterie',
        'enum.functions.low_batterie',
        'enum.functions.light',
        'enum.functions.doors',
        'enum.functions.window',
        'enum.functions.motion',
    ]

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        public adminLevelStructService: AdminLevelStructService,
        public levelStructService: LevelStructService,
        private ngZone: NgZone,
    ) { }

    ngOnInit() { }

    ionViewWillEnter() {
        this.initValueSelection();
        // this.adminLevelStructService.test();
    }

    private initValueSelection() {
        this.valueSelectionAvailableIds = this.adminLevelStructService.getAllRootEnumIDS();
        if (this.valueSelectionID && this.valueSelectionID !== '') {
            this.valueSelectionAvailableFilters = this.adminLevelStructService.getAllValueSelectionAvailableFilterIDS(this.valueSelectionID, exclusion);
        } else {
            this.valueSelectionID = '';
            this.valueSelectionAvailableFilters = [];
        }
        if (this.valueSelectionFilters) {
        } else {
            this.valueSelectionFilters = [];
        }
        this.initRootAdminLevelStruct();
    }

    private initRootAdminLevelStruct() {
        this.adminLevelStruct === null;
        if (this.inputLevelObject === null) {
            this.adminLevelStruct = { level: 0, parent: null }
            this.adminLevelStruct.availableLevelIDs = this.adminLevelStructService.getAllPossibleLevelIDS(
                this.adminLevelStruct, this.valueSelectionID, this.valueSelectionFilters, exclusion);
        } else {
            this.adminLevelStruct = this.adminLevelStructService.getLevelStructFromAdminLevelObject(
                this.inputLevelObject, this.valueSelectionID, this.valueSelectionFilters, exclusion);
            this.inputLevelObject = null;
        }
    }

    private resetAll() {
        this.resetValueSelection();
    }

    private resetValueSelection() {
        this.valueSelectionID = null;
        this.valueSelectionAvailableIds = [];
        this.valueSelectionAvailableFilters = [];
        this.valueSelectionFilters = [];
        if (this.HTMLvalueSelctionID) {
            this.HTMLvalueSelctionID['value'] = '-'
        }
        this.initValueSelection();
    }

    async CTRLclose() {
        let returnArray = {
            inputLevelObject: this.adminLevelStructService.CTRLgetLevelObjectFromAdminLevelStruct(this.adminLevelStruct),
            valueSelectionID: this.valueSelectionID,
            valueSelectionFilters: this.valueSelectionFilters,
        }
        await this.modalController.dismiss(returnArray);
    }

    CTRLsubLevelFilterChanged(e, als: IAdminLevelStruct) {
        if (e.detail.value && Array.isArray(e.detail.value)) {
            als.subLevelFilters = e.detail.value;
            als.subLevel = null;
        }
    }

    CTRLlevelIDChanged(e, als: IAdminLevelStruct) {
        if (e.detail.value && e.detail.value !== als.id) {
            als.id = e.detail.value;
            als.subLevelFilters = [];
            als.subLevel = null;
            als.subLevelAvailableFilters = this.adminLevelStructService.getSubLevelAvailableFilterIDSByAdminStruct(
                als,
                this.valueSelectionID,
                this.valueSelectionFilters,
                exclusion);
        }
    }

    CRTLisSelected1(id1: string, arr: string[]) {
        return (arr) ? arr.some(e => e == id1) : false
    }

    CTRLvalueSelectionChanged(e) {
        this.valueSelectionID = e.detail.value;
        this.valueSelectionFilters = [];
        if (this.HTMLvalueSelction) {
            this.HTMLvalueSelction['value'] = []
        }

        if (e.detail.value === '-') {
            this.valueSelectionID = '';
        }
        this.initValueSelection();
    }

    CTRLvalueSelectionFilterChanged(e) {
        if (e.detail.value && Array.isArray(e.detail.value)) {
            if (this.valueSelectionFilters.length === e.detail.value.length && this.valueSelectionFilters.every((v, i) => v === e.detail.value[i])) {
                return;
            }
            this.valueSelectionFilters = e.detail.value;
            this.initValueSelection();
        }
    }

    CTRLresetAll() {
        this.resetAll();
    }

    CTRLgetLevelStructGenerator(): IAdminLevelStruct[] {
        let ilsArr: IAdminLevelStruct[] = []
        let parentLevel: IAdminLevelStruct = this.adminLevelStruct;
        while (parentLevel) {
            ilsArr.push(parentLevel);
            parentLevel = (parentLevel && 'subLevel' in parentLevel) ? parentLevel.subLevel : null;
        }
        return ilsArr;
    }

    CTRLaddLevel(als: IAdminLevelStruct) {
        als.subLevel = { level: als.level + 1, parent: als };
        als.subLevel.availableLevelIDs = this.adminLevelStructService.getAllPossibleLevelIDS(
            als.subLevel,
            this.valueSelectionID,
            this.valueSelectionFilters,
            exclusion);

    }

    CTRLdeleteLevel(levelStruct: IAdminLevelStruct) {
        if (levelStruct.parent) {
            delete levelStruct.parent.subLevel;
        } else {
            this.initValueSelection();
        }
    }

    CTRLgenerateAdminLevelStructSting() {
        this.tmpAdminLevelStruct = this.adminLevelStructService.CTRLgetLevelObjectFromAdminLevelStruct(this.adminLevelStruct)
        this.tmpAdminLevelString = JSON.stringify(this.tmpAdminLevelStruct, null, 2);
        console.log(this.tmpAdminLevelString);
        console.log(JSON.stringify(this.valueSelectionID));
        console.log(JSON.stringify(this.valueSelectionFilters));
    }

    CTRLgetObjectType(id: string): string {
        if (id.startsWith("enum.")) {
            return 'enum'
        }
        if (id in levelIDCases) {
            return ''
        }
        return 'Instance';
    }

    CTRLpreview() {
        let temp: Observable<ILevelStruct> = this.levelStructService.transformLevelObjectToLevelStruct(
            this.adminLevelStructService.CTRLgetLevelObjectFromAdminLevelStruct(this.adminLevelStruct),
            this.valueSelectionID,
            this.valueSelectionFilters,
        )
        temp.subscribe((e: ILevelStruct) => {
            this.levelStruct = e;
            this.templateToShow = 2;
            console.log(e)
        })
    }

    CTRLlog(s) {
        // console.log(s)
        return true;
    }

    CTRLsetValue(a: IElementState, levelStruct: ILevelStruct): boolean {
        if (!(a.uniqID in this.values)) {
            this.values[a.uniqID] = {};
            this.values[a.uniqID].subscription = a.value$.subscribe(e => {
                this.ngZone.run(() => {
                    this.values[a.uniqID].value = e;
                    // console.log(e, a.uniqID, this.helperService.getByLanguage(levelStruct.getName()))
                });
            });
        }
        return true;
    }

    CTRLsetAllValue(levelStruct: ILevelStruct): boolean {
        try {
            Object.values(levelStruct.elementStates).forEach((e: IElementState) => {
                if (!(e.uniqID in this.values)) {
                    this.values[e.uniqID] = {};
                    this.values[e.uniqID].subscription = e.value$.subscribe(val => {
                        this.ngZone.run(() => {
                            this.values[e.uniqID].value = val;
                        });
                    });
                }
            })
        } finally {
            return true;
        }
    }

    CTRLcheckIfIn(toCheck: string, arr: []): boolean {
        try {
            return (toCheck in arr) ? true : false;
        } catch (e) {
            return false;
        }
    }
}