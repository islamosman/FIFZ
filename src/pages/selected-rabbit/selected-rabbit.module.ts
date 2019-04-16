import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectedRabbitPage } from './selected-rabbit';

@NgModule({
  declarations: [
    SelectedRabbitPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectedRabbitPage),
  ],
})
export class SelectedRabbitPageModule {}
