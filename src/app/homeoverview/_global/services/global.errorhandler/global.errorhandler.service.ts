import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorMsgStore } from '../../../app/store/error/error-msg.store';
import { ErrorMsgSeverity, ErrorMsgScope, ErrorMsgLogging } from '../../../app/store/error/error-msg.model';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private errorMsgStore: ErrorMsgStore, ) { }

    handleError(error: Error) {
        console.error(error)

        let message = {
            severity: ErrorMsgSeverity.ERROR,
            text: error.message ? error.message : error.message,
            action: 'Not know what to do',
            scope: ErrorMsgScope.GLOBAL,
            logging: [ErrorMsgLogging.CONSOLE],
            stack: error.stack ? error.stack : '',
            errorcode: 'GEH-0000',
        }
        this.errorMsgStore.addNewErrorMsg(message);


        // Log  the error
        // console.log(message);
    }
}