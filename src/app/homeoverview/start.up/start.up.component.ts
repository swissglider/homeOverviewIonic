import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { IOBrokerService } from '../app/services/iobroker.service/iobroker.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { MessageToastService } from '../app/services/message.toast/message.toast.service';

@Component({
  selector: 'app-start-up',
  templateUrl: 'start.up.component.html',
  styleUrls: ['start.up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class StartUpComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  orgBodyBgrColor = '';

  constructor(
    public ioBrokerService: IOBrokerService,
    private elementRef: ElementRef,
    private navCtrl: NavController,
    private activeRoute: ActivatedRoute,
    private messageToastService: MessageToastService,
  ) {

    let protocol: string;
    let hostname: string;
    let port: number;
    let namespace: string;

    if (environment.production) {
      protocol = window.location.protocol;
      hostname = window.location.hostname;
      port = this.activeRoute.snapshot.data.model.startUp.defaultSocketPort;
      namespace = this.activeRoute.snapshot.data.model.startUp.socketNamespace;
    } else {
      protocol = environment.socket_protocol;
      hostname = environment.socket_hostname;
      port = this.activeRoute.snapshot.data.model.startUp.defaultSocketPort;
      namespace = this.activeRoute.snapshot.data.model.startUp.socketNamespace;
    }

    this.ioBrokerService.init(protocol, hostname, port, namespace);
    let timeObs$: Observable<boolean> = new Observable(this.createRoute)
    let tt$ = combineLatest(timeObs$, this.ioBrokerService.loaded$);
    this.subscriptions.push(tt$.subscribe(
      {
        next: (p: [boolean, boolean]) => { 
          if(p.every(e => e)){
            this.navCtrl.navigateForward('/app', { animated: false }).then(() => {
              this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.orgBodyBgrColor;
            });
          }
        },
        error: err => console.error('Observer got an error: ' + err),
        complete: () => { },
      }
    ));
  }

  ionViewWillEnter() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.orgBodyBgrColor = this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'green';
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
    }, this.activeRoute.snapshot.data.model.startUp.minimalStartUpShowTimeMS);
  };
}