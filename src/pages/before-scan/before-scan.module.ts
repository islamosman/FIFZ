import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeforeScanPage } from './before-scan';

@NgModule({
  declarations: [
    BeforeScanPage,
  ],
  imports: [
    IonicPageModule.forChild(BeforeScanPage),
  ],
})
export class BeforeScanPageModule {}
