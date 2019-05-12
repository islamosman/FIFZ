import { HttpInterceptor, HttpRequest } from '@angular/common/http/';
import { HttpEvent, HttpHandler } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { NavController, Events } from 'ionic-angular';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    token: any = "";
    constructor(private storage: Storage, public events: Events) {
        this.storage.get('UserState').then(user => {
            console.table(user)
            if (user != undefined && user != "") {
                this.token = user.tocken;
            } else {
                this.events.publish("unauthorized:requestError");
            }
        });

        events.subscribe('user:created', (user) => {
            console.log("from event at inter ")
            this.storage.set("UserState", user);
            this.token = user.tocken;
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.url == "https://accept.paymobsolutions.com/api/ecommerce/orders"
            || req.url == "https://accept.paymobsolutions.com/api/acceptance/payment_keys"
            || req.url == "https://accept.paymobsolutions.com/api/acceptance/payments/pay") {
            return next.handle(req);
        } else {
            console.log("tocken inter : " + this.token)
            const changedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
            return next.handle(changedReq);
        }

    }
}