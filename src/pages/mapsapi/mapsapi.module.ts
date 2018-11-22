import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapsapiPage } from './mapsapi';

@NgModule({
  declarations: [
    MapsapiPage,
  ],
  imports: [
    IonicPageModule.forChild(MapsapiPage),
  ],
})
export class MapsapiPageModule {}
