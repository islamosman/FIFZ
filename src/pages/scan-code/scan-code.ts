import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { reservationEnum } from '../../providers/Enums/reservationEnum';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform,
    private diagnostic: Diagnostic, private qrScanner: QRScanner, private menu: MenuController, public _VehiclsProvider: VehiclsProvider) {

    this.reservationModel = new vehicaleReservationModel();
    this.reservationModel.vehicleId = navParams.get('vId');

    this.reservationModel.riderId = 1;
    this.reservationModel.reservationEnum = reservationEnum.Start;
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(false);
  }

  ngOnInit(): void {

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
                    }

                  });

                  alert(text);


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

}
