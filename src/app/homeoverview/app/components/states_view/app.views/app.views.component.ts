import { OnInit, Component, Input, Output, EventEmitter, NgZone, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, bindCallback, Observable, BehaviorSubject } from 'rxjs';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { IoBObjectQuery } from '../../../store/object/io-bobject.query';
import { AlertController } from '@ionic/angular';
import { ViewToShow } from './app.views.model';
import { IOBrokerService } from '../../../../_global/services/iobroker.service/iobroker.service';
import { LevelStructService } from '../../../../_global/services/level.service/level.struct.service';
import { ILevelStruct } from '../../../../_global/services/level.service/level.struct.model';
import { GetNamePipe } from '../../../../_global/pipes/get-name.pipe';
import { InputButtons } from '../../menu/menu.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-views-component',
  templateUrl: 'app.views.component.html',
  styleUrls: ['app.views.component.scss'],
  providers: [GetNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppViewsComponent implements OnInit, OnDestroy {

  @Input() levelStruct: ILevelStruct;
  @Input() htmlBoolPanels: string[];
  @Input() htmlNumberPanels: string[];
  @Input() valueSelectionID: string;
  @Input() valueSelectionFilters?: string[] = [];
  @Input() view: number;
  @Input() level?: number;
  @Input() withDetails?: boolean = true;
  @Input() withOpener?: boolean = true;
  @Input() color?: string = 'light';
  @Input() emptyColor?: string = '';
  @Input() separator?: string = ' | ';
  @Input() smallChartIDs = ['jeelink.1.LaCrosseWS_balkon.rain', 'jeelink.1.LaCrosseWS_balkon.wspeed2', 'mihome.0.devices.weather_v1_158d000321709f.pressure']; // => this.eViewToShow.small_chart_row
  @Output() doMenuToggle = new EventEmitter();

  public eViewToShow = ViewToShow;
  trackById = (index: number, item: any) => item.id;

  // public values: { id?: string, value?: number | string | boolean, subscription: Subscription }[] = [];
  public bgColor: string;
  public var_bgColor: string;
  public menuButtons: InputButtons = { buttons: [] };

  public charts$: Observable<{ [functionID: string]: { chartFinished: boolean } }>;
  private _charts$: BehaviorSubject<{ [functionID: string]: { chartFinished: boolean } }>;
  private chartsSubscription: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(
    public levelStructService: LevelStructService,
    private ngZone: NgZone,
    private ioBrokerService: IOBrokerService,
    private objectQuery: IoBObjectQuery,
    public alertController: AlertController,
    private getNamePipe: GetNamePipe,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // console.log('ngOnInit')
    this.level = (this.level !== undefined) ? this.level : this.levelStruct.level;
    if (this.view === this.eViewToShow.header) {
    }
    if (this.view === this.eViewToShow.small_chart_row) {
      this.initChart();
    }
    this.bgColor = (this.levelStruct.hasMembers()) ? this.color : this.emptyColor;
    this.var_bgColor = (this.levelStruct.hasMembers()) ? 'var(--ion-color-' + this.color + ')' : 'var(--ion-color-' + this.emptyColor + ')';

    // For Header end
    if (this.view === this.eViewToShow.header) {
      if (this.levelStruct.hasNotUpdatedSince1Month()) {
        this.menuButtons.buttons.push({
          buttonID: 'hasNotUpdatedSince1Month',
          showImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAACcUlEQVQ4ja2US0hUYRTHf9/cybkzMZYTaYvUhbXSHHclRIRQQRDUyOAEiS0Cs0XgYxjapJsWgmEhSFtXoRMuCkI3Ggm5aDXlKrQQLXzQzPhoHHTuPS2uj3mok9AfDvfwcfh953U/+M9S+QLE116O3XYWgJQ5r4afzx4ZKLe6XJxIBdFUCy6nTrHHAGAxqpFMJjGkn7jWo951JfICxR+swaWPUOt146tzcbooM2A5BsNjCSYjayQ3b6jB7sjB5fmDNdLUuSJT05Kh8c+WpevrtEhT54o0hLzpDFtGmS59hGBjIZUVmTfF1y1LV1UFdDQWoheMir/VmQPkRCpIrdedAztMVRVwqdqN83hHLtBua8FX5/p32rZ8dS6UrSUDKL72cpy6njMAAMOE2V8wt2D52Sr2gO5wSaCtFMAOgGYv3V2NbI1+gvUNy+8fgrIzln+5Bk6dtPwSj0EsXgbMWSUrUxDZvyTbXlcw0zNM2zhHgYFYyVkZpsx5lmPavsBrF62vCFyvBc2WG/Owfpy+FxOE087k/tMFWYrKkfQ7LrK6LiJyb4dj3yUa0s/wWIjm+vyTXo7By9fwbXanLXfF3/pehXuje/nHtR4mI2tMzeTlZcAATPMm2Psg61+WhpAXXf9IR2MhVQcseGwVmp9B9Xm4cM46m/wC339uwA93RofVYHeEZPIKPQOLvHqTYCmaC7Rvd2ntDyxGLUskAbVFZaUc/HwVpdpRtkfoDiclHgNHgcmD2x8o9rwl8CRglZmejepTQ92P8z+wgbZSTK0MUzuGmplQ4bAh/laP1TN1B9QWigFkM6TCvRv5eIdfdrXLLllz+AsxjCwtATRyEwAAAABJRU5ErkJggg==",
          value: {},
          order: 1,
        });
      }
      this.subscriptions.push(this.levelStruct.batteryOk$.pipe(distinctUntilChanged()).subscribe(e => {
        if (e.value) {
          this.menuButtons.buttons.push({
            buttonID: 'batteryOk',
            showImage: this.levelStruct.getBatteryIcon(),
            value: {},
            order: 1,
          });
        }
      }));
      if (this.htmlBoolPanels) {
        this.htmlBoolPanels.forEach(htmlFunction => {
          if (htmlFunction !== 'enum.functions.low_batterie'
            && htmlFunction !== 'enum.functions.batterie'
            && htmlFunction in this.levelStruct.elementStates
            && this.levelStruct.elementStates[htmlFunction].getType() === 'boolean'
          ) {
            this.subscriptions.push(this.levelStruct.elementStates[htmlFunction].valueS$.pipe(distinctUntilChanged()).subscribe(valueS => {
              if (valueS) {
                if (this.menuButtons.buttons.some(e => e.buttonID === 'htmlBoolPanels' && 'id' in e.value && e.value.id === htmlFunction)) {
                  this.menuButtons.buttons.find(e => e.buttonID === 'htmlBoolPanels' && 'id' in e.value && e.value.id === htmlFunction)
                    .showImage = this.levelStruct.elementStates[htmlFunction].getBase64Icon(valueS.value);
                } else {
                  this.menuButtons.buttons.push({
                    buttonID: 'htmlBoolPanels',
                    showImage: this.levelStruct.elementStates[htmlFunction].getBase64Icon(valueS.value),
                    value: { id: htmlFunction },
                    order: 2,
                  });
                }
                this.menuButtons = { buttons: this.menuButtons.buttons };
                this.ref.markForCheck();
              }
            }));
          }
        });
      }
      if (this.htmlNumberPanels) {
        this.htmlNumberPanels.forEach(htmlFunction => {
          if (htmlFunction in this.levelStruct.elementStates
            && this.levelStruct.elementStates[htmlFunction].getType() === 'number'
          ) {
            this.subscriptions.push(this.levelStruct.elementStates[htmlFunction].valueS$.pipe(distinctUntilChanged()).subscribe(valueS => {
              if (valueS !== null && valueS !== undefined) {
                if (this.menuButtons.buttons.some(e => e.buttonID === 'htmlNumberPanels' && 'id' in e.value && e.value.id === htmlFunction)) {
                  this.menuButtons.buttons.find(e => e.buttonID === 'htmlNumberPanels' && 'id' in e.value && e.value.id === htmlFunction)
                    .showText = valueS.value + this.levelStruct.elementStates[htmlFunction].getUnit();
                } else {
                  this.menuButtons.buttons.push({
                    buttonID: 'htmlNumberPanels',
                    showText: valueS.value + this.levelStruct.elementStates[htmlFunction].getUnit(),
                    value: { id: htmlFunction },
                    order: 3,
                  });
                }
                this.menuButtons = { buttons: this.menuButtons.buttons };
                this.ref.markForCheck();
              }
            }));
          }
        });
      }
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach(e => {
      e.unsubscribe();
    });
  }

  menuButtonReturn($event) {
    console.log($event)
    if ($event.buttonID === 'hasNotUpdatedSince1Month') {
      this.presentsNotUpdatedSince1Month(this.levelStruct.getNotUpdatedSince1MonthIDs())
    }
    if ($event.buttonID === 'htmlBoolPanels') {
      this.levelStruct.elementStates[$event.value['id']].toggleState();
    }
    if ($event.buttonID === 'htmlNumberPanels') {

    }
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
  }

  ngDoCheck() {

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
      let label = this.getNamePipe.transform(this.objectQuery.getEntity(id).common.name) + ' (last week)';
      // let label = 'hallo'
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