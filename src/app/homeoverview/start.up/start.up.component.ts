import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, NgZone, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { NavController } from '@ionic/angular';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataService } from '../_global/services/data.service/data-service';

@Component({
  selector: 'app-start-up',
  templateUrl: 'start.up.component.html',
  styleUrls: ['start.up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartUpComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private minimalStartUpShowTimeMS: number;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    @Inject(DataService) protected _service: DataService,
  ) { }

  ionViewWillEnter() {
    let subj$ = <Observable<any>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
    this.subscriptions.push(subj$.subscribe(e => {
      this.minimalStartUpShowTimeMS = e.startUp.minimalStartUpShowTimeMS;
      let timeObs$: Observable<boolean> = new Observable(this.createRoute);
      let tt$ = combineLatest(timeObs$, this.route.snapshot.data.loader).pipe(distinctUntilChanged());
      this.subscriptions.push(tt$.subscribe({
        next: (p: any[]) => {
          if ((p) && Array.isArray(p) && p.length === 2 && Array.isArray(p[1]) && p[0] && p[1][0]) {
            this.ngZone.run(() => {
              this.navCtrl.navigateForward('/app', { animated: false });
            });
          }
        },
        error: err => console.error(err),
        complete: () => { },
      }));
    }));
  }

  ngOnInit(): void { }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
  }

  private createRoute = (observer) => {
    observer.next(false);
    setTimeout(() => {
      observer.next(true);
      observer.complete();
    }, this.minimalStartUpShowTimeMS);
  };
}