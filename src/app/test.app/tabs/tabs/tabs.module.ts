import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsComponent } from './tabs.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsComponent]
})
export class TabsPageModule {}