import { Component, OnInit, NgZone } from '@angular/core';

import { IOBrokerService } from '../../service/io-broker.service';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { Observable, of } from 'rxjs';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { IoBStateQuery } from '../../store/state/io-bstate.query';
import { IconsService } from '../../service/icons.service';
import { NewIOBStateStore } from '../../store/newstate/new-iobstate.store';

export interface SimpleLightState{
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
  selector: 'app-tab-lights',
  templateUrl: 'tab-lights.page.html',
  styleUrls: ['tab-lights.page.scss']
})
export class TabLightsPage implements OnInit {
  /** The Application title */
  public title = 'homeOverview';
  // public stateObjectList: {} = {};
  // public stateObjectRooms: {} = {};
  private simpleLightStates: Array<SimpleLightState> = [];
  public simpleLightStatesView: Array<SimpleLightState> = [];
  public simpleLightStatesViewGrouped = {};
  private language = 'de';
  public loaded = false;
  public loaded$: Observable<boolean>;
  private filter = (element, index, array): boolean => { return true};
  private sort = (firstEl, secondEl): number => { return 1};

  /** @ignore */
  constructor(
    private ioBrokerService: IOBrokerService,
    private ngZone: NgZone,
    private enumQuery: IoBEnumQuery,
    private objectQuery: IoBObjectQuery,
    private stateQuery: IoBStateQuery,
    public iconsService: IconsService,
    private newIOBStateStore: NewIOBStateStore,
  ) {}

  /** @ignore */
  ngOnInit(): void {
    this.ioBrokerService.init();
    this.loaded$ = this.ioBrokerService.selectLoaded();
    this.loaded$.subscribe(e => {
      this.ngZone.run(() => {
        this.loaded = e;
      });
    });
    this.ioBrokerService.selectLoaded().subscribe(e => {
      if(e === true){
        this.enumQuery.selectDeviceIDByFunctionalEnum('enum.functions.light').subscribe((ids:Array<string>) => {
          if(!ids){
            return;
          }
          this.ngZone.run(() => {
            this.simpleLightStates = [];
            ids.forEach(id => {
              if(this.objectQuery.hasEntity(id)){
                let tempSimpleLightState : SimpleLightState = {id : id}
                this.objectQuery.selectNameByID(id).subscribe(name => this.ngZone.run(() => {tempSimpleLightState.name = name}))
                this.enumQuery.selectRoomNameFromObjectID(id).subscribe(roomName => this.ngZone.run(() => {tempSimpleLightState.roomName = roomName}));
                this.enumQuery.selectFloorNameFromObjectID(id).subscribe(floorName => this.ngZone.run(() => {tempSimpleLightState.floorName = floorName}));
                this.enumQuery.selectFloorIDFromObjectID(id).subscribe(floorID => this.ngZone.run(() => {tempSimpleLightState.floorID = floorID}));
                this.stateQuery.selectStateByID(id).subscribe(state => this.ngZone.run(() => {tempSimpleLightState.state = state}));
                this.simpleLightStates.push(tempSimpleLightState);
              }
            });
            this.updateViewParams();
          });
        });
      }
    })
  }

  updateViewParams(){
    this.simpleLightStatesView = this.simpleLightStates.filter(this.filter);
    this.simpleLightStatesView = this.simpleLightStates.sort(this.sort);
    this.groupByFloor();
  }

  groupByFloor(){
    this.simpleLightStatesViewGrouped = {}
    this.simpleLightStatesView.forEach(e => {
      if(!('floorID' in e)){
        e.floorID = '100_no_floor'
        e.floorName = 'No Floor'
      }
      if(!(e.floorID in this.simpleLightStatesViewGrouped)){
        this.simpleLightStatesViewGrouped[e.floorID] = {
          id: e.floorID,
          name: this.getByLanguage(e.floorName),
          values: []
        };
      }
      this.simpleLightStatesViewGrouped[e.floorID].values.push(e);
    })
  }

  getByLanguage(value): string {
    if(typeof value === 'object'){
      if(this.language in value){
        return value[this.language];
      } else if ('en' in value){
        return value.en;
      }
    }
    return value;
  }

  lightsToggle(lightID, state) {
    this.newIOBStateStore.upsert(lightID, {
      val: state,
      id: lightID,
    });
  }

}
