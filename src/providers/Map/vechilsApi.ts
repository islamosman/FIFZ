import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import { UserStateProvider } from "../userstate/user-state";
import { apiConfig } from "../../globalconfig";
// import { Storage } from '@ionic/storage';
import { LoadingController } from "ionic-angular";
// import { AlertsProvider } from "../../providers/generic/AlertsProvider";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResponseModel } from '../../models/ResponseModel';
//import { VisibleRegion } from '@ionic-native/google-maps';
import { vehicaleReservationModel } from '../../models/vehicaleModel';
import { Storage } from "@ionic/storage";
import { SubscriptionModel } from '../../models/usermodel';

@Injectable()
export class VehiclsProvider {

    loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Logging out and clearing data Please Wait...',
    });

    token: any;
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
                // this.headersVar.append('x-auth-token', user.tocken);
                this.token = user.tocken;
            }
        });


        //console.log('Hello AuthProvider Provider');
    }

    payment1(): Observable<any> {
        let data = {
            "api_key": "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsSWpvaWFXNXBkR2xoYkNJc0luQnliMlpwYkdWZmNHc2lPak15TlRrc0ltTnNZWE56SWpvaVRXVnlZMmhoYm5RaWZRLk44cWZOclBablVHbUxfZTkyOWtLUG5sQXVNQXhqY0VKcUJSZWhUOHZRcTNySVdHMW5XQ0Nnd2g5aG8za19nZVgwT09TN01uUlFQYlJBUU52eTVxMVpn"
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post<ResponseModel>("https://accept.paymobsolutions.com/api/auth/tokens"
            , data, { headers: this.headersVar });
    }

    payment2(authT: string, amount: any, tripId: string): Observable<any> {
        let data = {
            "auth_token": authT,
            "delivery_needed": "false",
            "merchant_id": "3259",
            "amount_cents": parseFloat((amount * 100).toString()).toFixed(2) ,
            "currency": "EGP",
            "merchant_order_id": tripId,
            "items": []
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post<ResponseModel>("https://accept.paymobsolutions.com/api/ecommerce/orders"
            , data, { headers: this.headersVar });
    }

    payment3(authT: string, amount: any, orderId: number,integrationId :number): Observable<any> {
        let data = {
            "auth_token": authT,
            "amount_cents": parseFloat((amount * 100).toString()).toFixed(2),
            "expiration": 3600,
            "order_id": orderId,
            "currency": "EGP",
            "integration_id": integrationId,
            "lock_order_when_paid": "false",
            "billing_data": {
                "apartment": "803",
                "email": "claudette09@exa.com",
                "floor": "42",
                "first_name": "Clifford",
                "street": "Ethan Land",
                "building": "8028",
                "phone_number": "+86(8)9135210487",
                "shipping_method": "PKG",
                "postal_code": "01898",
                "city": "Jaskolskiburgh",
                "country": "CR",
                "last_name": "Nicolas",
                "state": "Utah"
            },
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post<ResponseModel>("https://accept.paymobsolutions.com/api/acceptance/payment_keys"
            , data, { headers: this.headersVar });
    }

    paymentBackToBack(authT: string, userTB: string): Observable<any> {
        let data = {
            "source": {
                "identifier": userTB,
                "subtype": "TOKEN",
            },
            "payment_token": authT,
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post<ResponseModel>("https://accept.paymobsolutions.com/api/acceptance/payments/pay"
            , data, { headers: this.headersVar });
    }

    refundOrderPayment(authT: string, refundedId: any) {
        let data = {
            "auth_token": authT,
            "transaction_id": refundedId,
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post("https://accept.paymobsolutions.com/api/acceptance/void_refund/void"
            , data, { headers: this.headersVar });
    }

    paymentRefundSave() {
        let URI = `${apiConfig.apiUrl}/Vehicles/UserPaymentRefund`;
        return this.http.post<ResponseModel>(URI + "", { headers: this.headersVar });
    }

    paymentUserOrderSave(userId: string, orderId: number) {
        let URI = `${apiConfig.apiUrl}/Vehicles/UserPaymentId`;
        return this.http.post<ResponseModel>(URI + "?userId=" + userId + "&orderId=" + orderId, "", { headers: this.headersVar });
    }

    paymentOrderSave(tripId: string, orderId: number) {
        // let data = {
        //     "tripId": tripId,
        //     "orderId": orderId,
        // };
        let URI = `${apiConfig.apiUrl}/Vehicles/TripPaymentId`;
        return this.http.post<ResponseModel>(URI + "?tripId=" + tripId + "&orderId=" + orderId, "", { headers: this.headersVar });
    }



    paymentIframe(authT: string): Observable<any> {
        let data = {
            "card_number": "4987654321098769",
            "card_holdername": "Test Account",
            "card_expiry_mm": "05",
            "card_expiry_yy": "21",
            "card_cvn": "123",
            "subtype": "CARD"
        };

        this.headersVar.append("Content-Type", "application/json")
        return this.http.post<ResponseModel>("https://accept.paymobsolutions.com/api/acceptance/iframes/8155?payment_token=" + authT
            , data, { headers: this.headersVar });
    }

    //data: VisibleRegion
    byArea(): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetByArea`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, "", { headers: this.headersVar });
    }

    byId(idVar: any): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetById?vId=` + idVar;
        //let dataTo = { vId: idVar };

        return this.http.post(URI, "");
    }

    reserve(data: vehicaleReservationModel): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/Reservation`;
        //console.log("hit server"  + URI);
        return this.http.post<ResponseModel>(URI, data);
    }


    byTripId(idVar: any): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/GetTripByIdPost?tripId=` + idVar;

        return this.http.post(URI, "");
    }

    checkPromo(idVar: any): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/PromoCodeStatusPost?promoName=` + idVar;

        return this.http.post(URI, "");
    }

    doneByTripId(idVar: any, rate: number, inService: boolean): Observable<any> {
        let URI = `${apiConfig.apiUrl}/Vehicles/RateTripByIdPost?tripId=` + idVar + '&rate=' + rate + '&isRepair=' + inService;
        return this.http.post(URI,"");
    }

    tripHistory(): Observable<ResponseModel> {
        let URI = `${apiConfig.apiUrl}/Vehicles/TripHistoryPost`;
        return this.http.post<ResponseModel>(URI, "");
    }

    subscription(modelTo: SubscriptionModel): Observable<ResponseModel> {

        // let tt : HttpHeaders = new HttpHeaders();
        // let headers = new Headers();
        // headers.append('Authorization', 'Bearer ' + modelTo.tocken);
        // let URI = `${apiConfig.apiUrl}/Vehicles/Subscription`;
        // return this.http.post<ResponseModel>(URI, modelTo, { headers: { 'Authorization': 'Bearer ' + modelTo.tocken } });
        let URI = `${apiConfig.apiUrl}/Vehicles/Subscription`;
        return this.http.post<ResponseModel>(URI, modelTo);

    }

    uploadPic(imageBase: any, token: any): Observable<any> {
        this.token = token;
        //console.log(imageBase)
        let formData: FormData = new FormData();
        formData.append('file', imageBase, "file.name");
        // let dataTo = {
        //     base64image: imageBase
        // };
        //let param = imageBase;

        this.headersVar.append('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');
        this.headersVar.append('Authorization', 'Bearer ' + this.token);
        // this.http.post(URI, dataTo,{ headers: headersVar, withCredentials: true});

        // this.headersVar.set('Content-Type','application/x-www-form-urlencoded');
        let URI = `${apiConfig.apiUrl}/Vehicles/UploadFile`;
        return this.http.post(URI, formData, { headers: this.headersVar });//, 
    }
}
