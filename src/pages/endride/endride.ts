import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { Events } from 'ionic-angular';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { reservationEnum } from '../../providers/Enums/reservationEnum';
import { ResponseModel } from '../../models/ResponseModel';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';

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
  vId: any;
  tripId: any;
  rating: number = 0;
  constructor(public v: ViewController, public navCtrl: NavController, public navParams: NavParams, public _VehiclsProvider: VehiclsProvider,
    private storage: Storage, public events: Events, private _alertsService: AlertsProvider) {
    events.subscribe('star-rating:changed', (starRating) => {
      console.log(starRating);
      this.rating = starRating;
    });
  }

  ionViewDidLoad() {
    this.storage.get("RideStatus").then(d => {
      if (d != null) {
        let reservModel = <vehicaleReservationModel>d;
        console.table(reservModel)
        if (reservModel.reservationEnum == reservationEnum.End) {

          this._VehiclsProvider.byTripId(reservModel.tripId).subscribe(returnData => {
            let ResultData = <ResponseModel>returnData;
            console.log(ResultData)
            this.rideDateTime = ResultData.ReturnedObject.StartDate;

            this.rideDateTime = ResultData.ReturnedObject.StartDate;
            this.rideDuration = ResultData.ReturnedObject.Duration;
            this.rideCost = ResultData.ReturnedObject.Amount;
          });

          this.vId = reservModel.vehicleId;
          this.tripId = reservModel.tripId;
        }
      }

    });

  }

  doneFunc() {
    if (this.rating > 0) {
      this.statusDoneApi(false);
    } else {
      this.v.dismiss();
      this.navCtrl.setRoot("MapsPage");
    }
  }
  repaireFunc() {
    this.statusDoneApi(true);
  }

  statusDoneApi(inService: boolean) {
    if (this.tripId != "" && this.tripId != undefined) {
      this._alertsService.showLoader();
      this._VehiclsProvider.doneByTripId(this.tripId, this.rating, inService).subscribe(returnData => {
        this._alertsService.hideLoader();
        this.v.dismiss();
        this.navCtrl.setRoot("MapsPage");
      });
    }
  }
}
