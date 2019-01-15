import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { VerifyModel } from '../../models/usermodel';
import { AuthProvider } from '../../providers/auth/auth';
import { ResponseModel } from '../../models/ResponseModel';
import { LoginPage } from '../login/login';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { ErrorModel } from '../../models/errorModel';

/**
 * Generated class for the VerfiypassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verfiypass',
  templateUrl: 'verfiypass.html',
})
export class VerfiypassPage {
  verifyModel: VerifyModel;
  errorModel: ErrorModel;

  constructor(public navCtrl: NavController, private _auth: AuthProvider, private menu: MenuController, public _alerts: AlertsProvider, public navParams: NavParams) {
    this.verifyModel = new VerifyModel();
    this.verifyModel.mobileNumber = navParams.get('mobileNumber');
    this.verifyModel.messageStr = navParams.get('messageStr');
  }

  ionViewDidLoad() {

  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }
  signIn() {
    this.navCtrl.setRoot('LoginPage');
  }
  
  VerifyPass() {
    console.log(JSON.stringify(this.verifyModel))
    this._auth.verifyPassCode(this.verifyModel).subscribe(data => {
      let registerResult = <ResponseModel>data;
      if (registerResult.IsDone) {
        this.navCtrl.push(LoginPage, {
          messageStr: registerResult.MessegesStr
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
}
