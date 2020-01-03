import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LongNotUpdated } from './long-not-updated';
import { MenuModule } from '../../modules/menu/menu.module';
import { TreeComponent } from './tree/tree.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    RouterModule.forChild([{ path: '', component: LongNotUpdated }])
  ],
  declarations: [
    LongNotUpdated,
    TreeComponent,
    ModalComponent,
  ],
  entryComponents: [
    ModalComponent
  ]
})
export class LongNotUpdatedModule {}
