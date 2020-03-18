import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve, Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { DataService } from '../services/data.service/data-service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { IOBrokerService } from '../services/iobroker.service/iobroker.service';


@Injectable({ providedIn: 'root' })
export class AppRouteResolver implements Resolve<any>{

    private subscriptions = []

    constructor(
        @Inject(DataService) protected _service: DataService,
        private router: Router,
        private ioBService: IOBrokerService,
    ) {
        // empty
    }



    ngOnDestroy() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe()
        }
    }

    resolve(route, state): Observable<any> {
        const createRoute = (observer) => {
            observer.next(false);

            // let ttt$ = selectPersistStateInit().pipe(take(1))
            // ttt$.subscribe({
            //   next: p => {
            //     console.log(p)
            //   }
            // })
            let tt$ = combineLatest(this.ioBService.loaded$).pipe(distinctUntilChanged());
            this.subscriptions.push(tt$.subscribe(finished => {
                if (finished.every(e => e)) {
                    observer.next(true);
                    observer.complete();
                }
            }));
        };

        let returnObs: Observable<boolean> = new Observable(createRoute);
        return returnObs;
    }
}