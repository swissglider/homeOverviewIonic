import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartingComponent } from './charting.component';
import { ChartsModule } from 'ng2-charts';
import { PipeModule } from 'src/app/homeoverview/_global/pipes/pipes.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ChartsModule,
        PipeModule,
    ],
    declarations: [
        ChartingComponent,
    ],
    entryComponents: [],
    exports: [ChartingComponent],
})
export class ChartingModule { }