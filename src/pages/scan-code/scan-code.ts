import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { reservationEnum } from '../../providers/Enums/reservationEnum';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { UserStateProvider } from '../../providers/userstate/user-state';
/**
 * Generated class for the ScanCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-code',
  templateUrl: 'scan-code.html',
})
export class ScanCodePage implements OnInit {
  reservationModel: vehicaleReservationModel;
  constructor(public v: ViewController, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private platform: Platform,
    private diagnostic: Diagnostic, private qrScanner: QRScanner, private menu: MenuController,
    private _alertsService: AlertsProvider, public _VehiclsProvider: VehiclsProvider, private _userState: UserStateProvider) {

    this.reservationModel = new vehicaleReservationModel();
    this.reservationModel.vehicleId = navParams.get('vId');

    this.reservationModel.riderId = 1;
    this.reservationModel.reservationEnum = reservationEnum.Start;
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.qrScanner.hide();
    this.qrScanner.destroy();
    this.menu.swipeEnable(false);
  }

  ngOnInit(): void {
    // this.reservationModel.qrStr = "ccc";
    // this.reservVechil();
    // return;
    this.platform.ready().then(() => {

      this.diagnostic.requestCameraAuthorization()
        .then((state) => {
          console.log(JSON.stringify(state));

          this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
              if (status.authorized) {
                // camera permission was granted

                this.qrScanner.show();
                // start scanning
                let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                  this.reservationModel.qrStr = text;

                  this._VehiclsProvider.reserve(this.reservationModel).subscribe(returnData => {
                    console.log(returnData);

                    if (returnData.IsDone) {
                      this.qrScanner.hide(); // hide camera preview
                      scanSub.unsubscribe(); // stop scanning

                       this.reservVechil();
                    }

                  });
                });

              } else if (status.denied) {
                // camera permission was permanently denied
                // you must use QRScanner.openSettings() method to guide the user to the settings page
                // then they can grant the permission from there
              } else {
                // permission was denied, but not permanently. You can ask for permission again at a later time.
              }
            })
            .catch((e: any) => console.log('Error is', e));

        }).catch(e => console.error(e));


    });
  }


  ionViewDidLoad() {

  }


  reservVechil() {//id: number
    //this._alertsService.showConfirmationDialog(id.toString(), "");

    // this.reservationModel = new vehicaleReservationModel();
    // this.reservationModel.vehicleId = "3";

    // this.reservationModel.riderId = 1;
    // this.reservationModel.reservationEnum = reservationEnum.Start;
    this._alertsService.showLoader();
    this._VehiclsProvider.reserve(this.reservationModel).subscribe(returnData => {
      console.log(returnData);

      this._alertsService.hideLoader();
      if (returnData.IsDone) {
        this.reservationModel.tripId = returnData.ResponseIdStr;
        this._userState.setRideStatus(this.reservationModel);
        this.navCtrl.setRoot("MapsPage");
      } else {
        this._alertsService.showWarningToaster(returnData.ErrorMessegesStr);
      }
    });
  }

  enterCode() {
    let alert = this.alertCtrl.create({
      title: 'Rabbit',
      cssClass: 'alert-class',
      inputs: [
        {
          type: "text",
          name: "vQrInput",
          placeholder: "Scooter Code"
          // value?: string;
          // label?: string;
          // checked?: boolean;
          // disabled?: boolean;
          // id?: string;
          // handler?: Function;
          // min?: string | number;
          // max?: string | number;
        }
      ],
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            if (data.vQrInput != "") {
              this.reservationModel.qrStr = data.vQrInput;
              this.reservVechil();
            }
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


  cancelScan(){
    this.v.dismiss();
    this.navCtrl.setRoot("MapsPage");
  }
}
