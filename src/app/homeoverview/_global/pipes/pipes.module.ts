import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GetNamePipe } from './get-name.pipe';
import { MS2Time } from './ms2time.pipe';
import { Color2VarColor } from './color2varcolor.pipe';
import { MS2LocalString } from './ms2localstring.pipe';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
    ],
    declarations: [GetNamePipe, MS2Time, Color2VarColor, MS2LocalString ],
    exports: [ GetNamePipe, MS2Time, Color2VarColor, MS2LocalString ]
  })
  export class PipeModule {}