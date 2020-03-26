import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ChartingComponent } from './charting.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ChartsModule,
    ],
    declarations: [
        ChartingComponent,
    ],
    entryComponents: [],
    exports: [ChartingComponent],
})
export class ChartingModule { }