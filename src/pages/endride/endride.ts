import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { Events } from 'ionic-angular';

/**
 * Generated class for the EndridePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-endride',
  templateUrl: 'endride.html',
})
export class EndridePage {
  rideDateTime: any;
  rideDuration: any;
  rideDistance: any;
  rideCost: any;
  rating: number = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,public events: Events) {
    events.subscribe('star-rating:changed', (starRating) => {
      console.log(starRating);
      this.rating = starRating;
    });
  }

  ionViewDidLoad() {
    this.storage.get("RideStatus").then(d => {

      if (d != null) {
        let reservationModel = <vehicaleReservationModel>d;
        
        this.rideDateTime = reservationModel.returnObj.StartTime;
        this.rideDuration = reservationModel.returnObj.Duration;
        this.rideCost = reservationModel.returnObj.Amount;

      }
    });
    console.log('ionViewDidLoad EndridePage');
  }

}
