import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { IOBrokerService } from '../service/io-broker.service';


@Injectable({ providedIn: 'root' })
export class OldAppRouteResolver implements Resolve<boolean>
{
    constructor(@Inject(IOBrokerService) protected _service: IOBrokerService) {
        // empty
    }

    resolve(): Observable<boolean> {
        // load layout model
        const initIOBrokerServies = (observer) => {
            // this._service.init();
            observer.next(false);
            let subsc = this._service.selectLoaded().subscribe(e => {
                if(e){
                    observer.next(true);
                    observer.complete();
                    // subsc.unsubscribe();
                }
            });
        }
        let returnObs: Observable<boolean> = new Observable(initIOBrokerServies);
        return returnObs;
    }
}