import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndridePage } from './endride';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    EndridePage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(EndridePage),
  ],
})
export class EndridePageModule {}
