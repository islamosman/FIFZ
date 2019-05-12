import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { UserStateProvider } from "../userstate/user-state";
import { apiConfig } from "../../globalconfig";
import { Storage } from '@ionic/storage';
import { LoadingController, NavController } from "ionic-angular";
import { RegisterModel, LoginModel, VerifyModel, UserStateModel } from '../../models/usermodel';
import { AlertsProvider } from "../../providers/generic/AlertsProvider";
import { Observable } from 'rxjs/Observable';
// import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { ResponseModel, LoginResponseModel } from '../../models/ResponseModel';
@Injectable()
export class AuthProvider {

  loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Logging out and clearing data Please Wait...',
  });

  constructor(public http: HttpClient, private _alertsService: AlertsProvider,
    public userState: UserStateProvider,
    private httpClient: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
  ) {
    console.log('Hello AuthProvider Provider');
  }

  logOut(navCtrl: NavController) {
    this.userState.clearState();
    //this.loading.present();
    this.storage.clear().then(data => {
      // debugger;
      console.log('AuthProvider Logout Success', data);
      //this.loading.dismiss().then(()=>{
      navCtrl.setRoot('LoginPage');
      //});
    }).catch(err => {
      console.log('AuthProvider Logout Error', err);
      this.loading.dismiss();
      // navCtrl.setRoot('LoginPage');
    })

  }
  registerUser(user: RegisterModel): Observable<ResponseModel> {
    let URI = `${apiConfig.apiUrl}/FlyAuth/Register`;
    return this.http.post<ResponseModel>(URI, user);
  }

  verifyPassCode(passCodeModel: VerifyModel): Observable<ResponseModel> {
    let URI = `${apiConfig.apiUrl}/FlyAuth/VerfiyPass`;
    return this.http.post<ResponseModel>(URI, passCodeModel);
  }

  loginUser(data: LoginModel): Observable<LoginResponseModel> {
    let URI = `${apiConfig.apiUrl}/FlyAuth/login`;
    return this.http.post<LoginResponseModel>(URI, data);
  }

  userStates(): Observable<ResponseModel> {
    let URI = `${apiConfig.apiUrl}/Vehicles/UserStatusPost`;
    return this.http.post<ResponseModel>(URI,"");
  }

  loginUser2(data: LoginModel) {
    return new Promise((resolve, reject) => {
      this.http.post(`${apiConfig.apiUrl}/FlyAuth/login`, data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          this._alertsService.showErrorToaster(err.error);
          //reject(err);
        });
    });
  }

  scoterList() {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:30823/GetVehicls', '')
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          this._alertsService.showErrorToaster(err.error);
          //reject(err);
        });
    });
  }
}
