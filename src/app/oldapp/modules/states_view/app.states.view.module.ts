import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppViewsComponent } from './app.views/app.views.component';
import { MenuModule } from '../../modules/menu/menu.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    ChartsModule,
  ],
  declarations: [AppViewsComponent],
  exports: [AppViewsComponent]
})
export class AppStatesViewModule { }