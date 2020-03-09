import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service/data-service';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AppRouteResolver implements Resolve<any>
{
    constructor(@Inject(DataService) protected _service: DataService) {
        // empty
    }

    resolve(): Observable<any> {
        // load layout model
        let subj = <Observable<any>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
        return subj;
    }
}