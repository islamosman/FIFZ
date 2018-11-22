import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanCodePage } from './scan-code';

@NgModule({
  declarations: [
    ScanCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ScanCodePage),
  ],
})
export class ScanCodePageModule {}
