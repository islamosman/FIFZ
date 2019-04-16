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
export class InridestatusPage implements OnInit  {
  rideDateTime: any;
  vId: any;
  distanceKM: any;
  feesValue: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit() {
  }
  ionViewDidLoad() {
    this.vId ="123";
  }

}
