import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusDotComponent } from './status.dot.component'
import { StatusDotPopoverComponent } from './popover/status.dot.popover.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [StatusDotComponent, StatusDotPopoverComponent],
  exports: [StatusDotComponent, StatusDotPopoverComponent]
})
export class StatusDotModule { }