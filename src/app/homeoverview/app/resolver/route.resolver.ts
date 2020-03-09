import {
    Inject,
    Injectable
} from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service/data-service';
import { TabsComponent } from '../tabs/tabs/tabs.component';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class RouterResolver implements Resolve<boolean>
{
    constructor(
        @Inject(DataService) protected _service: DataService,
        private router: Router,
    ) {
        // empty
    }
    private baseComponents = {
        "TabsComponent": TabsComponent,
    }

    resolve(route, state): Observable<boolean> {
        let context = route.routeConfig.path
        // if(context === ''){
        //     context = 'app';
        // }
        // load layout model

        const createRoute = (observer) => {
            observer.next(false);

            let subj = <Observable<any>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
            subj.subscribe(config => {
                if (!(context in config)) {
                    observer.next(false);
                    observer.complete();
                } else {
                    let contextConfig = config[context];
                    contextConfig.components.forEach(c => {
                        c['data']['fullPath'] = `${context}/${c.path}`;
                    });
                    let routeConfig = {
                        path: context,
                        component: this.baseComponents[contextConfig['baseComponent']],
                        children: [],
                        data: contextConfig,
                    }
                    contextConfig.components.forEach(c => {
                        routeConfig.children.push({
                            path: c.path,
                            children: [{ path: '', loadChildren: () => import('../tabs/tabs.module').then(m => m[c.moduleName]) }],
                            data: c.data,
                            fullPath: c.fullPath
                        })
                    });

                    routeConfig.children.push({
                        path: '',
                        redirectTo: `/${context}/${contextConfig['defaultPath']}`,
                        pathMatch: 'full',
                    });
                    let oldRouterConfig = this.router.config.filter(e => e.path !== context)

                    this.router.resetConfig([
                        routeConfig,
                        ...oldRouterConfig
                        // {
                        //     path: '',
                        //     redirectTo: 'app/testtab',
                        //     pathMatch: 'full',
                        // },
                        // {
                        //     path: '**',
                        //     redirectTo: '',
                        //     pathMatch: 'full',
                        // }
                    ]);
                    
                    observer.next(true);
                    observer.complete();
                    this.router.navigate([`/${context}/${contextConfig['defaultPath']}`]);
                }
            });
        }

        let returnObs: Observable<boolean> = new Observable(createRoute);

        return returnObs;
    }
}