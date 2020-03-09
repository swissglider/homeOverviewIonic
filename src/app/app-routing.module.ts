import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRouteResolver } from './homeoverview/app/resolver/app-route.resolver';
import { RouterResolver } from './homeoverview/app/resolver/route.resolver';
import { StartUpComponent } from './homeoverview/start.up/start.up.component'

const routes: Routes = [
  {
    path: 'oldapp',
    loadChildren: () => import('./oldapp/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'app',
    resolve: { model: AppRouteResolver, loadRouts: RouterResolver },
    loadChildren: () => import('./homeoverview/app/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'starUp',
    // resolve: { model: AppRouteResolver, loadRouts: RouterResolver },
    // loadChildren: () => import('./homeoverview/start.up/start.up.module').then(m => m.StartUpModule)
    component: StartUpComponent,
  },
  { path: '',
    redirectTo: '/starUp',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'starUp'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
