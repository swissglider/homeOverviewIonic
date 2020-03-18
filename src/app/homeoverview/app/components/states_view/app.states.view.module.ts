import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppViewsComponent } from './app.views/app.views.component';
import { ChartsModule } from 'ng2-charts';
import { PipeModule } from '../../../_global/pipes/pipes.module';
import { MenuModule } from '../menu/menu.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChartsModule,
    PipeModule,
    MenuModule,
  ],
  declarations: [AppViewsComponent],
  exports: [AppViewsComponent]
})
export class AppStatesViewModule { }