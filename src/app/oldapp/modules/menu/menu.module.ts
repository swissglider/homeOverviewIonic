import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './menu-bar.component';
import { ModalComponent } from './modal/modal.component';
import { MenuTreeComponent } from './menu-tree/menu.tree.component'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    ModalComponent,
    MenuBarComponent,
    MenuTreeComponent,
  ],
  entryComponents: [
    ModalComponent,
  ],
  exports: [MenuBarComponent],
})
export class MenuModule {}