import { Component, OnInit } from '@angular/core';
import { IonicPage, LoadingController,MenuController,  NavController, ToastController} from 'ionic-angular';
//import { MapsPage } from '../maps/maps';
import {NgForm} from "@angular/forms";
import {Storage} from '@ionic/storage';
import {AuthProvider} from "../../providers/auth/auth";
import {UserStateProvider} from "../../providers/userstate/user-state";
import {GenericProvider} from "../../providers/generic/GenericProvider";
 import { MyApp } from '../../app/app.component';

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
export class LoginPage implements OnInit  {
  
  loginCredentials = {
    username: "",
    password: ""
  }
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
     private menu: MenuController,
    private storage: Storage,
    private _app: MyApp,
   public _auth: AuthProvider,
    private userState:UserStateProvider,
    private _genericService: GenericProvider
    ) {
  }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }
  public login() {

    this.navCtrl.setRoot('MapsPage');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createAccount(){
    this.navCtrl.push('RegisterPage');
  }
}
