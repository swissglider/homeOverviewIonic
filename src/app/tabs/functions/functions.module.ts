import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FunctionsPage } from './functions.page';
import { MenuModule } from '../../modules/menu/menu.module';
import { ModalComponent } from './modal/modal.component';
import { ModalDynamicComponent } from './modal/modal.dynamic.component';
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
    RouterModule.forChild([{ path: '', component: FunctionsPage }])
  ],
  declarations: [
    FunctionsPage,
    ModalComponent,
    ModalDynamicComponent,
  ],
  entryComponents: [
    ModalComponent,
    ModalDynamicComponent,
  ],
})
export class FunctionsModule {}
