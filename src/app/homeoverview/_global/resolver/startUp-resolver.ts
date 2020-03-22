import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IOBrokerService } from '../services/iobroker.service/iobroker.service';


@Injectable({ providedIn: 'root' })
export class StartUpResolver implements Resolve<Observable<boolean>>{

    private subscriptions = []

    constructor(
        private ioBService: IOBrokerService,
    ) {
        // empty
    }



    ngOnDestroy() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe()
        }
    }

    resolve(route, state): Observable<Observable<boolean>> {
        const createRoute = (observer) => {
            observer.next(combineLatest(this.ioBService.loaded$).pipe(distinctUntilChanged()));
            observer.complete();
        };

        let returnObs: Observable<Observable<boolean>> = new Observable(createRoute);
        return returnObs;
    }
}