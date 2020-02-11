import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { LevelStructService, IInputLevelStruct, IInputLevelObject, levelIDCases } from '../level.struct.service';

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

    inputLevelStruct: IInputLevelStruct;
    tmpInputLevelStruct: {} = {};
    tmpInputLevelString: string = '';

    valueSelectionAvailableIds: string[] = [];
    valueSelectionAvailableFilters: string[];


    templateToShow = TemplatesToShow.row1;

    title = 'Filter'

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        public levelStructService: LevelStructService,
        private ngZone: NgZone,
    ) { }

    ngOnInit() { }

    ionViewWillEnter() {
        // this.inputLevelObject = null;
        // this.valueSelectionID = null;
        // this.valueSelectionFilters = null;
        this.initValueSelection();
        // this.levelStructService.test();
    }

    private initValueSelection() {
        this.valueSelectionAvailableIds = this.levelStructService.getAllRootEnumIDS();
        if (this.valueSelectionID && this.valueSelectionID !== '') {
            this.valueSelectionAvailableFilters = this.levelStructService.getAllValueSelectionAvailableFilterIDS(this.valueSelectionID, exclusion);
        } else {
            this.valueSelectionID = '';
            this.valueSelectionAvailableFilters = [];
        }
        if (this.valueSelectionFilters) {

        } else {
            this.valueSelectionFilters = [];
        }
        this.initRootInputLevelStruct();
    }

    private initRootInputLevelStruct() {
        this.inputLevelStruct === null;
        if (this.inputLevelObject === undefined || this.inputLevelObject === null) {
            this.inputLevelStruct = { level: 0, parent: null }
            this.inputLevelStruct.availableLevelIDs = this.levelStructService.getAllPossibleLevelIDS(
                this.inputLevelStruct, this.valueSelectionID, this.valueSelectionFilters, exclusion);
        } else {
            this.inputLevelStruct = this.levelStructService.getInputLevelStructFromInputLevelObject(
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
        // console.log(this.inputDev)
        await this.modalController.dismiss('bla');
    }

    CTRLsubLevelFilterChanged(e, inputLevelStruct: IInputLevelStruct) {
        if (e.detail.value && Array.isArray(e.detail.value)) {
            inputLevelStruct.subLevelFilters = e.detail.value;
            inputLevelStruct.subLevel = null;
        }
    }

    CTRLlevelIDChanged(e, inputLevelStruct: IInputLevelStruct) {
        if (e.detail.value && e.detail.value !== inputLevelStruct.id) {
            inputLevelStruct.id = e.detail.value;
            // inputLevelStruct.name = e.detail.value.name;
            inputLevelStruct.subLevelFilters = [];
            inputLevelStruct.subLevel = null;
            inputLevelStruct.subLevelAvailableFilters = this.levelStructService.getSubLevelAvailableFilterIDSByInputStruct(
                inputLevelStruct,
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

    CTRLgetLevelStructGenerator(): IInputLevelStruct[] {
        let ilsArr: IInputLevelStruct[] = []
        let parentLevel: IInputLevelStruct = this.inputLevelStruct;
        while (parentLevel) {
            ilsArr.push(parentLevel);
            parentLevel = (parentLevel && 'subLevel' in parentLevel) ? parentLevel.subLevel : null;
        }
        return ilsArr;
    }

    CTRLaddLevel(inputLevelStruct: IInputLevelStruct) {
        inputLevelStruct.subLevel = { level: inputLevelStruct.level + 1, parent: inputLevelStruct };
        inputLevelStruct.subLevel.availableLevelIDs = this.levelStructService.getAllPossibleLevelIDS(
            inputLevelStruct.subLevel,
            this.valueSelectionID,
            this.valueSelectionFilters,
            exclusion);

    }

    CTRLdeleteLevel(levelStruct: IInputLevelStruct) {
        if (levelStruct.parent) {
            delete levelStruct.parent.subLevel;
        } else {
            this.initValueSelection();
        }
    }

    CTRLgenerateInputLevelStructSting() {
        this.tmpInputLevelStruct = this.levelStructService.CTRLgetInputLevelObjectFromInputLevelStruct(this.inputLevelStruct)
        this.tmpInputLevelString = JSON.stringify(this.tmpInputLevelStruct, null, 2);
        // console.log(this.tmpInputLevelStruct);
        console.log(this.tmpInputLevelString);
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
}