import { Component, OnInit } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Platform, Form } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { RegisterModel } from '../../models/usermodel';
import { AuthProvider } from "../../providers/auth/auth";
import { ResponseModel } from '../../models/ResponseModel';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { apiConfig } from "../../globalconfig";
import { Observable } from 'rxjs/Observable';
import { ErrorModel } from '../../models/errorModel';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { VerfiypassPage } from '../verfiypass/verfiypass';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  registerModel: RegisterModel;
  errorModel: ErrorModel;

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, private uniqueDeviceID: UniqueDeviceID
    , private menu: MenuController, private platform: Platform, public _auth: AuthProvider, public _alerts: AlertsProvider) {
    this.registerModel = new RegisterModel();
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {

      this.uniqueDeviceID.get()
        .then((uuid: any) => {
          this.registerModel.device_unique_id = uuid;
        })
        .catch((error: any) => console.log(error));

    });
  }

  ionViewDidLoad() {
    
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  register() {
    this._auth.registerUser(this.registerModel).subscribe(data => {
      let registerResult = <ResponseModel>data;
      if (registerResult.IsDone) {
        this.navCtrl.push(VerfiypassPage, {
          messageStr: registerResult.MessegesStr,
          mobileNumber: this.registerModel.phone_number
        });
      } else {
        this._alerts.showWarningToaster(registerResult.ErrorMessegesStr);
      }
    },
      err => {
        this.errorModel = <ErrorModel>err;
        if (this.errorModel.status == 0) {
          this._alerts.showServiceError();
        } else {
          this._alerts.showErrorToaster(this.errorModel.message);
        }
      }
    );
  }

  signIn() {
    this.navCtrl.setRoot('LoginPage');
  }
}
