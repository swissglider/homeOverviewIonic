import { Component, NgZone } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBObject } from 'src/app/store/object/io-bobject.model';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-folder_test',
  templateUrl: 'folder_test.page.html',
  styleUrls: ['folder_test.page.scss']
})
export class folder_testPage {

  returnStruct: {};
  loaded: boolean = true;
  showAgenda = false;

  constructor(
    public pageService: PageService,
    private objectQuery: IoBObjectQuery,
    private stateQuery: IoBStateQuery,
    private ioBrokerService: IOBrokerService,
    private helper: HelperService,
    private ngZone: NgZone,
    public modalController: ModalController,
  ) { }

  /** @ignore */
  ionViewWillEnter(): void {
    this.ioBrokerService.selectLoaded().subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
      });
      if (e === true) {
        this.ngZone.run(() => {
          this.returnStruct = this.generateReturnStruct();
          this.loaded = true;
        });
      }
    });
  }

  generateReturnStruct(): {} {
    let returnStruct = {};
    this.loaded = false;
    let allObjects = this.objectQuery.getAll();
    allObjects.forEach((obj: IoBObject) => {
      if (obj == null) {
        return
      }
      let array = []
      try {
        array = obj._id.split('.');
      } catch (error) {
        console.log(obj)
      }
      let object = {};
      let __info__ = {};

      __info__['Object Name'] = this.helper.getByLanguage(obj.common.name);
      __info__['Object TS'] = new Date(obj.ts).toLocaleString();
      __info__['__infoToSendBack__'] = obj._id;

      if (this.stateQuery.hasEntity(obj._id)) {
        let tmp_state = this.stateQuery.getEntity(obj._id)
        __info__['State TS'] = new Date(tmp_state.ts).toLocaleString();
        __info__['State LC'] = new Date(tmp_state.lc).toLocaleString();
        __info__['x-State'] = tmp_state.val;
      }
      array.reduce(function (o, s, i, a) {
        if (i === a.length - 1) {
          return o[s] = {
            __info__: __info__,
            __type__: obj.type,
          };
        }
        return o[s] = {};
      }, object);
      returnStruct = this.mergeDeep(returnStruct, object);
    });
    return JSON.parse(JSON.stringify(returnStruct));
  }

  private mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        }
        else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = this.mergeDeep(pVal, oVal);
        }
        else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  }

  getMoreInfo(id) {
    this.presentModal(id)
  }

  async presentModal(objectID) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        'objectID': objectID,
      }
    });
    modal.onDidDismiss().then((detail) => {
      console.log(detail)
      if (detail !== null && 'data' in detail && detail.data) {
        console.log(detail.data)
        this.presentModal(detail.data)
      }
    });
    return await modal.present();
  }

}
