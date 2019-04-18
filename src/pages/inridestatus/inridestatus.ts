import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { UserStateProvider } from '../../providers/userstate/user-state';
import { Storage } from '@ionic/storage';
import { reservationEnum } from '../../providers/Enums/reservationEnum';

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
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,
    private _userState: UserStateProvider, private storage: Storage, public modalController: ModalController,
    private _alertsService: AlertsProvider, public _VehiclsProvider: VehiclsProvider) {
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
    //setInterval(this.setTime, 1000);

  }

  endTrip() {
    let alert = this.alertCtrl.create({
      title: 'End Rabbit !!',
      cssClass :'alert-class',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.endReservVechil();
            alert.dismiss(true);
            return false;
          }
        }, {
          text: 'No',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });

    alert.present();
  }


  reservationModel: vehicaleReservationModel;
  endReservVechil() {

    this._alertsService.showConfirmationDialog
    this.storage.get("RideStatus").then(d => {

      if (d != null) {
        this.reservationModel = <vehicaleReservationModel>d;

        if (this.reservationModel.reservationEnum == reservationEnum.Start) {
          this.reservationModel.reservationEnum = reservationEnum.End;

          this._alertsService.showLoader();

          this._VehiclsProvider.reserve(this.reservationModel).subscribe(returnData => {
            console.log(returnData);

            this._alertsService.hideLoader();
            if (returnData.IsDone) {
              this.reservationModel.tripId = returnData.ResponseIdStr;
              this.reservationModel.returnObj = returnData.ReturnedObject;
              this._userState.setRideStatus(this.reservationModel);

              let modal = this.modalController.create(
                'EndridePage', null, { enableBackdropDismiss: false, cssClass: 'modal-bottom' }
              );
              modal.present();


              //              this.navCtrl.setRoot("MapsPage");
            } else {
              this._alertsService.showWarningToaster(returnData.ErrorMessegesStr);
            }
          });
        }
      }

    });
  }

}
