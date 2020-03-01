import { OnInit, Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { ILevelStruct, IElementState, ElementStates } from 'src/app/service/level.service/level.struct.model';
import { Subscription, bindCallback } from 'rxjs';
import { LevelStructService } from 'src/app/service/level.service/level.struct.service';
import { HelperService } from 'src/app/service/helper.service';
import { IoBStateQuery } from 'src/app/store/state/io-bstate.query';
import { ViewToShow } from 'src/app/modules/states_view/app.views/app.views.model';
import { MenuModel } from '../../menu/menu.model';
import { IOBrokerService } from 'src/app/service/io-broker.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as Chart from 'chart.js';
import { IoBObjectQuery } from 'src/app/store/object/io-bobject.query';

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
  @Input() separator?: string = ' | ';
  @Output() doMenuToggle = new EventEmitter();

  public eViewToShow = ViewToShow;

  public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
  public bgColor: string;
  public var_bgColor: string;

  constructor(
    public levelStructService: LevelStructService,
    public helperService: HelperService,
    private stateQuery: IoBStateQuery,
    private ngZone: NgZone,
    private ioBrokerService: IOBrokerService,
    private objectQuery: IoBObjectQuery,
  ) { }

  ngOnInit(): void {
    // console.log('ngOnInit')
  }

  ngOnChanges() {
    if (this.view === this.eViewToShow.small_chart_row) {
      this.initChart();
    }
    this.setAllValue();
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

  private setAllValue(): boolean {
    try {
      this.bgColor = (this.levelStruct.hasMembers()) ? this.color : this.emptyColor;
      this.var_bgColor = (this.levelStruct.hasMembers()) ? 'var(--ion-color-' + this.color + ')' : 'var(--ion-color-' + this.emptyColor + ')';
      Object.values(this.levelStruct.elementStates).forEach((e: IElementState) => {
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

  CTRLcheckIfIn(toCheck: string, arr: ElementStates): boolean {
    try {
      return (toCheck in arr) ? true : false;
    } catch (e) {
      return false;
    }
  }

  CTRLgetSimpleValueString(level_struct: ILevelStruct): string {
    let returnString = '';
    this.htmlNumberPanels.forEach((val, index) => {
      if (val in level_struct.elementStates) {
        if (index !== 0) {
          returnString = returnString + this.separator;
        }
        returnString = returnString + this.values[level_struct.elementStates[val].uniqID].value + level_struct.elementStates[val].getUnit()
      }
    })
    return returnString;
  }

  CTRLgetObjectLength(obj):number {
    return Object.keys(obj).length;
  }

  private initChart() {
    let chartIDs = ['jeelink.1.LaCrosseWS_balkon.rain', 'jeelink.1.LaCrosseWS_balkon.wspeed2', 'mihome.0.devices.weather_v1_158d000321709f.pressure'];
    console.log('Hallo-test', this.levelStruct)
    let onWeekAgo = new Date().getTime() - (1000 * 60 * 60 * 24 * 7);
    let now = new Date().getTime();
    chartIDs.forEach(id => {
      let label = this.helperService.getByLanguage(this.objectQuery.getEntity(id).common.name) + ' (last week)';
      this.charts[id] = {
        chartFinished: false,
        lineChartData: [{ data: [], label: label, fill:false, pointRadius:0, borderWidth: 2 }],
        lineChartLabels: [],
        lineChartOptions: { 
          responsive: true, 
          maintainAspectRatio: false, 
          animation: { duration: 0 }, 
          responsiveAnimationDuration: 0, 
          legend: { display: false },
          title: {display:true, text:label, fontSize:10, position:'top', padding:0},
          scales: { 
            yAxes: [{gridLines: {display:false,}, scaleLabel: {display:false}, ticks:{display:false}}],
            xAxes: [{gridLines: {display:false,}, scaleLabel: {display:false}, ticks:{display:false}}],
          },
          // events: ['mousemove', 'touchstart', 'touchmove'],
        },
        lineChartColors: [{ borderColor: 'black', backgroundColor: 'rgba(255,255,0,0.28)', }],
        lineChartLegend: true,
        lineChartPlugins: [],
        lineChartType: 'line',
      };
      const observable = bindCallback(this.ioBrokerService.sendTo);
      observable('influxdb.0', 'getHistory', {
        id: id,
        options: {
          start: onWeekAgo,
          end: now,
          step: (1000 * 60 * 60),
          limit: false,
          aggregate: 'average',
        }
      }).subscribe((result) => {
        console.log(result);
        this.ngZone.run(() => {
          for (let i = 0; i < result['result'].length; i++) {

            this.charts[id].lineChartData[0].data.push(result['result'][i].val);
            this.charts[id].lineChartLabels.push(new Date(result['result'][i].ts).toLocaleString());
          }
          this.charts[id].chartFinished = true;
        });
      });
    })
  }

  charts: {
    [functionID: string]: {
      chartFinished: boolean,
      lineChartData: ChartDataSets[],
      lineChartLabels: Label[],
      lineChartOptions: {},
      lineChartColors: Color[],
      lineChartLegend: boolean,
      lineChartPlugins: [],
      lineChartType: string,
    },
  } = {}

  // chartFinished = false;

  // // lineChartData: ChartDataSets[];
  // lineChartData = [{ data: [], label: 'Rain' }];
  // // lineChartData: ChartDataSets[] = [
  // //   { data: [85, 72, 78, 75, 77, 75], label: 'Crude oil prices' },
  // // ];

  // // lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
  // lineChartLabels: Label[] = [];

  // lineChartOptions = {
  //   responsive: true,
  // };

  // lineChartColors: Color[] = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(255,255,0,0.28)',
  //   },
  // ];

  // lineChartLegend = true;
  // lineChartPlugins = [];
  // lineChartType = 'line';
}