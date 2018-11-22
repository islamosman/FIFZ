import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";

/*
  Generated class for the GenericProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GenericProvider {

  constructor(private alertCtrl: AlertController) {
    console.log('Hello GenericProvider Provider');
  }

  showConnectionError(){
    let alert = this.alertCtrl.create({
      title: 'Connection Error!',
      subTitle: 'Connection error occurred, Please check your connection!',
      buttons: ['OK']
    });
    alert.present();
  }
  
}
