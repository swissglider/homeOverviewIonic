import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStatesComponent } from './app.states/app.states.component';
import { AppViewsComponent } from './app.views/app.views.component';
import { MenuModule } from '../../modules/menu/menu.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule
  ],
  declarations: [AppStatesComponent, AppViewsComponent],
  exports: [AppStatesComponent, AppViewsComponent]
})
export class AppStatesViewModule { }