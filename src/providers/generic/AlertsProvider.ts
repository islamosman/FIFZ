import { Injectable } from '@angular/core';
import { AlertController, ToastController } from "ionic-angular";

/*
  Generated class for the GenericProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertsProvider {

  constructor(private alertCtrl: AlertController,private toastCtrl: ToastController) {
    console.log('Hello GenericProvider Provider');
  }

  showServiceError() {
    let alert = this.alertCtrl.create({
      title: 'Service not avilable!',
      subTitle: 'Service not avilable, Please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  showConnectionError() {
    let alert = this.alertCtrl.create({
      title: 'Connection Error!',
      subTitle: 'Connection error occurred, Please check your connection!',
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorToaster(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top'
    });

    toast.present();
  }

  showWarningToaster(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top'
    });

    toast.present();
  }
}