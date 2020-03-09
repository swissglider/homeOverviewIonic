import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLevelStructGenerator } from './admin.level-struct.generator';
import { MenuModule } from '../../modules/menu/menu.module';
import { AppStatesViewModule } from '../../modules/states_view/app.states.view.module';
import { TreeModule } from '../../modules/tree/tree.comonent.model';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    AppStatesViewModule,
    TreeModule,
    RouterModule.forChild([{ path: '', component: AdminLevelStructGenerator }])
  ],
  declarations: [
    AdminLevelStructGenerator,
  ],
  entryComponents: [],
})
export class AdminLevelStructGeneratorModule {}
