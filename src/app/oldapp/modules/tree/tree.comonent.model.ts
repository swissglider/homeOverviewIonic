import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeComponent } from './tree.component';
import { TreeElementComponent } from './tree.element.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  declarations: [TreeComponent, TreeElementComponent],
  exports: [TreeComponent, TreeElementComponent]
})
export class TreeModule {}