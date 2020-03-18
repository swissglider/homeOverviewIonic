import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorMsgSeverity, ErrorMsgScope } from '../../../store/error/error-msg.model';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-error-logger_popover',
    // template: `
    //     hallo Guido
    // `,
    templateUrl: 'error.logger.popover.component.html',
    // styleUrls: ['error.logger.tab.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorLoggerPopoverComponent implements OnInit {

    @Input() obs$: Observable<any>;
    @Input() enumType;

    @Input() filterArray: any[] = [];

    constructor(
        private popoverController: PopoverController,
    ){}

    ngOnInit(): void {}

    selected($event, value){
        if($event.detail.checked){
            this.filterArray.push(value);
        } else{
            this.filterArray = this.filterArray.filter(e => e !== value);
        }
    }

    async change() {
        this.filterArray = [...new Set(this.filterArray)]
        await this.popoverController.dismiss({filterArray: this.filterArray});
    }
    
}
