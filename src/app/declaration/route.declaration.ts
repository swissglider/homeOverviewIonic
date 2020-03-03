import { Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs/tabs.page';

export const routes: Routes = [
    {
      path: 'tabs',
      component: TabsPage,
      children: [
        // {
        //   path: 'folder-test',
        //   children: [{ path: '', loadChildren: () => import('../tabs/folder.test/folder_test.module').then(m => m.Folder_TestPageModule) }]
        // },
        // {
        //   path: 'wrong-enum-entry',
        //   children: [{ path: '', loadChildren: () => import('../tabs/wrong-enums-entry/wrong-enums-entry.module').then(m => m.WrongEnumEntryModule) }]
        // },
        // {
        //   path: 'long-not-updated',
        //   children: [{ path: '', loadChildren: () => import('../tabs/long-not-updated/long-not-updated.module').then(m => m.LongNotUpdatedModule) }]
        // },
        // {
        //   path: 'tab-functions',
        //   children: [{ path: '', loadChildren: () => import('../tabs/tab-functions/tab-functions.module').then(m => m.TabFunctionsPageModule) }]
        // },
        // {
        //   path: 'admin_level_struct_generator',
        //   children: [{ path: '', loadChildren: () => import('../tabs/admin.level-struct.generator/admin.level-struct.generator.module').then(m => m.AdminLevelStructGeneratorModule) }]
        // },
        // {
        //   path: 'overview',
        //   children: [{ path: '', loadChildren: () => import('../tabs/overview/overview.module').then(m => m.OverviewModule) }]
        // },
        {
          path: 'overview_compact',
          children: [{ path: '', loadChildren: () => import('../tabs/overview.compact/overview.compact.module').then(m => m.OverviewCompactModule) }]
        },
        {
          path: 'overview_lights',
          children: [{ path: '', loadChildren: () => import('../tabs/overview.lights/overview.lights.module').then(m => m.OverviewLightsModule) }]
        },
        {
          path: 'overview_doors',
          children: [{ path: '', loadChildren: () => import('../tabs/overview.doors/overview.doors.module').then(m => m.OverviewDoorsModule) }]
        },
        {
          path: 'overview_windows',
          children: [{ path: '', loadChildren: () => import('../tabs/overview.windows/overview.windows.module').then(m => m.OverviewWindowsModule) }]
        },
        // {
        //   path: 'tab-lights',
        //   redirectTo: '/tabs/tab-functions?function=enum.functions.light',
        //   pathMatch: 'full'
        // },
        // {
        //   path: 'tab-doors',
        //   redirectTo: '/tabs/tab-functions?function=enum.functions.doors',
        //   pathMatch: 'full'
        // },
        // {
        //   path: 'tab-windows',
        //   redirectTo: '/tabs/tab-functions?function=enum.functions.window',
        //   pathMatch: 'full'
        // },
        {
          path: '',
          redirectTo: '/tabs/overview_compact',
          pathMatch: 'full'
        }
      ]
    },
    {
      path: '',
      redirectTo: '/tabs/overview_compact',
      pathMatch: 'full'
    }
  ];