import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CONNECTION_STATUS } from '../../../_global/services/iobroker.service/iobroker.service.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IOBrokerService } from '../../../_global/services/iobroker.service/iobroker.service';
import { AnimationController, PopoverController } from '@ionic/angular';
import { StatusDotPopoverComponent } from './popover/status.dot.popover.component';

@Component({
    selector: 'status-dot-component',
    templateUrl: 'status.dot.component.html',
    styleUrls: ['status.dot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDotComponent implements OnInit, OnDestroy {


    public _CONNECTION_STATUS = CONNECTION_STATUS;
    public dot1_e_name: string;
    public dot2_e_name: string;
    public dot3_e_name: string;
    public dot4_e_name: string;
    public dot1;
    public dot2;
    public dot3;
    public dot4;
    public dot;
    private dotPingColor: string = 'red';
    private subscriptions: Subscription[] = [];

    constructor(
        public route: ActivatedRoute,
        public ioBroverService: IOBrokerService,
        private animationCtrl: AnimationController,
        public popoverController: PopoverController,
    ) {
        this.dot1_e_name = `${this.route.snapshot.data.componentName}_dot1`;
        this.dot2_e_name = `${this.route.snapshot.data.componentName}_dot2`;
        this.dot3_e_name = `${this.route.snapshot.data.componentName}_dot3`;
        this.dot4_e_name = `${this.route.snapshot.data.componentName}_dot4`;
    }

    ngAfterViewInit() {
        // console.log('ngAfterViewInit')
        this.reInitAnimation();
    }

    private reInitAnimation() {
        if (this.dot) {
            this.dot.stop();
        }
        this.initDotAnimation();
        this.dot.play();
    }

    private initDotAnimation() {
        this.dot1 = this.animationCtrl.create()
            .addElement(document.querySelector('#' + this.dot1_e_name))
            .duration(15000)
            .fill('none')
            .keyframes([
                { offset: 0 / 6, background: 'var(--background-color)' },
                { offset: 1 / 6, background: this.dotPingColor },
                { offset: 1, background: 'var(--background-color)' }
            ]);
        this.dot2 = this.animationCtrl.create()
            .addElement(document.querySelector('#' + this.dot2_e_name))
            .duration(15000)
            .fill('none')
            .keyframes([
                { offset: 0 / 6, background: 'var(--background-color)' },
                { offset: 2 / 6, background: this.dotPingColor },
                { offset: 1, background: 'var(--background-color)' }
            ]);
        this.dot3 = this.animationCtrl.create()
            .addElement(document.querySelector('#' + this.dot3_e_name))
            .duration(15000)
            .fill('none')
            .keyframes([
                { offset: 0 / 6, background: 'var(--background-color)' },
                { offset: 3 / 6, background: this.dotPingColor },
                { offset: 1, background: 'var(--background-color)' }
            ]);
        this.dot4 = this.animationCtrl.create()
            .addElement(document.querySelector('#' + this.dot4_e_name))
            .duration(15000)
            .fill('none')
            .keyframes([
                { offset: 0 / 6, background: 'var(--background-color)' },
                { offset: 4 / 6, background: this.dotPingColor },
                { offset: 1, background: 'var(--background-color)' }
            ]);
        this.dot = this.animationCtrl.create()
            // .duration(400)
            .iterations(Infinity)
            .addAnimation([this.dot1, this.dot2, this.dot3, this.dot4]);
    }

    ngOnInit(): void {
        //   console.log('Menu:ngOnInit')
          this.subscriptions.push(this.ioBroverService.connectionState$.subscribe((e: CONNECTION_STATUS) => {
            switch (e) {
              case CONNECTION_STATUS.disconnected:
                this.dotPingColor = 'red';
                this.reInitAnimation();
                break;
              case CONNECTION_STATUS.reconnecting:
                this.dotPingColor = 'orange'
                this.reInitAnimation();
                break;
              case CONNECTION_STATUS.connected:
                this.dotPingColor = 'yellow'
                this.reInitAnimation();
                break;
              case CONNECTION_STATUS.loaded:
                this.dotPingColor = 'green'
                this.reInitAnimation();
                break;
            }
          }))
    }

    ngOnDestroy() {
        this.subscriptions.forEach(e => {
            e.unsubscribe()
        });
    }

    async statusDotPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: StatusDotPopoverComponent,
            event: ev,
            translucent: false,
            componentProps: {
                connectionStatus$: this.ioBroverService.connectionState$,
                // enumType: ErrorMsgSeverity,
                // filterArray: this.errorMsgSeverityFilter,
            },
            // cssClass: 'pop-over-style'
        });
        popover.onDidDismiss().then((detail) => {});
        popover.style.cssText = '--min-width: 90%; --max-width: 90%;';
        return await popover.present();
    }
}