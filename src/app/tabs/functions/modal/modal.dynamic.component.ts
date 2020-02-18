import { Component, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { AdminLevelStructService} from '../admin.level.struct.service';
import { IInputLevelObject, IAdminLevelStruct, levelIDCases } from '../level.struct.model';
import { LevelStructService } from '../level.struct.service';

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

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        public adminLevelStructService: AdminLevelStructService,
        public levelStructService: LevelStructService,
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

    CTRLpreview(){
        let temp = this.levelStructService.transformLevelObjectToLevelStruct(
            this.adminLevelStructService.CTRLgetLevelObjectFromAdminLevelStruct(this.adminLevelStruct),
            this.valueSelectionID,
            this.valueSelectionFilters,
        )
        console.log(temp);
    }
}