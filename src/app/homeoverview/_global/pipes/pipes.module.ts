import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GetNamePipe } from './get-name.pipe';
import { MS2Time } from './ms2time.pipe';
import { Color2VarColor } from './color2varcolor.pipe';
import { MS2LocalString } from './ms2localstring.pipe';
import { RoundTo2DecString } from './round.to.2.dec.string.pipe';
import { RoundTo1DecString } from './round.to.1.dec.string.pipe';
import { Date2LocalString } from './date2localstring.pipe';

@NgModule({
    imports: [
      IonicModule,
      CommonModule,
    ],
    declarations: [GetNamePipe, MS2Time, Color2VarColor, MS2LocalString, RoundTo2DecString, RoundTo1DecString, Date2LocalString ],
    exports: [ GetNamePipe, MS2Time, Color2VarColor, MS2LocalString, RoundTo2DecString, RoundTo1DecString, Date2LocalString ]
  })
  export class PipeModule {}