import { OnInit, Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ILevelStruct, IElementState } from 'src/app/service/level.service/level.struct.model';
import { Subscription } from 'rxjs';
import { LevelStructService } from 'src/app/service/level.service/level.struct.service';
import { HelperService } from 'src/app/service/helper.service';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { ViewToShow } from 'src/app/modules/states_view/app.views/app.views.model';
import { MenuModel } from '../../menu/menu.model';

@Component({
  selector: 'app-views-component',
  templateUrl: 'app.views.component.html',
  styleUrls: ['app.views.component.scss']
})
export class AppViewsComponent implements OnInit {

  @Input() levelStruct: ILevelStruct;
  @Input() htmlBoolPanels: string[];
  @Input() htmlNumberPanels: string[];
  @Input() valueSelectionID: string;
  @Input() valueSelectionFilters?: string[] = [];
  @Input() view: number;
  @Input() menu?: MenuModel;
  @Input() level?: number;
  @Input() withDetails?: boolean = true;
  @Input() withOpener?: boolean = true;
  @Input() headerTitle: string | object;
  @Input() color?: string = 'light';
  @Input() emptyColor?: string = '';
  @Output() doMenuToggle = new EventEmitter();

  public eViewToShow = ViewToShow;

  public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
  public bgColor:string;
  public var_bgColor:string;

  constructor(
    public levelStructService: LevelStructService,
    public helperService: HelperService,
    private stateQuery: IoBStateQuery,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // console.log('ngOnInit')
  }

  CTRLgetBatteryStateIcon(level_struct: ILevelStruct): string {
    if ('enum.functions.batterie' in level_struct.elementStates && 'enum.functions.low_batterie' in level_struct.elementStates) {
      let tS = this.values[level_struct.elementStates['enum.functions.batterie'].uniqID].value && !this.values[level_struct.elementStates['enum.functions.low_batterie'].uniqID].value;
      return level_struct.elementStates['enum.functions.batterie'].getBase64Icon(tS);
    }
    if ('enum.functions.batterie' in level_struct.elementStates) {
      let tS = this.values[level_struct.elementStates['enum.functions.batterie'].uniqID].value;
      return level_struct.elementStates['enum.functions.batterie'].getBase64Icon(tS);
    }
    if ('enum.functions.low_batterie' in level_struct.elementStates) {
      let tS = !this.values[level_struct.elementStates['enum.functions.low_batterie'].uniqID].value;
      return level_struct.elementStates['enum.functions.low_batterie'].getBase64Icon(tS);
    }
  }



  CTRLbatteryOK(level_struct: ILevelStruct): boolean {
    if ('enum.functions.batterie' in level_struct.elementStates && 'enum.functions.low_batterie' in level_struct.elementStates) {
      return this.values[level_struct.elementStates['enum.functions.batterie'].uniqID].value && !this.values[level_struct.elementStates['enum.functions.low_batterie'].uniqID].value;
    }
    if ('enum.functions.batterie' in level_struct.elementStates) {
      return this.values[level_struct.elementStates['enum.functions.batterie'].uniqID].value;
    }
    if ('enum.functions.low_batterie' in level_struct.elementStates) {
      return !this.values[level_struct.elementStates['enum.functions.low_batterie'].uniqID].value;
    }
    return true;
  }

  CTRLhasNotUpdatedSince1Month(level_struct: ILevelStruct): boolean {
    let hasNotUpdatedTS = false;
    let not_updated_states: string[] = []
    Object.values(level_struct.elementStates).forEach((e: IElementState) => {
      e.getStateIDs().forEach(id => {
        let tsE = this.stateQuery.getEntity(id);
        if (tsE.ts < Date.now() - (1000 * 60 * 60 * 24 * 30)) {
          not_updated_states.push(id);
          hasNotUpdatedTS = true;
        }
      });
    });
    return hasNotUpdatedTS;
  }

  CTRLgetLevel(level_struct: ILevelStruct): number {
    return (this.level !== undefined) ? this.level : level_struct.level;
  }

  CTRLsetAllValue(level_struct: ILevelStruct): boolean {
    try {
      this.bgColor = (level_struct.hasMembers()) ? this.color : this.emptyColor;
      this.var_bgColor = (level_struct.hasMembers()) ? 'var(--ion-color-'   + this.color + ')' : 'var(--ion-color-'   + this.emptyColor + ')';
      Object.values(level_struct.elementStates).forEach((e: IElementState) => {
        if (!(e.uniqID in this.values)) {
          this.values[e.uniqID] = {};
          this.values[e.uniqID].subscription = e.value$.subscribe(val => {
            this.ngZone.run(() => {
              this.values[e.uniqID].value = val;
            });
          });
        }
      })
    } finally {
      return true;
    }
  }

  CTRLgetName(level_struct: ILevelStruct): string {
    return (this.headerTitle) ? this.helperService.getByLanguage(this.headerTitle) : this.helperService.getByLanguage(level_struct.getName());
  }

  CTRLcheckIfIn(toCheck: string, arr: []): boolean {
    try {
      return (toCheck in arr) ? true : false;
    } catch (e) {
      return false;
    }
  }
}