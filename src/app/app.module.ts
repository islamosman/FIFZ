import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, OnInit } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Navbar } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { GoogleMaps } from "@ionic-native/google-maps";
//import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

import { AuthProvider } from '../providers/auth/auth';
import { UserStateProvider } from "../providers/userstate/user-state";
import { AlertsProvider } from '../providers/generic/AlertsProvider';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Geolocation } from '@ionic-native/geolocation'
import { autocompletePageModule } from '../pages/autocomplete/autocomplete.module';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LocationsProvider } from '../providers/Map/locations';
import { Diagnostic } from '@ionic-native/diagnostic';
// import { OpenNativeSettings } from '@ionic-native/open-native-settings';
// import { BackgroundGeolocation } from '@ionic-native/background-geolocation'
import { QRScanner } from '@ionic-native/qr-scanner';
// import { Sim } from '@ionic-native/sim';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { AppErrorHandler } from '../providers/generic/AppErrorHandler';
import { VehiclsProvider } from '../providers/Map/vechilsApi';
// import {  FacebookOriginal } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/Camera';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { TokenInterceptor } from '../providers/http-error.interceptor';

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
      name: '__mydbra',
      //driverOrder: ['indexeddb', 'sqlite', 'websql', 'localStorage']    //,localStorage
      driverOrder: ['sqlite','indexeddb', 'websql','localStorage']    //,localStorage
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //GoogleMaps,
    AuthProvider,
    VehiclsProvider,
    UserStateProvider,
    AlertsProvider,
    Geolocation,
    LocationAccuracy,  
    //FacebookOriginal,
    Diagnostic,
    //OpenNativeSettings,
    //BackgroundGeolocation,
    LocationsProvider,
    QRScanner,
    UserStateProvider,
    //Sim,
    Camera,
    File,
    WebView,
    FilePath,
    FileTransfer,
    FileTransferObject,
    UniqueDeviceID,
    Navbar,
    { provide: ErrorHandler, useClass: AppErrorHandler },//IonicErrorHandler
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ]
})
export class AppModule { }
