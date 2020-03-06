import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './test.app/services/data.service/data-service';
import { LayoutModel, ComponentModel } from './test.app/services/model/menu.model';
import { TabsComponent } from './test.app/tabs/tabs/tabs.component';
import { Router } from '@angular/router';
import { environment } from './../environments/environment';


@Injectable({ providedIn: 'root' })
export class RouterResolver implements Resolve<boolean>
{
    constructor(
        @Inject(DataService) protected _service: DataService,
        private router: Router,
    ) {
        // empty
    }

    resolve(): Observable<boolean> {
        // load layout model

        const createRoute = (observer) => {
            observer.next('false');

            let subj = <Observable<LayoutModel>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
            subj.subscribe(e => {
                let routeConfig = {
                    path: 'app',
                    component: TabsComponent,
                    children: [],
                }
                e.apps.forEach((c: ComponentModel) => {
                    routeConfig.children.push({
                        path: c.path,
                        children: [{ path: '', loadChildren: () => import('../app/test.app/tabs/tabs.module').then(m => m[c.moduleName]) }],
                        data: c.data
                    })
                });

                routeConfig.children.push({
                    path: '',
                    redirectTo: '/app/' + e.apps[0].path,
                    pathMatch: 'full',
                    data: e,
                });

                this.router.resetConfig([
                    routeConfig,
                    {
                        path: '',
                        redirectTo: '/app/testtab',
                        pathMatch: 'full',
                    }
                ])

                observer.next('true');
                observer.complete();
            });
        }

        let returnObs: Observable<boolean> = new Observable(createRoute);

        return returnObs;
    }
}