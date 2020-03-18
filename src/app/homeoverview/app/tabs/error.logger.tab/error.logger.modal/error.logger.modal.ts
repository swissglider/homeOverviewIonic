import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ErrorMsg, ErrorMsgSeverity, ErrorMsgScope, ErrorMsgLogging } from '../../../store/error/error-msg.model';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-error-logger-modal',
    templateUrl: './error.logger.modal.html',
    styleUrls: ['./error.logger.modal.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLoggerModal implements OnInit {

    @Input() errorMsg: ErrorMsg;
    public selectedView:string = 'main';
    public errorMsgSeverity = ErrorMsgSeverity;
    public errorMsgScope = ErrorMsgScope;
    public errorMsgLogging = ErrorMsgLogging;

    constructor(
        private modalController: ModalController,) {

    }

    ngOnInit(): void {
    }

    segmentChanged(ev: any) {
        this.selectedView = ev.detail.value;
      }

    async myDismiss() {
        await this.modalController.dismiss('');
    }
}