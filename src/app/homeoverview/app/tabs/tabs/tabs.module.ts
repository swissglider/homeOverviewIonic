import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TabsComponent } from './tabs.component';
import { PipeModule } from '../../../_global/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { StatusDotModule } from '../../components/status_dots/status.dot.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    PipeModule,
    StatusDotModule,
    RouterModule.forChild([{ path: '', component: TabsComponent }]),
  ],
  declarations: [TabsComponent]
})
export class TabsPageModule {}