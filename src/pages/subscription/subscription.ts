import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, DateTime } from 'ionic-angular';
import { SubscriptionModel, UserStateModel } from '../../models/usermodel';
import { ErrorModel } from '../../models/errorModel';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
import { AuthProvider } from '../../providers/auth/auth';
import { ResponseModel } from '../../models/ResponseModel';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { LocationsProvider } from '../../providers/Map/locations';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  subscriptionModel: SubscriptionModel;
  errorModel: ErrorModel;
  dateNow: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private _location: LocationsProvider,
    public _VehiclsProvider: VehiclsProvider, public _alerts: AlertsProvider, public _authProvider: AuthProvider
    , private storage: Storage, public events: Events) {
    this.subscriptionModel = new SubscriptionModel();
    this.dateNow = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
  }

  ionViewDidLoad() {
    // this.storage.get('UserState').then(user => {

    //   if (user != undefined && user != "") {
    //     this.events.publish('user:created', user);
    //   } else {
    //     this.events.publish("unauthorized:requestError");
    //   }
    // });
  }


  subscription() {

    this._alerts.showLoader();
    
    if (this.subscriptionModel.PromoCodeName != "") {
      this.checkPromoCode();
    } else {
      this._location.GetCurrent().then(((resp) => {
        this.subscriptionModel.Lat = resp.coords.latitude;
        this.subscriptionModel.Lng = resp.coords.longitude;

        this.payFirst();
      })).catch(err => {
        this.payFirst();
      });
    }

    // this.storage.get('UserState').then(user => {
    //   console.clear();
    //   console.table(user);
    //   //if (user != undefined && user != "") {
    //   this.events.publish('user:created', user);
    //   //}

    //   this.subscriptionModel.tocken = user.tocken;

    //   this._location.GetCurrent().then(((resp) => {
    //     this.subscriptionModel.Lat = resp.coords.latitude;
    //     this.subscriptionModel.Lng = resp.coords.longitude;

    //     this.payFirst();
    //   })).catch(err => {

    //     this.payFirst();
    //   });

    // });
  }

  discountPer: number = 0;

  checkPromoCode() {
    this._VehiclsProvider.checkPromo(this.subscriptionModel.PromoCodeName).subscribe(returnData => {
      if (returnData.IsDone) {
        this.discountPer = returnData.ReturnedObject;
      }
      this.payFirst();
    });
  }

  payFirst() {
    let amountTpPay = 5;
    if (this.subscriptionModel.DaysCount == 1) {
      amountTpPay = 80;
    } else if (this.subscriptionModel.DaysCount == 3) {
      amountTpPay = 220;
    } else if (this.subscriptionModel.DaysCount == 7) {
      amountTpPay = 470;
    } else if (this.subscriptionModel.DaysCount == 30) {
      amountTpPay = 1350;
    }

    if (this.subscriptionModel.DaysCount != 30) {
      if (this.discountPer != 0) {
        amountTpPay = (amountTpPay * this.discountPer) / 100;
      }
    }

    this.storage.get('UserIDVisaState').then(user => {
      let result = <UserStateModel>user;
      console.clear();
      console.table(result)
      if (result != null) {

        this._VehiclsProvider.payment1().subscribe(returnData1 => {
          if (returnData1) {
            this._VehiclsProvider.payment2(returnData1.token, amountTpPay, "S" + this.subscriptionModel.DaysCount.toString() + new Date().getMinutes().toString() + result.UserId).subscribe(returnData2 => {
              this._VehiclsProvider.payment3(returnData1.token, amountTpPay, returnData2.id,5046).subscribe(returnData3 => {
                console.log(returnData1.token)
                this._VehiclsProvider.paymentBackToBack(returnData3.token, result.Tocken).subscribe(returnData3 => {

                  this.saveData();

                });

              });
            });
          }
        });
      } else {
        this.getUserStatus();
        // this._alerts.hideLoader();
      }
    });
  }

  getUserStatus() {
    this._authProvider.userStates().subscribe(result => {
      this.storage.set('UserIDVisaState', result.ReturnedObject);
      this.payFirst();
    });
  }

  saveData() {
    this.subscriptionModel.DateTimeStr= this.subscriptionModel.DateStr + " "  + this.subscriptionModel.TimeStr;
    this._VehiclsProvider.subscription(this.subscriptionModel).subscribe(data => {
      this._alerts.hideLoader();
      let registerResult = <ResponseModel>data;
      if (registerResult.IsDone) {
        this._alerts.showWarningToaster(registerResult.MessegesStr);
      } else {
        this._alerts.showWarningToaster(registerResult.ErrorMessegesStr);
      }
    },
      err => {
        this._alerts.hideLoader();
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
