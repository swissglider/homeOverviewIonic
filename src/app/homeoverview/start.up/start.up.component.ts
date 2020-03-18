import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, Renderer2, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-start-up',
  templateUrl: 'start.up.component.html',
  styleUrls: ['start.up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartUpComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  orgBodyBgrColor = '';
  sartUpBodyBgrColor = 'green'

  constructor(
    private elementRef: ElementRef,
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private ngZone: NgZone,
  ) { }

  ionViewWillEnter() {
    if (this.elementRef === null || this.elementRef === undefined) { return }
    this.renderer.setStyle(this.elementRef.nativeElement.ownerDocument.body, 'backgroundColor', this.sartUpBodyBgrColor);
    let timeObs$: Observable<boolean> = new Observable(this.createRoute);
    this.subscriptions.push(timeObs$.pipe(distinctUntilChanged()).subscribe(
      {
        next: (p: boolean) => {
          if (p) {
            this.ngZone.run(() => {
              this.navCtrl.navigateForward('/app', { animated: false }).then(() => {
                this.renderer.setStyle(this.elementRef.nativeElement.ownerDocument.body, 'backgroundColor', this.orgBodyBgrColor);
              });
            });
          }
        },
        error: err => console.error(err),
        complete: () => { },
      }
    ));
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.elementRef === null || this.elementRef === undefined) { return }
    this.orgBodyBgrColor = this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor
    this.renderer.setStyle(this.elementRef.nativeElement.ownerDocument.body, 'backgroundColor', this.sartUpBodyBgrColor);
  }

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
    }, this.activeRoute.snapshot.routeConfig['content']['minimalStartUpShowTimeMS']);
  };
}