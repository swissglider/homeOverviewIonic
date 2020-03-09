import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { folder_testPage } from './folder_test.page';
import { ModalComponent } from './modal/modal.component';
import { MenuModule } from '../../modules/menu/menu.module';
import { TreeModule } from '../../modules/tree/tree.comonent.model';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    TreeModule,
    RouterModule.forChild([{ path: '', component: folder_testPage }])
  ],
  declarations: [
    folder_testPage,
    ModalComponent
  ],
  entryComponents: [
    ModalComponent,
  ],
})
export class Folder_TestPageModule {}
