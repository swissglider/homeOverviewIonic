import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';


// const routes: Routes = [
//   {
//     path: 'app',
//     component: TabsComponent,
//     children: [
//       {
//         path: 'testtab',
//         children: [{ path: '', loadChildren: () => import('../test.tab/test.tab.module').then(m => m.TestTabModule) }]
//       },
//       {
//         path: 'testtab1',
//         children: [{ path: '', loadChildren: () => import('../test1.tab/test.tab.module').then(m => m.TestTabModule) }]
//       },
//       {
//         path: 'testtab2',
//         children: [{ path: '', loadChildren: () => import('../test2.tab/test.tab.module').then(m => m.TestTabModule) }]
//       },
//       {
//         path: 'testtab3',
//         children: [{ path: '', loadChildren: () => import('../test3.tab/test.tab.module').then(m => m.TestTabModule) }]
//       },
//       {
//         path: '',
//         redirectTo: '/app/testtab',
//         pathMatch: 'full'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/app/testtab',
//     pathMatch: 'full'
//   }
// ];

const routes1: Routes = [
  {
    path: 'app',
    component: TabsComponent,
  },
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  }
]

@NgModule({
  // imports: [RouterModule.forChild(routes)],
  imports: [RouterModule.forChild(routes1)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
