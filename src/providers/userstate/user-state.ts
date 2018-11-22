import {Injectable} from '@angular/core';
import {UserModel} from "../../models/usermodel";

/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserStateProvider {
  currentUser:UserModel;
  
  constructor() {
  }

  public setUser(user:UserModel){
    if(user){
      this.currentUser = user;
    }
  }

  public getUser():UserModel{
    return this.currentUser;
  }

  public clearState(){
    this.currentUser=null;
  }

}

