import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverviewDoorsPage } from './overview.doors.page';
import { MenuModule } from '../../modules/menu/menu.module';
import { AppStatesViewModule } from '../../modules/states_view/app.states.view.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    AppStatesViewModule,
    RouterModule.forChild([{ path: '', component: OverviewDoorsPage }]),
  ],
  declarations: [ 
    OverviewDoorsPage,
  ],
  entryComponents: [
  ],
})
export class OverviewDoorsModule {}