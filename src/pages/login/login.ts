import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController, MenuController, NavController, ToastController, ToastOptions, NavParams } from 'ionic-angular';
//import { MapsPage } from '../maps/maps';
import { NgForm } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth/auth";
import { UserStateProvider } from "../../providers/userstate/user-state";
import { MyApp } from '../../app/app.component';
import { LoginModel } from '../../models/usermodel';

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
    public _auth: AuthProvider, private userState: UserStateProvider
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
    this._auth.scoterList().then(data => {
      console.log(data);
    });
    
    // //this._auth.loginUser(this.loginModel).then(data => {
    //   this.navCtrl.setRoot('MapsPage');
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
