import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, MenuController, NavController, ToastController, ToastOptions, NavParams, Events } from 'ionic-angular';
//import { MapsPage } from '../maps/maps';
import { NgForm } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth/auth";
import { UserStateProvider } from "../../providers/userstate/user-state";
import { MyApp } from '../../app/app.component';
import { LoginModel, UserModel } from '../../models/usermodel';
import { ResponseModel } from '../../models/ResponseModel';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  loginModel: LoginModel;
  tosterOption: ToastOptions;
  messageStr: string;


  constructor(public events: Events, public navCtrl: NavController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private menu: MenuController,
    private storage: Storage, private _app: MyApp, public navParams: NavParams,
    public _auth: AuthProvider, private userState: UserStateProvider, public _alerts: AlertsProvider
  ) {
    this.messageStr = navParams.get('messageStr');
    this.loginModel = new LoginModel();
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  userModel: UserModel;
  login() {
    this.userState.clearRideState();
    this._alerts.showLoader();
    this._auth.loginUser(this.loginModel).subscribe(data => {
      let registerResult = data;
      this._alerts.hideLoader();
      if (registerResult.access_token != "" && registerResult.access_token != null) {
        this.userModel = new UserModel();
        this.userModel.name = this.loginModel.username;
        this.userModel.tocken = registerResult.access_token;
        this.userState.setUserStatus(this.userModel);

        this.events.publish('user:created', this.userModel);

        this.navCtrl.setRoot('MapsPage');

      } else {
        this._alerts.showWarningToaster("Invalid User or password");
      }


    }
    );

    //this._auth.loginUser(this.loginModel).then(data => {
    // this.navCtrl.setRoot('MapsPage');
    // //});
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  createAccount() {
    this.navCtrl.push('RegisterPage');
  }

  verifyPassCode() {
    this.navCtrl.push('VerfiypassPage');
  }
}
