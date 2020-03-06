import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './test.app/services/data.service/data-service';
import { LayoutModel} from './test.app/services/model/menu.model';
import { environment } from './../environments/environment';


@Injectable({ providedIn: 'root' })
export class AppRouteResolver implements Resolve<LayoutModel>
{
    constructor(@Inject(DataService) protected _service: DataService) {
        // empty
    }

    resolve(): Observable<LayoutModel> {
        // load layout model
        let subj = <Observable<LayoutModel>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
        return subj;
    }
}