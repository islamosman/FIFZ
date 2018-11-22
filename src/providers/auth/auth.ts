import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/observable/of';
import {UserStateProvider} from "../userstate/user-state";
import {apiConfig} from "../../globalconfig";
import {Storage} from '@ionic/storage';
import {LoadingController, NavController} from "ionic-angular";

// import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthProvider {

  loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Logging out and clearing data Please Wait...',
  });

  constructor(public http: HttpClient,
              public userState:UserStateProvider,
              private httpClient: HttpClient,
              private storage:Storage,
              private loadingCtrl: LoadingController,
              ) {
    console.log('Hello AuthProvider Provider');
  }

  logOut(navCtrl: NavController){
    this.userState.clearState();
    //this.loading.present();
      this.storage.clear().then(data=>{
        // debugger;
        console.log('AuthProvider Logout Success',data);
        //this.loading.dismiss().then(()=>{
          navCtrl.setRoot('LoginPage');
        //});
      }).catch(err=>{
        console.log('AuthProvider Logout Error',err);
        this.loading.dismiss();
       // navCtrl.setRoot('LoginPage');
      })

  }

  getUser(user) {
    if (user !== null && user.username.toLowerCase() != "" && user.password.toLowerCase() != "") {


      let url=`${apiConfig.apiUrl}/CustomerLogin?username=${user.username.toLowerCase()}&password=${user.password}`;
      console.log('hit url',url);
      return this.httpClient.get(url);
      // return Observable.of({
      //   "Candidate_Coupone": [],
      //   "Id": 1,
      //   "FullName": "ahmed sabry",
      //   "Customer_CategoryId": 1,
      //   "UserName": "admin",
      //   "Password": "123",
      //   "Address": "fff",
      //   "Telephone1": "312323",
      //   "Telephone2": "3213",
      //   "Telephone3": "1323",
      //   "Email": "ahmed@yahoo.com",
      //   "Notes": "dfd",
      //   "AddedBy": 1,
      //   "DateAdded": "2018-01-01T00:00:00",
      //   "DateModified": null,
      //   "ModifiedBy": null
      // });

    }
  }
}
