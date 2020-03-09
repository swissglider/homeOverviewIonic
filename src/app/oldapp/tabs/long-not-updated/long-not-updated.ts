import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IOBrokerService, server_protocol, server_url, server_admin_port } from '../../service/io-broker.service';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { HelperService } from '../../service/helper.service';
import { IoBStateQuery } from '../../store/state/io-bstate.query';
import { IoBState } from '../../store/state/io-bstate.model';
import { PageService } from '../../service/page.service';

@Component({
  selector: 'app-long-not-updated',
  templateUrl: 'long-not-updated.html',
  styleUrls: ['long-not-updated.scss']
})
export class LongNotUpdated {

  @ViewChild('days', {static:true}) days: ElementRef;

  loaded: boolean;
  templateToShow: string;
  defaultDays = 10;
  resultStruct = {};
  private base_url = server_protocol + '://' + server_url + ':' + server_admin_port + '/#tab-objects/editobject/';

  constructor(
    private ioBrokerService: IOBrokerService,
    private ngZone: NgZone,
    private enumQuery: IoBEnumQuery,
    private objectQuery: IoBObjectQuery,
    private stateQuery: IoBStateQuery,
    public helperService: HelperService,
    public pageService:PageService,
  ) {

  }

  /** @ignore */
  ionViewWillEnter(): void {
    this.ioBrokerService.selectLoaded().subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
        this.templateToShow = (this.loaded) ? 'loaded' : 'notLoaded'
      });
      if (e === true) {
        // this.enumQuery.selectEnumsID().subscribe(addedIds => {
        //   this.initEnumGroupStruct();
        // });
        // this.initEnumGroupStruct();
      }
    });
  }

  search(){
    let daysMs = this.days['value'] * 24 * 60 * 60 * 1000;
    let toSearchMS = Date.now() - daysMs;
    const notToUseFolders = ['system.', 'vis.', 'info.']
    let oldStates: IoBState[] = this.stateQuery.getAll({
      filterBy: entity => (notToUseFolders.reduce((a, c) => (a === 't' || entity.id.startsWith(c)) ? 't' : 'f', 'f') === 't') ? false : true && entity.ts < toSearchMS
    });

    this.resultStruct = {}
    oldStates.forEach((state: IoBState) => {
      var obj = this.objectQuery.getEntity(state.id);
      if(obj == null){
        return;
      }
      var array = state.id.split('.');
      var object = {};
      const base_url = this.base_url;
      const helper = this.helperService;
      array.reduce(function(o, s, i, a) {
        if(i === a.length-1){
          return o[s] = {
            __name__: helper.getByLanguage(obj.common.name),
            __state__: state,
            __object__: obj,
            __id__ : state.id,
            __ts_object__: new Date(obj.ts).toLocaleString(),
            __ts_state__: new Date(state.ts).toLocaleString(),
            __lc_state__: new Date(state.lc).toLocaleString(),
            __url__: base_url + state.id
          };
        }
        return o[s] = {}; 
      }, object);
      this.resultStruct = this.mergeDeep(this.resultStruct, object);
    });
    console.log(this.resultStruct)
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
