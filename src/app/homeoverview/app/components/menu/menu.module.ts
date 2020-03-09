import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MenuModalComponent } from './modal/menu.modal.component';
import { MenuComponent } from './menu.component';
import { PipeModule } from '../../pipes/pipes.module';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
      PipeModule,
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