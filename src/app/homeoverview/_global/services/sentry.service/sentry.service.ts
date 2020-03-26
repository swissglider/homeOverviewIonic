import { Injectable, OnDestroy } from '@angular/core';
import * as Sentry from "@sentry/browser";
import { ErrorMsgQuery } from 'src/app/homeoverview/app/store/error/error-msg.query';
import { Subscription } from 'rxjs';
import { EntityActions } from '@datorama/akita';
import { environment } from 'src/environments/environment';

if(environment.production){
    Sentry.init({
        dsn: "https://866e6e1ac12a40a2a48a50c718e63373@sentry.io/5171590"
    });
}

@Injectable({ providedIn: 'root' })
export class SentryService implements OnDestroy {

    private subscription: Subscription;

    constructor(
        private errorMsgQuery: ErrorMsgQuery,
    ) {
        if(environment.production){
            this.subscription = this.errorMsgQuery.selectEntityAction(EntityActions.Add).subscribe(action => {
                action.forEach(id => {
                    let errorMSG = this.errorMsgQuery.getEntity(id);
                    if(errorMSG.severity >= 6){
                        Sentry.captureException(errorMSG);
                    }
                });
            })
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}