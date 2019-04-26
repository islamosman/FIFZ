import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  tripId: number;
  tripAmount: number;

  constructor(public navCtrl: NavController, public _alerts: AlertsProvider, public navParams: NavParams, public _VehiclsProvider: VehiclsProvider, public sanitizer: DomSanitizer) {
    this.tripId = navParams.get('rId');
    this.tripAmount = navParams.get('amount');
  }
  
  iframeSrc: SafeResourceUrl;
  ionViewDidLoad() {
    this.payment();
    //this.iframeSrc=this.sanitizer.bypassSecurityTrustResourceUrl("https://accept.paymobsolutions.com/api/acceptance/iframes/8155?payment_token=ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhiVzkxYm5SZlkyVnVkSE1pT2pFMU1EQXNJblZ6WlhKZmFXUWlPak0yT0RBc0luQnRhMTlwY0NJNklqUXhMalEwTGpJek1TNHpPQ0lzSW14dlkydGZiM0prWlhKZmQyaGxibDl3WVdsa0lqcG1ZV3h6WlN3aWFXNTBaV2R5WVhScGIyNWZhV1FpT2pVd05EWXNJbVY0Y0NJNk1UVTFOakV4TnpReE1Td2lZbWxzYkdsdVoxOWtZWFJoSWpwN0ltWnBjbk4wWDI1aGJXVWlPaUpEYkdsbVptOXlaQ0lzSW14aGMzUmZibUZ0WlNJNklrNXBZMjlzWVhNaUxDSnpkSEpsWlhRaU9pSkZkR2hoYmlCTVlXNWtJaXdpWW5WcGJHUnBibWNpT2lJNE1ESTRJaXdpWm14dmIzSWlPaUkwTWlJc0ltRndZWEowYldWdWRDSTZJamd3TXlJc0ltTnBkSGtpT2lKS1lYTnJiMnh6YTJsaWRYSm5hQ0lzSW5OMFlYUmxJam9pVlhSaGFDSXNJbU52ZFc1MGNua2lPaUpEVWlJc0ltVnRZV2xzSWpvaVkyeGhkV1JsZEhSbE1EbEFaWGhoTG1OdmJTSXNJbkJvYjI1bFgyNTFiV0psY2lJNklpczROaWc0S1RreE16VXlNVEEwT0RjaUxDSndiM04wWVd4ZlkyOWtaU0k2SWpBeE9EazRJaXdpWlhoMGNtRmZaR1Z6WTNKcGNIUnBiMjRpT2lKT1FTSjlMQ0p2Y21SbGNsOXBaQ0k2TXpBek9Ua3hNaXdpWTNWeWNtVnVZM2tpT2lKRlIxQWlmUS5KVGFtVlFPcWVrNTlMLTJmQVNWbmVnaUZkLUdpY2pzdTlmQV9wMmhOVHJzdDF2WUhXWjJlbGJsX1NsS1JYdk8zWnlLMkc1Q3U2ZG12R21vaUFlQU1CZw==");
    console.log('ionViewDidLoad PaymentPage');
  }


  payment() {
    this._alerts.showLoader();

    this._VehiclsProvider.payment1().subscribe(returnData1 => {
      if (returnData1) {

        this._VehiclsProvider.payment2(returnData1.token, this.tripAmount, this.tripId).subscribe(returnData2 => {

          this._VehiclsProvider.paymentOrderSave(this.tripId, returnData2.id).subscribe(returnDataIframe => {

            this._VehiclsProvider.payment3(returnData1.token, this.tripAmount, returnData2.id).subscribe(returnData3 => {

              this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://accept.paymobsolutions.com/api/acceptance/iframes/8155?payment_token=" + returnData3.token);
              this._alerts.hideLoader();
            });

          });
        });
      }
    });
  }
}
