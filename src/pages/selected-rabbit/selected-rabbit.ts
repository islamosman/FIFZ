import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform } from 'ionic-angular';
import { LocationsProvider } from '../../providers/Map/locations';
import { GeoModel } from '../../models/MapModel';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
// import { ResponseModel } from '../../models/ResponseModel';
import { Observable } from 'rxjs/Observable';

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
  constructor(public v: ViewController, private platform: Platform, public modalController: ModalController,
    public navCtrl: NavController, public navParams: NavParams, private _location: LocationsProvider,
    public _VehiclsProvider: VehiclsProvider) {
    this.scoterId = this.navParams.data.vId;
  }
  geoModelVar: GeoModel = new GeoModel();
  geoModelScotterVar: GeoModel = new GeoModel();
  ionViewDidLoad() {

    this._location.GetCurrent().then(((resp) => {
      this.geoModelVar.lat = resp.coords.latitude;
      this.geoModelVar.lng = resp.coords.longitude;
      console.log("longLat : > " + resp.coords);
      this.getVehiclsData();
    })).catch(err => {
      console.log(err);
      this.geoModelVar.lat = "30.783314141910544";
      this.geoModelVar.lng = "34.94217772246134";
      this.getVehiclsData();
    }
    );


  }

  getVehiclsData() {
    this._VehiclsProvider.byId(this.scoterId).subscribe(returnData => {

      if (returnData != null && returnData != undefined) {
        this.geoModelScotterVar.lat = Number.parseFloat(returnData.Messages.lat);
        this.geoModelScotterVar.lng = Number.parseFloat(returnData.Messages.long);
        //this.calcDistance();
        this.getDistanceMatrix().subscribe(response => {
          console.log(response);
          this.distanceSpace = response.rows[0].elements[0].distance.text;
          this.distanceDuration = response.rows[0].elements[0].duration.text;
         // this.changeValues();
        });

      }
    });
  }

  getDistanceMatrix(): Observable<any> {
    var service = new google.maps.DistanceMatrixService;
    var myLatLng1 = { lat: this.geoModelVar.lat, lng: this.geoModelVar.lng };
    var myLatLng2 = { lat: this.geoModelScotterVar.lat, lng: this.geoModelScotterVar.lng };

    return Observable.create((observer) => {

      service.getDistanceMatrix({
        origins: [myLatLng1],
        destinations: [myLatLng2],
        travelMode: 'WALKING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (rsp, status) => {
        // status checking goes here
        observer.next(rsp);
        observer.complete();
      });
    });
  }

  // calcDistance() {
  //   var myLatLng1 = { lat: this.geoModelVar.lat, lng: this.geoModelVar.lng };
  //   var myLatLng2 = { lat: this.geoModelScotterVar.lat, lng: this.geoModelScotterVar.lng };
  //   console.table(this.geoModelVar)
  //   console.table(this.geoModelScotterVar)
  //   var service = new google.maps.DistanceMatrixService;
  //   service.getDistanceMatrix({
  //     origins: [myLatLng1],
  //     destinations: [myLatLng2],
  //     travelMode: 'WALKING',
  //     unitSystem: google.maps.UnitSystem.METRIC,
  //     avoidHighways: false,
  //     avoidTolls: false
  //   }, function (response, status) {
  //     if (status !== 'OK') {
  //       //alert('Error was: ' + status);
  //     } else {

  //       this.distanceSpace = response.rows[0].elements[0].distance.text;
  //       this.distanceDuration = response.rows[0].elements[0].duration.text;
  //       this.changeValues();

  //       console.log(response.rows[0].elements[0].distance.text)
  //       console.log("dd " + this.distanceSpace)
  //     }
  //   }

  //   );
  // }

  // changeValues() {
  //   this.zone.run(() => {
  //     this.distanceSpace = this.distanceSpace;
  //     this.distanceDuration = this.distanceDuration
  //   });
  // }

  closeModal() {
    this.v.dismiss();
  }

  scan() {
    this.v.dismiss();
    this.navCtrl.push("ScanCodePage", { vId: this.scoterId });
  }

  direction() {
    let direction = "30.783314141910544,34.94217772246134";
    if (this.platform.is('ios')) {
      window.open('maps://?q=' + direction, '_system');
    } else {
      let label = encodeURI('Rabbit');
      window.open('geo:0,0?q=' + direction + '(' + label + ')', '_system');
    }
  }
}
