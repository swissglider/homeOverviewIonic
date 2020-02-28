import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverviewCompactPage } from './overview.compact.page';
import { MenuModule } from '../../modules/menu/menu.module';
import { AppStatesViewModule } from '../../modules/states_view/app.states.view.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    AppStatesViewModule,
    RouterModule.forChild([{ path: '', component: OverviewCompactPage }]),
  ],
  declarations: [ 
    OverviewCompactPage,
  ],
  entryComponents: [
  ],
})
export class OverviewCompactModule {}