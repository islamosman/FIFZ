import { Injectable } from '@angular/core';
import { UserModel, LoginModel } from "../../models/usermodel";
// import { reservationEnum } from '../Enums/reservationEnum';
import { Storage } from '@ionic/storage';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
// import { Observable } from 'rxjs/Observable';
/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserStateProvider {
  currentUser: UserModel;

  constructor(private storage: Storage, ) {
  }

  setUser(user: UserModel) {
    if (user) {
      this.currentUser = user;
    }
  }

  getUser(): UserModel {
    return this.currentUser;
  }

  clearState() {
    this.currentUser = null;
  }

  setRideStatus(reservationModel: vehicaleReservationModel): any {
    this.storage.set("RideStatus", reservationModel);
  }
  clearRideState(){
    this.storage.remove("RideStatus");
    this.storage.clear();
  }

  setUserStatus(loginModel: UserModel): any {
    this.storage.remove("UserState");
    this.storage.clear();
    this.storage.set("UserState", loginModel);
    console.table(loginModel)
  }
  clearUSerState(){
    this.storage.remove("UserState");
    this.storage.clear();
  }
  // reservationModel: vehicaleReservationModel;

  // rideStatus(): Observable<vehicaleReservationModel> {
  //   this.reservationModel = new vehicaleReservationModel();
  //   this.storage.get("RideStatus").then(d => {

  //     this.reservationModel = d;

  //     return this.reservationModel;
  //   });
  // }
}

