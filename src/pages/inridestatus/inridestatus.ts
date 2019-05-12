import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { UserStateProvider } from '../../providers/userstate/user-state';
import { Storage } from '@ionic/storage';
import { reservationEnum } from '../../providers/Enums/reservationEnum';
import { ResponseModel } from '../../models/ResponseModel';
import { UserStateModel } from '../../models/usermodel';

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
  totalSeconds: number = 0;
  Minutes: any;
  hourss: any;
  Seconds: number = 0;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,
    private _userState: UserStateProvider, private storage: Storage, public modalController: ModalController,
    private _alertsService: AlertsProvider, public _VehiclsProvider: VehiclsProvider) {
  }
  ngOnInit() {

  }


  setTime() {
    ++this.totalSeconds;
    ++this.Seconds;
    this.hourss = Math.floor(this.totalSeconds / 60 / 60);
    this.Minutes = Math.floor(this.totalSeconds / 60); //this.pad(this.totalSeconds % 60);
    this.Seconds = Number(this.pad(Number(this.Seconds)));//this.pad(Number(this.totalSeconds / 60));
  }

  pad(val) {
    let valString = val + "";
    if (Number(valString) > 60) {
      this.Seconds = 1;
      valString = "01";
    }

    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;//.substr(0, 2);
    }
  }
  ionViewDidLoad() {
    this.initTripData();
  }

  endTrip() {
    let alert = this.alertCtrl.create({
      title: 'End Rabbit !!',
      cssClass: 'alert-class',
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


              // Payment

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

  payTrip(tripId: any, amount: any) {
    this.storage.get("RideStatus").then(d => {
      if (d != null) {
        let reservModel = <vehicaleReservationModel>d;
        console.table(reservModel)
        if (reservModel.reservationEnum == reservationEnum.End) {
          this._VehiclsProvider.byTripId(reservModel.tripId).subscribe(returnData => {
            let ResultData = <ResponseModel>returnData;

            this._VehiclsProvider.payment1().subscribe(returnData1 => {
              if (returnData1) {
                this._VehiclsProvider.payment2(returnData1.token, ResultData.ReturnedObject.Amount, reservModel.tripId).subscribe(returnData2 => {

                  this._VehiclsProvider.payment3(returnData1.token, ResultData.ReturnedObject.Amount, returnData2.id).subscribe(returnData3 => {

                    // Back to back
                    this.storage.get('UserIDVisaState').then(user => {
                      if (user) {
                        let result = <UserStateModel>user;
                        if (result.Tocken != "") {
                          this._VehiclsProvider.paymentBackToBack(returnData1.token, result.Tocken).subscribe(returnDataBack => {
                            if (returnDataBack.obj.success) {
                              // update our data
                              this._VehiclsProvider.paymentOrderSave(reservModel.tripId, returnData2.id).subscribe(returnDataIframe => {
                              });
                            }
                          });
                        }
                      }
                    });


                  });
                });

              }
            });
            // console.log(ResultData)
            // this.rideDateTime = ResultData.ReturnedObject.StartDate;

            // this.rideDateTime = ResultData.ReturnedObject.StartDate;
            // this.rideDuration = ResultData.ReturnedObject.Duration;
            // this.rideCost = ResultData.ReturnedObject.Amount;
          });
        }
      }
    });
  }

  initTripData() {
    console.log(this.totalSeconds);
    setInterval(() => {
      this.setTime();
    }, 1000);

    this.storage.get("RideStatus").then(d => {
      if (d != null) {
        let reservModel = <vehicaleReservationModel>d;
        console.table(reservModel)
        if (reservModel.reservationEnum == reservationEnum.Start) {

          this._VehiclsProvider.byTripId(reservModel.tripId).subscribe(returnData => {
            let ResultData = <ResponseModel>returnData;
            console.log(ResultData)
            this.rideDateTime = ResultData.ReturnedObject.StartDate;

            this.rideDateTime = ResultData.ReturnedObject.StartDate;
            this.feesValue = ResultData.ReturnedObject.Amount;
            if (this.feesValue.length > 5) {
              this.feesValue = this.feesValue.substr(0, 5);
            }
            this.totalSeconds = ResultData.ReturnedObject.totalSecounds;
          });

          this.vId = reservModel.vehicleId;
        }
      }

    });
  }
}
