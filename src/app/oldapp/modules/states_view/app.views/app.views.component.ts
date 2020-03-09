import { OnInit, Component, Input, Output, EventEmitter, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { ILevelStruct } from '../../../service/level.service/level.struct.model';
import { Subscription, bindCallback, Observable, BehaviorSubject } from 'rxjs';
import { LevelStructService } from '../../../service/level.service/level.struct.service';
import { HelperService } from '../../../service/helper.service';
import { ViewToShow } from '../../../modules/states_view/app.views/app.views.model';
import { MenuModel } from '../../menu/menu.model';
import { IOBrokerService } from '../../../service/io-broker.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { IoBObjectQuery } from '../../../store/object/io-bobject.query';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-views-component',
  templateUrl: 'app.views.component.html',
  styleUrls: ['app.views.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input() headerTitle: string | object;  // => used in eViewToShow.header
  @Input() color?: string = 'light';
  @Input() emptyColor?: string = '';
  @Input() separator?: string = ' | ';
  @Input() smallChartIDs = ['jeelink.1.LaCrosseWS_balkon.rain', 'jeelink.1.LaCrosseWS_balkon.wspeed2', 'mihome.0.devices.weather_v1_158d000321709f.pressure']; // => this.eViewToShow.small_chart_row
  @Output() doMenuToggle = new EventEmitter();

  public eViewToShow = ViewToShow;

  // public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
  public bgColor: string;
  public var_bgColor: string;
  public name: string;

  public charts$: Observable<{ [functionID: string]: { chartFinished: boolean } }>;
  private _charts$: BehaviorSubject<{ [functionID: string]: { chartFinished: boolean } }>;
  private chartsSubscription: Subscription;

  constructor(
    public levelStructService: LevelStructService,
    public helperService: HelperService,
    private ngZone: NgZone,
    private ioBrokerService: IOBrokerService,
    private objectQuery: IoBObjectQuery,
    public alertController: AlertController
  ) { }

  ngOnInit(): void {
    // console.log('ngOnInit')
    this.level = (this.level !== undefined) ? this.level : this.levelStruct.level;
    if (this.view === this.eViewToShow.header) {
      this.name = this.getName();
    }
    if (this.view === this.eViewToShow.small_chart_row) {
      this.name = this.getName();
      this.initChart();
    }
    this.bgColor = (this.levelStruct.hasMembers()) ? this.color : this.emptyColor;
    this.var_bgColor = (this.levelStruct.hasMembers()) ? 'var(--ion-color-' + this.color + ')' : 'var(--ion-color-' + this.emptyColor + ')';
  }

  ngOnChanges(changes) {
    let firstChange = true;
    Object.values(changes).forEach((e) => {
      if (!e['firstChange']) {
        firstChange = false;
      }
    })
    if (!firstChange) {
      console.log('ngOnChanges', changes, this.view);
    }
    if (Object.keys(changes).length === 1 && Object.keys(changes).includes('menu')) { return; }
  }

  ngDoCheck() {

  }

  private getName(): string {
    return (this.headerTitle) ? this.helperService.getByLanguage(this.headerTitle) : this.helperService.getByLanguage(this.levelStruct.getName());
  }

  private initChart() {
    if (this.chartsSubscription) {
      this.chartsSubscription.unsubscribe();
    }
    let tempCharts: {
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
    let onWeekAgo = new Date().getTime() - (1000 * 60 * 60 * 24 * 7);
    let now = new Date().getTime();
    this.smallChartIDs.forEach(id => {
      let label = this.helperService.getByLanguage(this.objectQuery.getEntity(id).common.name) + ' (last week)';
      tempCharts[id] = {
        chartFinished: false,
        lineChartData: [{ data: [], label: label, fill: false, pointRadius: 0, borderWidth: 2 }],
        lineChartLabels: [],
        lineChartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 0 },
          responsiveAnimationDuration: 0,
          legend: { display: false },
          title: { display: true, text: label, fontSize: 10, position: 'top', padding: 0 },
          scales: {
            yAxes: [{ gridLines: { display: false, }, scaleLabel: { display: false }, ticks: { display: false } }],
            xAxes: [{ gridLines: { display: false, }, scaleLabel: { display: false }, ticks: { display: false } }],
          },
          // events: ['mousemove', 'touchstart', 'touchmove'],
        },
        lineChartColors: [{ borderColor: 'black', backgroundColor: 'rgba(255,255,0,0.28)', }],
        lineChartLegend: true,
        lineChartPlugins: [],
        lineChartType: 'line',
      };
      const observable = bindCallback(this.ioBrokerService.sendTo);
      this.chartsSubscription = observable('influxdb.0', 'getHistory', {
        id: id,
        options: {
          start: onWeekAgo,
          end: now,
          step: (1000 * 60 * 60),
          limit: false,
          aggregate: 'average',
        }
      }).subscribe((result) => {
        for (let i = 0; i < result['result'].length; i++) {

          tempCharts[id].lineChartData[0].data.push(result['result'][i].val);
          tempCharts[id].lineChartLabels.push(new Date(result['result'][i].ts).toLocaleString());
        }
        tempCharts[id].chartFinished = true;

        this.ngZone.run(() => {
          this._charts$.next(tempCharts);
        });
      });
    });
    this._charts$ = new BehaviorSubject<{ [functionID: string]: { chartFinished: boolean } }>(tempCharts);
    this.charts$ = this._charts$.asObservable();
  }

  async presentsNotUpdatedSince1Month(ids: string[]) {
    console.log(ids)
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: JSON.stringify(ids),
      buttons: ['OK']
    });

    await alert.present();
  }
  
}