import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { IObjectViewInputDev} from '../function.model'

interface rowStruct {
    id: string;
    name: string | object;
    selected: boolean;
}

export enum TemplatesToShow {
    row1,
    row2,
    functions,
}

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    // Data passed in by componentProps
    @Input() inputDev: IObjectViewInputDev

    row1FilterSelection: rowStruct[] = [];
    functionFilterSelection: rowStruct[] = [];


    templateToShow = TemplatesToShow.row1;

    allName = {
        en: 'All Devices',
        de: 'Alle Geräte',
    }

    title = 'Filter'

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        private enumQuery: IoBEnumQuery,
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.row1FilterSelection = this.getRowFilterSelection(this.inputDev.viewInputStructDev.objectID);
        this.functionFilterSelection = this.getFunctionFilterSelection();
    }

    async dismiss() {
        this.inputDev.viewInputStructDev.subObjectFilteredID = this.row1FilterSelection.filter(entity => entity.selected).map( entity => entity.id);
        this.inputDev.functionFilter = this.functionFilterSelection.filter(entity => entity.selected).map(entity => entity.id);
        // console.log(this.inputDev)
        await this.modalController.dismiss(this.inputDev);
    }

    getRowName(id) {
        if (id === 'all') {
            return this.helperService.getByLanguage(this.allName);
        }
        return this.helperService.getByLanguage(this.enumQuery.getEntity(id).common.name);
    }

    row1SelectChanged(e) {
        if(e.detail.value !== this.inputDev.viewInputStructDev.objectID){
            this.inputDev.viewInputStructDev.objectID = e.detail.value;
            this.row1FilterSelection = this.getRowFilterSelection(this.inputDev.viewInputStructDev.objectID);
        }
    }

    getRowFilterSelection(rowID): rowStruct[] {
        if (rowID === "all") {
            return [];
        }
        return this.enumQuery.getAll({ filterBy: entity => entity.id.startsWith(rowID + ".") }).map(entity => {
            let tmpFilter = this.inputDev.viewInputStructDev.subObjectFilteredID;
            return {
                id: entity.id,
                name: entity.common.name,
                selected: (tmpFilter && tmpFilter.length >0) ? tmpFilter.includes(entity.id) : true,
            }
        });
    }

    getFunctionFilterSelection(): rowStruct[] {
        return this.enumQuery.getAll({filterBy: entity => entity.id.startsWith("enum.functions.") && entity.common.members.length > 0 })
            .map(entity => {
                return {
                    id: entity.id,
                    name: entity.common.name,
                    selected: this.inputDev.functionFilter.includes(entity.id),
                }
            });
    }

    getRows2ToSelect(): string[]{
        return this.inputDev.viewInputStructDev.filterChildViewFunction(this.inputDev.viewInputStructDev.objectID, this.inputDev.viewInputStructDev);
    }
}