import { Component, NgZone } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { IoBEnumQuery } from 'src/app/store/enum/io-benum.query';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';
import { IoBObject } from 'src/app/store/object/io-bobject.model';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  // returnStruct = {
  //   test: {
  //     "__visible__":true,
  //     test1: {
  //       testa: 1,
  //       testb: 'Hallo-Testb',
  //     },
  //     test2: 'Guido',
  //   },
  //   testZ: 'Velo',
  // }

  returnStruct:{};
  loaded:boolean = true;

  constructor(
    public pageService:PageService,
    private objectQuery: IoBObjectQuery,
    private stateQuery: IoBStateQuery,
    private ioBrokerService: IOBrokerService,
    private helper: HelperService,
    private ngZone: NgZone,
  ) { }

  /** @ignore */
  ionViewWillEnter(): void { 
    this.ioBrokerService.selectLoaded().subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
      });
      if(e === true){
        this.ngZone.run(() => {
          this.returnStruct = this.generateReturnStruct();
          this.loaded = true;
        });
      }
    });
  }

  generateReturnStruct(): {}{
    let returnStruct = {};
    this.loaded = false;
    let allObjects = this.objectQuery.getAll();
    allObjects.forEach((obj: IoBObject) => {
      if(obj == null){
        return
      }
      let array = []
      try { 
        array = obj._id.split('.');
      } catch (error) {
        console.log(obj)
      }
      let object = {};
      let __object_info__ = {};
      let __info__ = {};

      __object_info__['name'] = this.helper.getByLanguage(obj.common.name);
      __object_info__['object'] = obj;
      __object_info__['ts_object'] = new Date(obj.ts).toLocaleString();
      __info__['name'] = this.helper.getByLanguage(obj.common.name);
      __info__['ts_object'] = new Date(obj.ts).toLocaleString();
      
      if(this.stateQuery.hasEntity(obj._id)){
        let tmp_state = this.stateQuery.getEntity(obj._id)
        __object_info__['state'] = tmp_state;
        __object_info__['ts_state'] = new Date(tmp_state.ts).toLocaleString();
        __object_info__['lc_state'] = new Date(tmp_state.lc).toLocaleString();
        __object_info__['current_state'] = tmp_state.val;
        __info__['ts_state'] = new Date(tmp_state.ts).toLocaleString();
        __info__['lc_state'] = new Date(tmp_state.lc).toLocaleString();
        __info__['current_state'] = tmp_state.val;
      }
      array.reduce(function(o, s, i, a) {
        if(i === a.length-1){
          if('state' in __object_info__){
            return o[s] = {
              __object_info__: __object_info__,
              __info__: __info__,
            };
          }
          return o[s] = {
            __object_info__: __object_info__,
          };
        }
        return o[s] = {}; 
      }, object);
      returnStruct = this.mergeDeep(returnStruct, object);
    });
    returnStruct = JSON.parse(JSON.stringify(returnStruct));
    return returnStruct;
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

}
