import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, MenuController, NavController, ToastController, ToastOptions, NavParams } from 'ionic-angular';
//import { MapsPage } from '../maps/maps';
import { NgForm } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth/auth";
import { UserStateProvider } from "../../providers/userstate/user-state";
import { MyApp } from '../../app/app.component';
import { LoginModel } from '../../models/usermodel';
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
  messageStr:string;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private menu: MenuController,
    private storage: Storage, private _app: MyApp,public navParams: NavParams,
    public _auth: AuthProvider, private userState: UserStateProvider,public _alerts: AlertsProvider
  ) {
    this.messageStr = navParams.get('messageStr');
    this.loginModel = new LoginModel();
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }
  public login() {
    // this._auth.loginUser(this.loginModel).subscribe(data => {
    //   let registerResult = data;
    
    //   if (registerResult.access_token != "" && registerResult.access_token != null) {
    //     this.navCtrl.setRoot('MapsPage');
    //     console.log(data)
    //     // this.navCtrl.push(VerfiypassPage, {
    //     //   messageStr: registerResult.MessegesStr,
    //     //   mobileNumber: this.registerModel.phone_number
    //     // });
    //   } else {
    //     this._alerts.showWarningToaster("Invalid User or password");
    //   }
    // }
    // );
    
    // //this._auth.loginUser(this.loginModel).then(data => {
       this.navCtrl.setRoot('MapsPage');
    // //});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createAccount() {
    this.navCtrl.push('RegisterPage');
  }

  verifyPassCode(){
    this.navCtrl.push('VerfiypassPage');
  }
}
