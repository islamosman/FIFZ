import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { UserStateProvider } from "../userstate/user-state";
import { apiConfig } from "../../globalconfig";
// import { Storage } from '@ionic/storage';
import { LoadingController, NavController } from "ionic-angular";
// import { AlertsProvider } from "../../providers/generic/AlertsProvider";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResponseModel } from '../../models/ResponseModel';
import { VisibleRegion } from '@ionic-native/google-maps';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { Storage } from "@ionic/storage";

@Injectable()
export class VehiclsProvider {

    loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Logging out and clearing data Please Wait...',
    });


    headersVar: HttpHeaders = new HttpHeaders();
    constructor(public http: HttpClient, private storage: Storage,
        //private _alertsService: AlertsProvider,
        public userState: UserStateProvider,
        //private httpClient: HttpClient,
        //private storage: Storage,
        private loadingCtrl: LoadingController,
    ) {
        this.storage.get('UserState').then(user => {
            console.table(user)
            if (user != undefined && user != "") {
                this.headersVar.append('x-auth-token', user.tocken);
            }
        });


        //console.log('Hello AuthProvider Provider');
    }

    byArea(data: VisibleRegion): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetByArea`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, data, { headers: this.headersVar });
    }

    byId(idVar: any): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetById?vId=` + idVar;
        //let dataTo = { vId: idVar };

        return this.http.get(URI);
    }

    reserve(data: vehicaleReservationModel): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/Reservation`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, data);
    }


    byTripId(idVar: any): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetTripById?tripId=` + idVar;

        return this.http.get(URI);
    }

    doneByTripId(idVar: any, rate: number, inService: boolean): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/RateTripById?tripId=` + idVar + '&rate=' + rate + '&isRepair=' + inService;
        return this.http.get(URI);
    }
}
