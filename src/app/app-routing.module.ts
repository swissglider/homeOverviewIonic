import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRouteResolver } from './app-route.resolver';
import { RouterResolver } from './route.resolver';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: '',
    resolve: { model: AppRouteResolver, loadRouts: RouterResolver },
    loadChildren: () => import('./test.app/tabs/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '**',
    redirectTo: ''
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
