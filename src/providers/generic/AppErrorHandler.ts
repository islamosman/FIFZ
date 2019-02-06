import { ErrorHandler, Injectable } from "@angular/core";
import { AlertsProvider } from "./AlertsProvider";
import { ErrorModel } from "../../models/errorModel";

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(public _alerts: AlertsProvider) { }
    handleError(err: any): void {
        let errorModel = <ErrorModel>err;
        //let _alerts =AlertsProvider;
        //let _alerts  :AlertsProvider;
        if (errorModel.status == 0) {
            this._alerts.showServiceError();
        } else {
            this._alerts.showErrorToaster(errorModel.message);
        }
    }
}