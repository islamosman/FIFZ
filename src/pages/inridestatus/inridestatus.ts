import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InridestatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inridestatus',
  templateUrl: 'inridestatus.html',
})
export class InridestatusPage implements OnInit {
  rideDateTime: any;
  vId: any;
  distanceKM: any;
  feesValue: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit() {
  }
  totalSeconds = 0;
  Minutes: any;
  Seconds: any;

  setTime() {
    ++this.totalSeconds;
    this.Minutes = this.pad(this.totalSeconds % 60);
    this.Seconds = this.pad(Number(this.totalSeconds / 60));
  }

  pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
  ionViewDidLoad() {
    this.vId = "123";
    setInterval(this.setTime, 1000);

  }

}
