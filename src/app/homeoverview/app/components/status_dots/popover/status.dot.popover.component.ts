import { Component, ChangeDetectionStrategy, Input} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CONNECTION_STATUS } from '../../../../_global/services/iobroker.service/iobroker.service.model';

@Component({
    selector: 'status-dot-logger_popover',
    templateUrl: 'status.dot.popover.component.html',
    styleUrls: ['status.dot.popover.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusDotPopoverComponent{

    @Input() connectionStatus$: Observable<any>;
    public _CONNECTION_STATUS = CONNECTION_STATUS;

    constructor(
        private popoverController: PopoverController,
    ){}

    async change() {
        await this.popoverController.dismiss();
    }
    
}
