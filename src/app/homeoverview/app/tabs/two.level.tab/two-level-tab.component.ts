import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ViewToShow } from '../../components/states_view/app.views/app.views.model';
import { Observable, Subscription } from 'rxjs';
import { ILevelStruct } from '../../../_global/services/level.service/level.struct.model';
import { LevelStructService } from '../../../_global/services/level.service/level.struct.service';
import { ActivatedRoute } from '@angular/router';
import { CONNECTION_STATUS } from '../../../_global/services/iobroker.service/iobroker.service.model';
import { distinctUntilChanged } from 'rxjs/operators';
import { IOBrokerService } from '../../../_global/services/iobroker.service/iobroker.service';
import { OnReadOpts } from 'net';

@Component({
  selector: 'app-two-level-tab',
  templateUrl: './two-level-tab.component.html',
  styleUrls: ['./two-level-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoLevelTabComponent implements OnInit, OnDestroy {

  private inputLevelObject: {};
  public valueSelectionID: string;
  // public valueSelectionFilters = ["enum.functions.light", "enum.functions.doors", "enum.functions.hum", "enum.functions.window", "enum.functions.batterie", "enum.functions.low_batterie"];
  public valueSelectionFilters: string[];

  public viewToShow = ViewToShow;

  public levelStruct$: Observable<ILevelStruct>;
  public htmlBoolPanels: string[];
  public htmlNumberPanels: string[];
  private subscription: Subscription[] = [];
  private url: string;

  trackById = (index: number, item: any) => item.id;

  ngOnInit(): void {
    // console.log(this.url, 'ngOnInit')
    this.valueSelectionID = this.route.snapshot.data['valueSelectionID'];
    this.valueSelectionFilters = this.route.snapshot.data['valueSelectionFilters'];
    this.inputLevelObject = this.route.snapshot.data['inputLevelObject'];
    if ('htmlBoolPanels' in this.route.snapshot.data) { this.htmlBoolPanels = this.route.snapshot.data['htmlBoolPanels']; }
    if ('htmlNumberPanels' in this.route.snapshot.data) { this.htmlNumberPanels = this.route.snapshot.data['htmlNumberPanels']; }
  }

  constructor(
    // public pageService: PageService,
    private levelStructService: LevelStructService,
    private route: ActivatedRoute,
    private ioBrokerService: IOBrokerService,
    private ref: ChangeDetectorRef,
  ) {
    this.url = this.route.snapshot['_routerState'].url;
    console.log(this.url, 'constructor');
  }

  ngOnDestroy() {
    console.log(this.url, 'ngOnDestroy');
    this.subscription.forEach(e => {
      e.unsubscribe()
    })
  }

  ionViewWillEnter() {
    this.subscription.push(this.ioBrokerService.connectionState$.pipe(distinctUntilChanged()).subscribe(e => {
      if (e === CONNECTION_STATUS.connected) {
        let time1 = new Date().getTime()
        this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
          this.inputLevelObject,
          this.valueSelectionID,
          this.valueSelectionFilters,
        );
        this.ref.markForCheck();
        let time2 = new Date().getTime()
        console.log('In: ' + this.url, (time2 - time1));
      }
    }));
    let time1 = new Date().getTime()
    this.levelStruct$ = this.levelStructService.transformLevelObjectToLevelStruct(
      this.inputLevelObject,
      this.valueSelectionID,
      this.valueSelectionFilters,
    );
    this.ref.markForCheck();
    let time2 = new Date().getTime()
    console.log('Out: ' + this.url, (time2 - time1));
  }

  // ionViewDidEnter() { console.log(this.url, 'ionViewDidEnter'); }
  // ionViewWillLeave() { console.log(this.url, 'ionViewWillLeave'); }

  ionViewDidLeave() {
    this.subscription.forEach(e => {
      e.unsubscribe()
    })
    console.log(this.url, 'ionViewDidLeave'); 
    this.levelStructService.destroyLS(
      this.inputLevelObject,
      this.valueSelectionID,
      this.valueSelectionFilters,
    )
  }

}
