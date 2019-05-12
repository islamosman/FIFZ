import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { TripHistory } from '../../models/vehicaleModel';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public _VehiclsProvider: VehiclsProvider) {
  }

  ionViewDidLoad() {
    this.getHistory();
  }

  tripsList;//: TripHistory[]=[];
  getHistory() {
    this._VehiclsProvider.tripHistory().subscribe(returnData => {
      this.tripsList = <TripHistory[]>returnData.ReturnedObject.$values;
      //  console.log(ff)
      console.table(returnData.ReturnedObject);
    });
  }
}
