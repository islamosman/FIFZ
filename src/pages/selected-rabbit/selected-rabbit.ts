import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform } from 'ionic-angular';

/**
 * Generated class for the SelectedRabbitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-selected-rabbit',
  templateUrl: 'selected-rabbit.html',
})
export class SelectedRabbitPage {
  scoterId: Number = 0;
  distanceSpace: string;
  distanceDuration: string;
  constructor(public v: ViewController,private platform: Platform,  public modalController: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    this.scoterId = this.navParams.data.vId;
  }

  ionViewDidLoad() {
    var myLatLng1 = { lat: 40.634315, lng: 14.602552 };
    var myLatLng2 = { lat: 40.04215, lng: 14.102552 };

    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [myLatLng1],
      destinations: [myLatLng2],
      travelMode: 'WALKING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response, status) {
      if (status !== 'OK') {
        //alert('Error was: ' + status);
      } else {
        this.distanceSpace = response.rows[0].elements[0].distance.text;
        this.distanceDuration = response.rows[0].elements[0].duration.text;
        console.log(response.rows[0].elements[0].distance.text)
      }
    }

    );
  }
  closeModal() {
    this.v.dismiss();
  }

  scan(){
    this.v.dismiss();
    this.navCtrl.push("ScanCodePage", { vId: this.scoterId });
  }

  direction(){
    let direction = "30.783314141910544,34.94217772246134";
    if(this.platform.is('ios')){
      window.open('maps://?q=' + direction, '_system');
    }else{
      let label = encodeURI('Rabbit');
	window.open('geo:0,0?q=' + direction + '(' + label + ')', '_system');
    }
  }
}
