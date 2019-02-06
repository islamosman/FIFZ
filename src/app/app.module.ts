import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, OnInit } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from "@ionic-native/google-maps";
//import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

import { AuthProvider } from '../providers/auth/auth';
import { UserStateProvider } from "../providers/userstate/user-state";
import { AlertsProvider } from '../providers/generic/AlertsProvider';
import { HttpClientModule } from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation'
import { autocompletePageModule } from '../pages/autocomplete/autocomplete.module';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LocationsProvider } from '../providers/Map/locations';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation'
import { QRScanner } from '@ionic-native/qr-scanner';
import { Sim } from '@ionic-native/sim';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppErrorHandler } from '../providers/generic/AppErrorHandler';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    autocompletePageModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql', 'localStorage']    //,localStorage
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    AuthProvider,
    UserStateProvider,
    AlertsProvider,
    Geolocation,
    LocationAccuracy,
    Diagnostic,
    OpenNativeSettings,
    BackgroundGeolocation,
    LocationsProvider,
    QRScanner,
    Sim,
    UniqueDeviceID,
    { provide: ErrorHandler, useClass: AppErrorHandler }//IonicErrorHandler
  ]
})
export class AppModule { }
