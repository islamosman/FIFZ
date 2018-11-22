import { Component, OnInit } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
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

  RegisterModel = {
    mobileNumber: "",
    username: "",
    password: "",
    email: ""
  }
  constructor(public navCtrl: NavController, public navParams: NavParams
    , private menu: MenuController, private platform: Platform, private sim: Sim) {
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      this.sim.getSimInfo().then(
        (info) => console.log('Sim info: ', JSON.stringify(info)),
        (err) => console.log('Unable to get sim info: ', err)
      );

      this.sim.hasReadPermission().then(
        (info) => console.log('Has permission: ', JSON.stringify(info))
      );

      this.sim.requestReadPermission().then(
        () => console.log('Permission granted'),
        () => console.log('Permission denied')
      );
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  signIn() {
    this.navCtrl.setRoot('LoginPage');
  }

  public register() {


  }
}
