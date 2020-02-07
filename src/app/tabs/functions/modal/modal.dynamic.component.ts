import { Component, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController, NavController } from '@ionic/angular';
import { LevelStructService, IInputLevelStruct, IInputLevelObject } from '../level.struct.service';
import { inspect } from 'util';

export enum TemplatesToShow {
    row1,
    row2,
    functions,
}

@Component({
    selector: 'app-modal-dynamic',
    templateUrl: './modal.dynamic.component.html',
    styleUrls: ['./modal.dynamic.component.scss']
})
export class ModalDynamicComponent implements OnInit {

    // Data passed in by componentProps
    @Input() inputLevelObject: IInputLevelObject;
    // @Input() valueSelectionID: string;
    @ViewChild('valueSelctionHTML', { static: false }) valueSelctionHTML: Selection;

    inputLevelStruct: IInputLevelStruct;
    tmpInputLevelStruct: {} = {};
    tmpInputLevelString: string = '';

    valueSelectionID: string;
    valueSelectionIds: { id: string; name: string | object; type: string }[] = [];
    valueSelectionAvailableFilters: { id: string; name: string | object; type: string }[];
    valueSelectionFilter: string[];


    templateToShow = TemplatesToShow.row1;

    title = 'Filter'

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        private levelStructService: LevelStructService,
        private navCtrl: NavController,
    ) { }

    ngOnInit() { }

    ionViewWillEnter() {
        this.initRootInputLevelStruct();
        this.initValueSelection();
    }

    initRootInputLevelStruct(){
        if (this.inputLevelObject === undefined || this.inputLevelObject === null) {
            this.inputLevelStruct = { level: 0, parent: null }
        } else {
            this.inputLevelStruct = this.levelStructService.getInputLevelStructFromInputLevelObject(this.inputLevelObject);
        }
        this.inputLevelStruct.availableLevelIDs = this.levelStructService.getAllRootLevelIDs();
    }

    initValueSelection(){
        this.valueSelectionIds = this.levelStructService.getAllRootLevelIDs('enum');
    }

    async dismiss() {
        // console.log(this.inputDev)
        await this.modalController.dismiss('bla');
    }

    levelSelectChanged(e, inputLevelStruct: IInputLevelStruct) {
        if (e.detail.value && e.detail.value.id && e.detail.value.id !== inputLevelStruct.id) {
            inputLevelStruct.id = e.detail.value.id;
            // inputLevelStruct.name = e.detail.value.name;
            inputLevelStruct.subLevelFilters = [];
            inputLevelStruct.subLevel = null;
            inputLevelStruct.subLevelAvailableFilters = this.levelStructService.getSubLevelAvailableFilters(inputLevelStruct, this.valueSelectionID, this.valueSelectionFilter);
        }
    }

    subLevelFilterChanged(e, inputLevelStruct: IInputLevelStruct) {
        if (e.detail.value && Array.isArray(e.detail.value)) {
            inputLevelStruct.subLevelFilters = e.detail.value.id;
            inputLevelStruct.subLevel = null;
        }
    }

    isSelected(id1, id2) {
        return id1 === id2;
    }

    isSelected1(id1: string, arr: string[]) {
        return (arr) ? arr.some(e => e == id1) : false
    }

    valueSelectionChanged(e) {
        if (e.detail && 'id' in e.detail.value) {
            this.resetInputLevelStruct();
            if (this.valueSelctionHTML) {
                this.valueSelctionHTML['value'] = []
            }
            this.valueSelectionID = e.detail.value.id;
            this.valueSelectionFilter = [];
            this.valueSelectionAvailableFilters = this.levelStructService.getSubLevelAvailableFilters({ id: this.valueSelectionID, level: 0, parent: null });
            this.inputLevelStruct.availableLevelIDs = this.levelStructService.getAllRootLevelIDs(null, this.valueSelectionID);
        }
    }

    valueSelectionFilterChanged(e) {
        if (e.detail.value && Array.isArray(e.detail.value)) {
            this.resetInputLevelStruct();
            this.valueSelectionFilter = e.detail.value.map(e => e.id);
            this.inputLevelStruct.availableLevelIDs = this.levelStructService.getAllRootLevelIDs(null, this.valueSelectionID, this.valueSelectionFilter);
        }
    }

    resetAll(){
        this.inputLevelObject = null;
        this.resetInputLevelStruct();
        this.resetValueSelection();
    }

    resetInputLevelStruct() {
        this.inputLevelObject = null;
        this.initRootInputLevelStruct();
        // this.inputLevelStruct = null;
        // this.inputLevelStruct = { level: 0, parent: this.inputLevelStruct };
        // this.inputLevelStruct.availableLevelIDs = this.levelStructService.getAllRootLevelIDs();
    }

    resetValueSelection(){
        this.valueSelectionID = '';
        this.valueSelectionIds = [];
        this.valueSelectionAvailableFilters = [];
        this.valueSelectionFilter = [];
        this.initValueSelection();
    }

    getLevelStructGenerator(): IInputLevelStruct[] {
        let ilsArr: IInputLevelStruct[] = []
        let parentLevel: IInputLevelStruct = this.inputLevelStruct;
        while (parentLevel) {
            ilsArr.push(parentLevel);
            parentLevel = (parentLevel && 'subLevel' in parentLevel) ? parentLevel.subLevel : null;
        }
        return ilsArr;
    }

    deleteLevelBtPressed(inputLevelStruct: IInputLevelStruct) {
        if (this.inputLevelStruct.level === inputLevelStruct.level) {
            this.resetInputLevelStruct();
        } else {
            this.deleteLevel(this.inputLevelStruct, inputLevelStruct.level);
        }
    }

    addLevel(inputLevelStruct: IInputLevelStruct) {
        inputLevelStruct.subLevel = { level: inputLevelStruct.level + 1, parent: inputLevelStruct };
        let tmp = this.levelStructService.getAllAvailableSubLevelIDs(inputLevelStruct, this.valueSelectionID, this.valueSelectionFilter);
        console.log(tmp)
        inputLevelStruct.subLevel.availableLevelIDs = tmp;

    }

    deleteLevel(parentLevel: IInputLevelStruct, level: number) {
        if ('subLevel' in parentLevel) {
            if (parentLevel.subLevel.level === level) {
                delete parentLevel.subLevel;
                return;
            }
            this.deleteLevel(parentLevel.subLevel, level);
        }
        return;
    }

    generateInputLevelStructSting() {
        this.tmpInputLevelStruct  = this.levelStructService.getInputLevelObjectFromInputLevelStruct(this.inputLevelStruct)
        this.tmpInputLevelString = JSON.stringify(this.tmpInputLevelStruct, null, 2);
        console.log(this.tmpInputLevelStruct);
        console.log(this.tmpInputLevelString);
        console.log(JSON.stringify(this.valueSelectionIds))
    }
}