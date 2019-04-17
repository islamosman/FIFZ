import { Component, OnInit } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Platform, Form } from 'ionic-angular';
// import { Sim } from '@ionic-native/sim';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { RegisterModel } from '../../models/usermodel';
import { AuthProvider } from "../../providers/auth/auth";
import { ResponseModel } from '../../models/ResponseModel';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
// import { apiConfig } from "../../globalconfig";
// import { Observable } from 'rxjs/Observable';
import { ErrorModel } from '../../models/errorModel';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { VerfiypassPage } from '../verfiypass/verfiypass';
//import {  FacebookLoginResponse, FacebookOriginal } from '@ionic-native/facebook';

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

  constructor(public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, 
    private uniqueDeviceID: UniqueDeviceID, private menu: MenuController, 
    //private facebook: FacebookOriginal,
    private platform: Platform, public _auth: AuthProvider, public _alerts: AlertsProvider) {
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

  loginWithFB() {
    
    // this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
    //   this.facebook.api('me?fields=id,name,email,first_name,last_name,birthday,gender', []).then(profile => {
    //     this.userFBData = {
    //       email: profile['email'],
    //       first_name: profile['first_name'],
    //       last_name : profile['last_name'],
    //       username: profile['name'],
    //       dob : profile['birthday'],
    //       gender: profile['gender']

    //       }

    //       this.isFBaccount = true;
    //       this.storage.set('isfb',this.isFBaccount);
    //       var data = {
    //         email : this.userFBData.email,
    //         first_name: this.userFBData.first_name,
    //         last_name: this.userFBData.last_name,
    //         gender: this.userFBData.gender,
    //         dob: this.userFBData.dob
          
    //       };
      
    //       this.changepassword(data);
          
    //   });
    // });
  }

  changepassword(user)
  {
    // const prompt = this.alertCtrl.create({
    //   title: 'Enter Password',
    //   message: "Choose your new password",
    //   inputs: [
    //     {
    //       name: 'new',
    //       placeholder: 'New Password',
    //       type: 'password'
    //     },
    //     {
    //       name: 'confirm',
    //       placeholder: 'Confirm Password',
    //       type: 'password'
    //     },
        
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: data => {
    //         let loading = this.loadingCtrl.create({
    //           showBackdrop: true
    //         });
    //         loading.present();

    //             if(data.new != data.confirm)
    //             {
    //               let alert = this.alertCtrl.create({
    //                 title: 'Password mismatch',
    //                 message: 'Both passwords do not match'
    //               })
    //               alert.present();
  
    //             }
  
    //             else
    //             {
    //               user.password = data.new;
    //               user.active = true;

    //               this.http.post('https://zappbackendservice.herokuapp.com/users/register', user)
    //               // .map(res => res.json())
    //                .subscribe(res => {

    //                  this.fbSignIn(user.email, user.password);

                     

                     
    //             }, err=> {
    //               console.log(err);
    //             })          
    //           }
    //           loading.dismiss()

    //       }
    //     }
    //   ]
    // });
    // prompt.present();
  }

  signIn() {
    this.navCtrl.setRoot('LoginPage');
  }
}
