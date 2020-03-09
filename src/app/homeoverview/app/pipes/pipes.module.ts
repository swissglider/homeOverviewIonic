import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GetNamePipe } from './get-name.pipe';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
    ],
    declarations: [GetNamePipe],
    exports: [ GetNamePipe ]
  })
  export class PipeModule {}