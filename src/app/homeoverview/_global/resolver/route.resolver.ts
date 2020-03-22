import {
    Inject,
    Injectable,
    NgZone,
    OnDestroy
} from '@angular/core';

import { Resolve, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service/data-service';
import { TabsComponent } from '../../app/tabs/tabs/tabs.component';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AppRouteResolver } from './app-route.resolver';


@Injectable({ providedIn: 'root' })
export class RouterResolver implements Resolve<boolean>, OnDestroy {

    private subscriptions = []

    constructor(
        @Inject(DataService) protected _service: DataService,
        private router: Router,
        private ngZone: NgZone,
    ) {
        // empty
    }
    private baseComponents = {
        "TabsComponent": TabsComponent,
    }

    ngOnDestroy() {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe()
        }
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
            this.subscriptions.push(subj.subscribe(config => {
                let org_url:string = null;
                if('_routerState' in route && 'url' in route._routerState){
                    org_url = route._routerState.url
                }
                if (!(context in config)) {
                    let conf = this.router.config.find(e => e.path === context);
                    if(conf) { conf['general'] = config['general']; }
                    observer.next(false);
                    observer.complete();
                } else {
                    let contextConfig = config[context];
                    if('components' in contextConfig){
                        contextConfig.components.forEach(c => {
                            c['data']['fullPath'] = `${context}/${c.path}`;
                        });
                        let routeConfig = {
                            path: context,
                            resolve: { model: AppRouteResolver},
                            component: this.baseComponents[contextConfig['baseComponent']],
                            children: [],
                            data: contextConfig,
                        }
                        contextConfig.components.forEach(c => {
                            routeConfig.children.push({
                                path: c.path,
                                resolve: { model: AppRouteResolver},
                                children: [{ path: '', loadChildren: () => import('../../app/tabs/tabs.module').then(m => m[c.moduleName]) }],
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
                    }
                    let splitted = org_url.split('/');
                    let conf = this.router.config.find(e => e.path === context);
                    conf['general'] = config['general'];
                    conf['content'] = config[context];
                    if(splitted.length > 2){
                        conf['_subPath'] = splitted[2];
                    }
                    if(splitted.length <= 2 && '_subPath' in route.routeConfig){
                        delete conf['_subPath'];
                    }

                    observer.next(true);
                    observer.complete();
                    this.ngZone.run(() => {
                        if(org_url && org_url === `/${context}` && 'defaultPath' in contextConfig){
                            this.router.navigate([`/${context}/${contextConfig['defaultPath']}`]);
                        } else {
                            // this.router.navigate([`/${context}`])
                            this.router.navigate([state.url])
                        }
                    });
                }
            }));
        }

        let returnObs: Observable<boolean> = new Observable(createRoute);

        return returnObs;
    }
}