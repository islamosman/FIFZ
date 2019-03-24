import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { UserStateProvider } from "../userstate/user-state";
import { apiConfig } from "../../globalconfig";
import { Storage } from '@ionic/storage';
import { LoadingController, NavController } from "ionic-angular";
import { AlertsProvider } from "../../providers/generic/AlertsProvider";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResponseModel } from '../../models/ResponseModel';
import { VisibleRegion } from '@ionic-native/google-maps';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
@Injectable()
export class VehiclsProvider {

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
        //console.log('Hello AuthProvider Provider');
    }

    byArea(data: VisibleRegion): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetByArea`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, data);
    }

    reserve(data: vehicaleReservationModel): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/Reservation`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, data);
    }
}
