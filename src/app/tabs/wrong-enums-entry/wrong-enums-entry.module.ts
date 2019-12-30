import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WrongEnumEntry } from './wrong-enums-entry';
import { MenuModule } from '../menu/menu.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MenuModule,
    RouterModule.forChild([{ path: '', component: WrongEnumEntry }])
  ],
  declarations: [WrongEnumEntry]
})
export class WrongEnumEntryModule {}
