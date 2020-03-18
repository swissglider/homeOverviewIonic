import { Component, OnInit, ChangeDetectionStrategy, NgZone, OnChanges, SimpleChanges, DoCheck, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMsgStore } from '../../store/error/error-msg.store';
import { ErrorMsg, ErrorMsgSeverity, ErrorMsgScope, ErrorMsgLogging } from '../../store/error/error-msg.model';
import { ErrorMsgQuery } from '../../store/error/error-msg.query';
import { ModalController, PopoverController } from '@ionic/angular';
import { ErrorLoggerModal } from './error.logger.modal/error.logger.modal';
import { ErrorLoggerPopoverComponent } from './popover/error.logger.popover.component';
import { Observable, Subscription } from 'rxjs';
import { persistState } from '@datorama/akita';
import { map, distinct } from 'rxjs/operators';
import { InputButtons } from '../../components/menu/menu.model';

@Component({
    selector: 'app-error-logger',
    templateUrl: 'error.logger.tab.html',
    styleUrls: ['error.logger.tab.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLoggerComponent implements OnInit, DoCheck {

    @ViewChild('Content') content;

    public aas: { id: number, value: string }[] = Array.from(Array(100).keys()).map(e => { return { id: e, value: `value is : ${e}` } });

    public errorMsgs$: Observable<ErrorMsg[]>;
    public errorMsgSeverityPossibleFilters$: Observable<ErrorMsgSeverity[]>;
    public errorMsgScopePossibleFilters$: Observable<ErrorMsgScope[]>;
    public errorcodePossibleFilters$: Observable<string[]>;

    public errorMsgSeverity = ErrorMsgSeverity;
    public errorMsgScopeType = ErrorMsgScope;

    public errorMsgSeverityFilter: ErrorMsgSeverity[] = [];
    public errorMsgScopeFilter: ErrorMsgScope[] = [];
    public errorcodeFilter: string[] = [];



    trackById = (index: number, item: any) => item.id;

    buttons: InputButtons = {
        buttons : [{
          buttonID: 'delBtn',
          showText: 'Delete MSGs',
          value: true
        }]
      }

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private errorMsgStore: ErrorMsgStore,
        private errorMsgQuery: ErrorMsgQuery,
        public modalController: ModalController,
        public popoverController: PopoverController,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.errorMsgs$ = this.errorMsgQuery.selectAll({
            filterBy: entity => {
                if (!entity.logging.includes(ErrorMsgLogging.CONSOLE)) { return false };
                return true;
            }
        });
        this.errorMsgSeverityPossibleFilters$ = this.errorMsgQuery.selectAll({
            filterBy: entity => {
                if (!entity.logging.includes(ErrorMsgLogging.CONSOLE)) { return false };
                return true;
            }
        }).pipe(map((errorMsgArr: ErrorMsg[]) => [...new Set(errorMsgArr.map((errorMsg) => errorMsg.severity))]));
        this.errorMsgScopePossibleFilters$ = this.errorMsgQuery.selectAll({
            filterBy: entity => {
                if (!entity.logging.includes(ErrorMsgLogging.CONSOLE)) { return false };
                return true;
            }
        }).pipe(map((errorMsgArr: ErrorMsg[]) => [...new Set(errorMsgArr.map((errorMsg) => errorMsg.scope))]));
        this.errorcodePossibleFilters$ = this.errorMsgQuery.selectAll({
            filterBy: entity => {
                if (!entity.logging.includes(ErrorMsgLogging.CONSOLE)) { return false };
                return true;
            }
        }).pipe(map((errorMsgArr: ErrorMsg[]) => [...new Set(errorMsgArr.map((errorMsg) => errorMsg.errorcode))]));

        if (this.errorMsgScopeFilter.length === 0) { this.errorMsgScopeFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.scope))] };
    }
    ionViewWillEnter() {
        if(this.content){
            this.content.scrollToBottom(0);
        }
      }

    ngDoCheck() {
        // console.log('ngDoCheck')
        if(this.content){
            this.content.scrollToBottom(0);
        }
    }

    async presentModal(eMsg: ErrorMsg) {
        const modal = await this.modalController.create({
            component: ErrorLoggerModal,
            swipeToClose: true,
            componentProps: {
                errorMsg: eMsg,
            },
            // presentingElement: this.routerOutlet.nativeEl,
            animated: false
        });
        modal.onDidDismiss().then((detail) => {
            if (detail !== null) {
            }
        });
        return await modal.present();
    }

    async errorCodePopover(ev: any) {
        if (this.errorcodeFilter.length === 0) { this.errorcodeFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.errorcode))] };
        const popover = await this.popoverController.create({
            component: ErrorLoggerPopoverComponent,
            event: ev,
            translucent: false,
            componentProps: {
                obs$: this.errorcodePossibleFilters$,
                filterArray: this.errorcodeFilter,
            }
        });
        popover.onDidDismiss().then((detail) => {
            if (detail.data && 'filterArray' in detail.data) {
                this.errorcodeFilter = detail.data.filterArray;
                this.doFilter();
            }
        });
        return await popover.present();
    }

    async severityPopover(ev: any) {
        if (this.errorMsgSeverityFilter.length === 0) { this.errorMsgSeverityFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.severity))] };
        const popover = await this.popoverController.create({
            component: ErrorLoggerPopoverComponent,
            event: ev,
            translucent: false,
            componentProps: {
                obs$: this.errorMsgSeverityPossibleFilters$,
                enumType: ErrorMsgSeverity,
                filterArray: this.errorMsgSeverityFilter,
            }
        });
        popover.onDidDismiss().then((detail) => {
            if (detail.data && 'filterArray' in detail.data) {
                this.errorMsgSeverityFilter = detail.data.filterArray;
                this.doFilter();
            }
        });
        return await popover.present();
    }

    doFilter() {
        if (this.errorcodeFilter.length === 0) { this.errorcodeFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.errorcode))] };
        if (this.errorMsgSeverityFilter.length === 0) { this.errorMsgSeverityFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.severity))] };
        if (this.errorMsgScopeFilter.length === 0) { this.errorMsgScopeFilter = [...new Set(this.errorMsgQuery.getAll().map(e => e.scope))] };
        this.errorMsgs$ = this.errorMsgQuery.selectAll({
            filterBy: entity => {
                if (!entity.logging.includes(ErrorMsgLogging.CONSOLE)) { return false };
                if (!this.errorcodeFilter.includes(entity.errorcode)) { return false };
                if (!this.errorMsgScopeFilter.includes(entity.scope)) { return false };
                if (!this.errorMsgSeverityFilter.includes(entity.severity)) { return false };
                return true;
            }
        });
        this.cdr.markForCheck();
    }

    deleteErrorMessages($event) {
        if($event.buttonID === 'delBtn'){
            const storage = persistState();
            storage.clearStore('ErrorMsgState');
            this.errorMsgStore.remove();
        }
    }

}