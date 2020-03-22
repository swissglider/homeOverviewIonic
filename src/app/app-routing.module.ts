import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRouteResolver } from './homeoverview/_global/resolver/app-route.resolver';
import { RouterResolver } from './homeoverview/_global/resolver/route.resolver';
import { StartUpComponent } from './homeoverview/start.up/start.up.component'
import { StartUpResolver } from './homeoverview/_global/resolver/startUp-resolver';
// import { OldAppRouteResolver } from './oldapp/resolver/old-app-route.resolver'

const routes: Routes = [
  // {
  //   path: 'oldapp',
  //   resolve: { loaded: OldAppRouteResolver},
  //   loadChildren: () => import('./oldapp/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: 'app',
    resolve: { loadRouts: RouterResolver, model: AppRouteResolver},
    // component: TabsComponent,
    // loadChildren: () => import('./homeoverview/app/tabs/tabs/tabs.module').then(m => m.TabsPageModule),
    children: [
      {
        path: '**',
        resolve: { loadRouts: RouterResolver, model: AppRouteResolver},
        loadChildren: () => import('./homeoverview/app/tabs/tabs/tabs.module').then(m => m.TabsPageModule),
      }
    ]
  },
  {
    path: 'app/**',
    resolve: { loadRouts: RouterResolver, model: AppRouteResolver},
    loadChildren: () => import('./homeoverview/app/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'startUp',
    resolve: { loader: StartUpResolver },
    // resolve: { model: AppRouteResolver, loadRouts: RouterResolver },
    // loadChildren: () => import('./homeoverview/start.up/start.up.module').then(m => m.StartUpModule)
    component: StartUpComponent,
  },
  { path: '',
    redirectTo: '/startUp',
    pathMatch: 'full'
  },
  // {
  //   path: '**',
  //   redirectTo: 'app'
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
