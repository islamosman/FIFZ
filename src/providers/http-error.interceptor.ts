import { HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http/';
import { HttpEvent, HttpHandler } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { from } from "rxjs/Observable/from";
import { switchMap, map, catchError } from 'rxjs/operators';
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

    intercept2222222222(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url == "https://accept.paymobsolutions.com/api/ecommerce/orders"
            || req.url == "https://accept.paymobsolutions.com/api/acceptance/payment_keys"
            || req.url == "https://accept.paymobsolutions.com/api/acceptance/payments/pay"
            //|| req.url == "http://localhost:30823/api/Vehicles/GetByArea"
        ) {
            return next.handle(req);
        } else {
            console.log("tocken inter : " + this.token)
            const changedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.token) });
            return next.handle(changedReq);
        }

    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url == "https://accept.paymobsolutions.com/api/ecommerce/orders"
            || request.url == "https://accept.paymobsolutions.com/api/acceptance/payment_keys"
            || request.url == "https://accept.paymobsolutions.com/api/acceptance/payments/pay"
            || request.url == "https://accept.paymobsolutions.com/api/acceptance/void_refund/void"
        ) {
            return next.handle(request);
        } else {
            return from(this.storage.get("UserState"))
                .pipe(
                    switchMap(token => {
                        
                        if (token) {
                            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token.tocken) });
                        }


                        return next.handle(request).pipe(
                            map((event: HttpEvent<any>) => {
                                if (event instanceof HttpResponse) {
                                    // do nothing for now
                                }
                                return event;
                            }),
                            // catchError((error: HttpErrorResponse) => {
                            //     const status =  error.status;
                            //     const reason = error && error.error.reason ? error.error.reason : '';
                            //     return error;
                            // })
                        );
                    })
                );
        }
    }

}