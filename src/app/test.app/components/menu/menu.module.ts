import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MenuModalComponent } from './modal/menu.modal.component';
import { MenuComponent } from './menu.component';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
    ],
    declarations: [
      MenuModalComponent,
      MenuComponent,
    ],
    entryComponents: [
      MenuModalComponent,
    ],
    exports: [MenuComponent],
  })
  export class MenuModule {}