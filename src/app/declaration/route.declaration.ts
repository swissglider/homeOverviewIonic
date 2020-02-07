import { Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs/tabs.page';

export const routes: Routes = [
    {
      path: 'tabs',
      component: TabsPage,
      children: [
        {
          path: 'tab1',
          children: [{ path: '', loadChildren: () => import('../tabs/tab1/tab1.module').then(m => m.Tab1PageModule) }]
        },
        {
          path: 'tab2',
          children: [{ path: '', loadChildren: () => import('../tabs/tab2/tab2.module').then(m => m.Tab2PageModule) }]
        },
        {
          path: 'tab3',
          children: [{ path: '', loadChildren: () => import('../tabs/tab3/tab3.module').then(m => m.Tab3PageModule) }]
        },
        {
          path: 'wrong-enum-entry',
          children: [{ path: '', loadChildren: () => import('../tabs/wrong-enums-entry/wrong-enums-entry.module').then(m => m.WrongEnumEntryModule) }]
        },
        {
          path: 'long-not-updated',
          children: [{ path: '', loadChildren: () => import('../tabs/long-not-updated/long-not-updated.module').then(m => m.LongNotUpdatedModule) }]
        },
        {
          path: 'tab-functions',
          children: [{ path: '', loadChildren: () => import('../tabs/tab-functions/tab-functions.module').then(m => m.TabFunctionsPageModule) }]
        },
        {
          path: 'functions',
          children: [{ path: '', loadChildren: () => import('../tabs/functions/functions.module').then(m => m.FunctionsModule) }]
        },
        {
          path: 'tab-lights',
          redirectTo: '/tabs/tab-functions?function=enum.functions.light',
          pathMatch: 'full'
        },
        {
          path: 'tab-doors',
          redirectTo: '/tabs/tab-functions?function=enum.functions.doors',
          pathMatch: 'full'
        },
        {
          path: 'tab-windows',
          redirectTo: '/tabs/tab-functions?function=enum.functions.window',
          pathMatch: 'full'
        },
        {
          path: '',
          redirectTo: '/tabs/tab-functions?function=enum.functions.light',
          pathMatch: 'full'
        }
      ]
    },
    {
      path: '',
      redirectTo: '/tabs/tab-functions?function=enum.functions.light',
      pathMatch: 'full'
    }
  ];