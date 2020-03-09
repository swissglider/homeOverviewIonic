import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsComponent } from './tabs.component';
import { PipeModule } from '../../pipes/pipes.module';
// import { StartUpModule } from '../../start.up/start.up.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule,
    PipeModule,
    // StartUpModule,
  ],
  declarations: [TabsComponent]
})
export class TabsPageModule {}