import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from "@ionic/storage";
import {AuthProvider} from "../providers/auth/auth";
import {UserStateProvider} from "../providers/userstate/user-state";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private auth: AuthProvider,
    private storage: Storage,
    private userState:UserStateProvider,
    ) {
    this.initializeApp();

    this.pages = [
      { title: 'FIND RABBIT', component: 'MapsPage' },
      { title: 'PAYMENT', component: 'PaymentPage' },
      { title: 'HISTORY', component: 'HistoryPage' },
      { title: 'HOW TO RIDE', component: 'HowtoridePage' },
      { title: 'HELP', component: 'helprabbitPage' },
      { title: 'SETTINGS', component: 'settingsrabbitPage' },
    //  { title: 'Maps 2', component: 'MapsapiPage' },
      //{ title: 'Scan QR', component: 'ScanCodePage' },
      {title: 'Logout', component: ''}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.rootPage = 'LoginPage';
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.storage.get('user').then(user => {
        this.userState.setUser(user);
        this.rootPage = user ? 'MapsPage' : 'LoginPage';
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    
    
       // used for an example of ngFor and navigation 

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page != null && page.title.toLowerCase() == 'logout') {
      this.auth.logOut(this.nav);
      return;
    }
    this.nav.setRoot(page.component);
  }
}
