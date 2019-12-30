import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabFunctionsPage } from './tab-functions.page';
import { MenuModule } from '../menu/menu.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    RouterModule.forChild([{ path: '', component: TabFunctionsPage }])
  ],
  declarations: [TabFunctionsPage]
})
export class TabFunctionsPageModule {}