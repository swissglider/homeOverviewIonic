import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStatesComponent } from './app.states/app.states.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  declarations: [AppStatesComponent],
  exports: [AppStatesComponent]
})
export class AppStatesViewModule {}