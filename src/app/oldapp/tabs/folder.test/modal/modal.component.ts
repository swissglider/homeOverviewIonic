import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from '../../../service/helper.service';
import { ModalController } from '@ionic/angular';
import { IoBObjectQuery } from '../../../store/object/io-bobject.query';
import { IoBStateQuery } from '../../../store/state/io-bstate.query';
import { IOBrokerService, server_protocol, server_url, server_admin_port } from '../../../service/io-broker.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    base_url = server_protocol + '://' + server_url + ':' + server_admin_port + '/#tab-objects/editobject/';

    // Data passed in by componentProps
    @Input() objectID: string;
    // objectID: string = '0_userdata.0.example_state';
    templateToShow = 'general';
    state: {};
    object: {};
    relations: {}

    constructor(
        private modalController: ModalController,
        public helperService: HelperService,
        private objectQuery: IoBObjectQuery,
        private stateQuery: IoBStateQuery,
    ) {
        // componentProps can also be accessed at construction time using NavParams
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        if (this.objectQuery.hasEntity(this.objectID)) {
            this.object = JSON.parse(JSON.stringify(this.objectQuery.getEntity(this.objectID)));
        }
        if (this.stateQuery.hasEntity(this.objectID)) {
            this.state = JSON.parse(JSON.stringify(this.stateQuery.getEntity(this.objectID)));
        }
        this.relations = {
            aparents: {
                name: { de: 'Eltern-Objekte', en: 'Parent-Objects' },
                visible: false,
                values: {},
            },
            children: {
                name: { de: 'Kinder-Objekte', en: 'Child-Objects' },
                visible: false,
                values: {}
            },
            brothers: {
                name: { de: 'Bruder-Objekte', en: 'Brother-Objects' },
                visible: false,
                values: {}
            },
        };
        this.generateParents();
        this.generateChildren();
        this.generateBrothers();
    }

    async dismiss() {
        await this.modalController.dismiss();
    }

    async switchToObject(id) {
        if (this.objectQuery.hasEntity(id)) {
            await this.modalController.dismiss(id);
        }
    }

    onNavigate(url) {
        window.open(this.base_url + url, '_blank');
    }

    getTime(time) {
        return new Date(time).toLocaleString()
    }

    getMoreInfo(id) {}

    generateParents() {
        let parentsID = [];
        let tempID = this.objectID;
        while (tempID.split('.').length > 1) {
            tempID = tempID.substr(0, tempID.lastIndexOf("."));
            parentsID.unshift(tempID);
        }
        this.relations['aparents'].values = parentsID.map(e => this.getRelationObject(e));
    }

    generateChildren() {
        this.relations['children'].values = this.objectQuery.getDirectChildrenIDsByParentID(this.objectID).map(e => this.getRelationObject(e));
    }

    generateBrothers() {
        this.relations['brothers'].values = this.objectQuery.getBrothersIDsByParentID(this.objectID).map(e => this.getRelationObject(e));
    }

    getPadding(index): string {
        return (Number(index) + 1).toString() + 'em'
    }

    getRelationObject(objectID) {
        let tmpObject = { id: objectID, name: objectID, object: {}, state: {}, obj_TS: '', state_TS: '', state_LC: '', val: '', hasState: false, hasObject: false }
        if (this.objectQuery.hasEntity(objectID)) {
            tmpObject.object = JSON.parse(JSON.stringify(this.objectQuery.getEntity(objectID)));
            tmpObject.id = tmpObject.object['_id'];
            tmpObject.name = tmpObject.object['common']['name'];
            tmpObject.obj_TS = this.getTime(tmpObject.object['ts']);
            tmpObject.hasObject = true;
        }
        if (this.stateQuery.hasEntity(objectID)) {
            tmpObject.state = JSON.parse(JSON.stringify(this.stateQuery.getEntity(objectID)));
            tmpObject.state_TS = this.getTime(tmpObject.state['ts']);
            tmpObject.state_LC = this.getTime(tmpObject.state['lc']);
            tmpObject.val = tmpObject.state['val'];
            tmpObject.hasState = true;
        }
        return tmpObject
    }
}