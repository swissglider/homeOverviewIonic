import { Component, OnInit, NgZone, Input } from '@angular/core';

import { IOBrokerService } from '../../service/io-broker.service';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { IoBStateQuery } from '../../store/state/io-bstate.query';
import { IconsService } from '../../service/icons.service';
import { HelperService } from '../../service/helper.service';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../../service/page.service';

export interface SimpleFunctionState{
  id: string;
  name?: string | object;
  roomName?: string | object;
  roomID?: string;
  floorName?: string | object;
  floorID?: string;
  state?: number | string | boolean | object;
}


/** loads the Home and init all the Services */
@Component({
  selector: 'app-tab-functions',
  templateUrl: 'tab-functions.page.html',
  styleUrls: ['tab-functions.page.scss']
})
export class TabFunctionsPage implements OnInit {
  public simpleFunctionStatesViewGrouped = {};
  public loaded = false;
  //private filter_only_with_Floor = (element, index, array): boolean => (!('floorID' in element) || element.floorID === undefined) ? false : true;
  //private filter= (element, index, array): boolean => true;
  //private sort = (firstEl, secondEl): number => (firstEl.floorID === secondEl.floorID) ? 0 : (firstEl.floorID < secondEl.floorID) ? -1 : 1;
  public templateToShow = 'notLoaded';
  public function = '';

  public writable: boolean = false;
  // private function = 'enum.functions.doors'
  // private function = 'enum.functions.window'

  /** @ignore */
  constructor(
    private ioBrokerService: IOBrokerService,
    private ngZone: NgZone,
    private enumQuery: IoBEnumQuery,
    private objectQuery: IoBObjectQuery,
    private stateQuery: IoBStateQuery,
    public iconsService: IconsService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    public pageService:PageService,
  ) {
    this.function = '';
  }

  ionViewDidEnter(){
  }

  ionViewWillEnter(){
    if(this.templateToShow === 'filter'){
      this.templateToShow = 'loaded'
    }
    this.route.queryParams.subscribe(params => {
      if('function' in params){
        this.function = params.function;
      }
      this.init();
    });
  }

  /** @ignore */
  ngOnInit(): void {
  }

  private init(): void {
    this.ioBrokerService.selectLoaded().subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
        this.templateToShow = (this.loaded)? 'loaded' : 'notLoaded'
      });
      if(e === true){
        this.enumQuery.selectDeviceIDByFunctionalEnum(this.function).subscribe((ids:Array<string>) => {
          if(!ids){
            return;
          }
          this.ngZone.run(() => {
            this.writable = false;
            this.simpleFunctionStatesViewGrouped = {};
            ids.forEach(id => {
              if(this.objectQuery.hasEntity(id)){
                let tempSimpleFunctionState : SimpleFunctionState = {id : id}
                this.objectQuery.selectNameByID(id).subscribe(name => this.ngZone.run(() => {tempSimpleFunctionState.name = name}))
                this.enumQuery.selectRoomNameFromObjectID(id).subscribe(roomName => this.ngZone.run(() => {tempSimpleFunctionState.roomName = roomName}));
                this.enumQuery.selectFloorNameFromObjectID(id).subscribe(floorName => this.ngZone.run(() => {tempSimpleFunctionState.floorName = floorName}));
                this.enumQuery.selectFloorIDFromObjectID(id).subscribe(floorID => this.ngZone.run(() => {tempSimpleFunctionState.floorID = floorID}));
                this.stateQuery.selectStateByID(id).subscribe(state => this.ngZone.run(() => {tempSimpleFunctionState.state = state}));
                if(!('floorID' in tempSimpleFunctionState) || tempSimpleFunctionState.floorID === undefined){
                  tempSimpleFunctionState.floorName = {
                    en: 'No Floor',
                    de: 'Ohne Raum'
                  };
                }
                if(!(tempSimpleFunctionState.floorID in this.simpleFunctionStatesViewGrouped)){
                  this.simpleFunctionStatesViewGrouped[tempSimpleFunctionState.floorID] = {
                    id: tempSimpleFunctionState.floorID,
                    name: this.helperService.getByLanguage(tempSimpleFunctionState.floorName),
                    values: []
                  };
                  this.simpleFunctionStatesViewGrouped[tempSimpleFunctionState.floorID].selected = (tempSimpleFunctionState.floorID === undefined) ? false : true;
                }
                this.writable = this.writable || this.objectQuery.getWritableByID(id);
                this.simpleFunctionStatesViewGrouped[tempSimpleFunctionState.floorID].values.push(tempSimpleFunctionState);
              }
            });
          });
        });
      }
    })
  }

  switchAll(state: boolean) {
    let allIDs = [];
    Object.values(this.simpleFunctionStatesViewGrouped).forEach(simpleFunctionStates => {
      if(simpleFunctionStates['selected']){
        allIDs = allIDs.concat(simpleFunctionStates['values'].map(e => e.id));
      }
    });
    this.helperService.functionToggle(allIDs, state);
  }

  switchGrouped(grouped, state){
    let allIDs = [];
    if(grouped['selected']){
      allIDs = allIDs.concat(grouped['values'].map(e => e.id));
    }
    this.helperService.functionToggle(allIDs, state);
  }
}