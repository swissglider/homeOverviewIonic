import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from 'src/app/declaration/route.declaration';


// const routes1: Routes = [
//   {
//     path: 'tabs',
//     component: TabsPage,
//     children: [
//       {
//         path: 'tab1',
//         children: [
//           {
//             path: '',
//             loadChildren: () =>
//               import('../tab1/tab1.module').then(m => m.Tab1PageModule)
//           }
//         ]
//       },
//       {
//         path: 'tab2',
//         children: [
//           {
//             path: '',
//             loadChildren: () =>
//               import('../tab2/tab2.module').then(m => m.Tab2PageModule)
//           }
//         ]
//       },
//       {
//         path: 'tab3',
//         children: [
//           {
//             path: '',
//             loadChildren: () =>
//               import('../tab3/tab3.module').then(m => m.Tab3PageModule)
//           }
//         ]
//       },
//       {
//         path: 'tab-lights',
//         children: [
//           {
//             path: '',
//             loadChildren: () =>
//               import('../tab-lights/tab-lights.module').then(m => m.TabLightsPageModule)
//           }
//         ]
//       },
//       {
//         path: '',
//         redirectTo: '/tabs/tab-lights',
//         pathMatch: 'full'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/tabs/tab-lights',
//     pathMatch: 'full'
//   }
// ];


// // routs are declared on the page-service

// function returnq():Routes {
//   return routes;
// }

// function generateRoutes():Routes {
//   let routes: Routes = [];
//   let children = [];
//   for (let [key, value] of Object.entries(PageDeclarations.pages)) {
//     children.push({
//       path: value.path,
//       children: [
//         {
//           path: '',
//           loadChildren: value.loadChildren
//         }
//       ]
//     });
//   }
//   children.push(
//     {
//       path: PageDeclarations.path,
//       redirectTo: PageDeclarations.redirectTo,
//       pathMatch: PageDeclarations.pathMatch
//     }
//   );
//   routes.push(
//     {
//       path: 'tabs',
//       component: TabsPage,
//       children: children
//     }
//   );
//   routes.push(
//     {
//       path: PageDeclarations.path,
//       redirectTo: PageDeclarations.redirectTo,
//       pathMatch: PageDeclarations.pathMatch
//     }
//   );
//   return routes;
// }

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // imports: [RouterModule.forChild(generateRoutes())],
  // imports: [RouterModule.forChild(returnq())],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
