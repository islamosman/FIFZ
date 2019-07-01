import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the HelprabbitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-helprabbit',
  templateUrl: 'helprabbit.html',
})
export class HelprabbitPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public sanitizer: DomSanitizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelprabbitPage');
  }
  iframeSrc: SafeResourceUrl;
  segmentChanged($event) {
    if ($event._value == "privacy") {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://rabbit-app.com/LogIn/privacy");
    } else if ($event._value == "terms") {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://rabbit-app.com/LogIn/terms");
    } else if ($event._value == "agreement") {
      this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("https://rabbit-app.com/LogIn/agreement");
    }
  }
}
