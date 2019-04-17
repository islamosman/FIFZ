import { Component, OnInit, ɵConsole } from '@angular/core';
import { IonicPage, ModalController, NavController, MenuController, NavParams, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  // CameraPosition,
  // MarkerOptions,
  Marker,
  Environment,
  HtmlInfoWindow,
  VisibleRegion,
  // LatLngBounds,
  ILatLng,
  LatLng,
  // Polygon,
  // PolylineOptions,
  // PolygonOptions,
  // BaseArrayClass,
  Poly
} from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
// import { AutocompletePage } from '../autocomplete/autocomplete';
import { LocationAccuracy } from '@ionic-native/location-accuracy'
//import { fromEvent } from 'rxjs/observable/fromEvent';
import { LocationsProvider } from '../../providers/Map/locations';
import { GeoModel } from '../../models/MapModel'
import { vehicaleModel, vehicaleReservationModel } from '../../models/vehicaleModel';
// import { OpenNativeSettings } from '@ionic-native/open-native-settings';
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { ResponseModel } from '../../models/ResponseModel';
import { vehiclesIcons } from '../../providers/Enums/vehiclesIcons';
// import { AlertsProvider } from '../../providers/generic/AlertsProvider';
// import { reservationEnum } from '../../providers/Enums/reservationEnum';
// import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
//import { ScanCodePage } from '../scan-code/scan-code';
/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// declare var google;
@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage implements OnInit {

  // Variables
  geoModelVar: GeoModel;

  vehicalModel: vehicaleModel;
  map: GoogleMap;
  lat: any;
  lng: any;
  address;

  constructor(public navCtrl: NavController, private platform: Platform, private diagnostic: Diagnostic,
    private menu: MenuController, private _location: LocationsProvider,
    public navParams: NavParams, private geolocation: Geolocation, 
     private locationAccuracy: LocationAccuracy, public modalController: ModalController,public _VehiclsProvider: VehiclsProvider
    //  ,private ModalCtrl: ModalController, private _alertsService: AlertsProvider,
    //   private openNativeSettings: OpenNativeSettings,private backgroundGeolocation: BackgroundGeolocation,
      ) {
    // Begin Constractor
    this.geoModelVar = new GeoModel();

  }

  vehicles;

  map2: any;
  ngOnInit() {

    // mostafa css in maps.scss
    // let modal = this.modalController.create(
    //   'InridestatusPage', null,{enableBackdropDismiss:false,cssClass:'modal-bottom'}
    //   );
    // modal.present();
    // let modal = this.modalController.create(
    //   'EndridePage', null,{enableBackdropDismiss:false,cssClass:'modal-bottom'}
    //   );
    // modal.present();


    this.address = {
      place: ''
    };

    // let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    // let errorCallback = (e) => console.error(e);

    //this.diagnostic.isGpsLocationAvailable().then(successCallback).catch(errorCallback);

    ////this.diagnostic.isCameraAvailable().then(successCallback, errorCallback);

    this.platform.ready().then(() => {

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log("Can req : " + canRequest)
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_LOW_POWER).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }

      });

      this.diagnostic.requestLocationAuthorization("always")
        .then((state) => {
          console.log(JSON.stringify(state));
        }).catch(e => console.error(e));

      this._location.GetCurrent().then(((resp) => {
        this.geoModelVar.lat = resp.coords.latitude;
        this.geoModelVar.lng = resp.coords.longitude;
        console.log("longLat : > " + resp.coords);
        this.loadMap();
      })).catch(err => {
        console.log(err);
        this.geoModelVar.lat = "30.783314141910544";
        this.geoModelVar.lng = "34.94217772246134";
        this.loadMap();
      }
      );


    });
  }

  // showAddressModal() {
  //   let modal = this.ModalCtrl.create(AutocompletePage);
  //   let me = this;
  //   modal.onDidDismiss(data => {
  //     this.address.place = data;
  //   });
  //   modal.present();
  // }

  ionViewDidEnter() {
    this.menu.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
  }

  loadMap() {
    console.log("load map 1")
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBLKRh7JfikPylbNdGfTiDbe6zut1yabxo',
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBLKRh7JfikPylbNdGfTiDbe6zut1yabxo'
    });

    // this.map = new GoogleMap('map_canvas');
    //  this.map=GoogleMaps.create('map_canvas');
    let mapOptions: GoogleMapOptions = {
      camera: {
        duration: 1000,
        target: {
          lat: this.geoModelVar.lat,
          lng: this.geoModelVar.lng
        },
        zoom: 15,
        tilt: 30
      },
      controls: { zoom: false, compass: false, mapToolbar: false, myLocation: true, myLocationButton: true },
      gestures: {
        scroll: true,
        tilt: false,
        rotate: true,
        zoom: true
      },
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then((readyData) => {
        console.log("Map ready")
        this.getVehicles(this.map.getVisibleRegion());

        //console.log(" <<<  " + JSON.stringify(readyData));
        // Get area codinates
        this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((e) => {
          //console.log("d " + JSON.stringify(e));
          this.getVehicles(this.map.getVisibleRegion());
        });
      });
  }

  getVehicles(data: VisibleRegion) {
    let pointsPoly: ILatLng[] = [];
    pointsPoly.push(new LatLng(data.farLeft.lat, data.farLeft.lng));
    pointsPoly.push(new LatLng(data.farRight.lat, data.farRight.lng));
    pointsPoly.push(new LatLng(data.northeast.lat, data.northeast.lng));
    // pointsPoly.push(new LatLng(data.southwest.lat, data.southwest.lng));
    pointsPoly.push(new LatLng(data.nearRight.lat, data.nearRight.lng));
    pointsPoly.push(new LatLng(data.nearLeft.lat, data.nearLeft.lng));

    this._VehiclsProvider.byArea(data).subscribe(returnData => {
      let ResultData = <ResponseModel>returnData;
      this.vehicles = [];
      this.map.clear();
      let tempPosition;
      for (let item of ResultData.ReturnedObject.$values) {
        let vechilModel: vehicaleModel = item;
        tempPosition = new LatLng(vechilModel.Lat, vechilModel.Lng);

        console.log(Poly.containsLocation(tempPosition, pointsPoly) + "    " + tempPosition);

        if (Poly.containsLocation(tempPosition, pointsPoly)) {
          item.iconImageEnum = vehiclesIcons[item.iconImageEnum];
          this.vehicles.push(item);
          this.addMarker(item)
        }
      }
    });
  }

  successFun(pos) {
    console.log("Success is " + JSON.stringify(pos));
  }
  failurFun(pos) {
    console.log("Error is" + JSON.stringify(pos));
  }
  myLocation() {
    this.backGroundGeo();

    let options = {
      maximumAge: 3000,
      timeout: 30000,
      enableHighAccuracy: true
    };

    navigator.geolocation.getCurrentPosition(this.successFun, this.failurFun, options);

    console.log("try to locate ");
    this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {
      // loading.dismiss();
      console.log("current location at login" + position.coords.latitude);

      // Run update inside of Angular's zone
      // this.zone.run(() => {
      // this.currentLat = position.coords.latitude;
      // this.currentLng = position.coords.longitude;
      //});

    });

    this.geolocation.getCurrentPosition(options).then((resp: Geoposition) => {
      console.log("Ya Rab : " + JSON.stringify(resp));
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: this.lat,
            lng: this.lng
          },
          zoom: 15,
          tilt: 30
        },
        controls: { zoom: false, compass: false, mapToolbar: false, myLocation: true, myLocationButton: true },
        gestures: {
          scroll: true,
          tilt: false,
          rotate: true,
          zoom: true
        },
      };
      this.map.setOptions(mapOptions);

      //      this.loadMap();

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  addMarker(vehicaleModel: vehicaleModel) {
    var htmlInfoWindow = new HtmlInfoWindow();
    var html = [
      'This is <b>Html</b> InfoWindow',
      '<br>',
      '<button onclick="javascript:alert(\'clicked!\');">click here</button>',
    ].join("");
    htmlInfoWindow.setContent(html)

    let marker: Marker = this.map.addMarkerSync({
      //title: '<div class="infoclass">Mohamed </div>',
      // icon: 'blue',
      icon: {
        url: vehicaleModel.iconImageEnum,
        size: {
          width: 40,
          height: 62
        }
      },
      iconData: {
        url: vehicaleModel.iconImageEnum,
        size: {
          width: 40,
          height: 62
        }
      }
      ,
      styles: "",
      animation: 'DROP',
      draggable: false,
      position: {
        lat: vehicaleModel.Lat,
        lng: vehicaleModel.Lng
      }
    });

    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((e) => {
      // this._VehiclsProvider.distance().subscribe(returnData => {
      //   console.log(returnData)
      // })
      //this.navCtrl.setRoot("ScanCodePage", { vId: "123" });

      //mostafa remove previous line
      let modal = this.modalController.create(
        'SelectedRabbitPage', { vId: 123 },{enableBackdropDismiss:true,cssClass:'modal-center'}
        );
      modal.present();

      // htmlInfoWindow.open(marker);
    });
  }

  query: string = '';
  autocompleteService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  places: any = [];
  searchPlace() {

    this.saveDisabled = true;

    if (this.query.length > 0 && !this.searchDisabled) {

      let config = {
        types: ['geocode'],
        input: this.query
      }

      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

        // if(status == google.maps.places.PlacesServiceStatus.OK && predictions){

        this.places = [];

        predictions.forEach((prediction) => {
          this.places.push(prediction);
        });
        //}

      });

    } else {
      this.places = [];
    }

  }


  backGroundGeo() {
    // const config: BackgroundGeolocationConfig = {
    //   desiredAccuracy: 10,
    //   stationaryRadius: 20,
    //   distanceFilter: 30,
    //   debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    //   stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    // };

    // this.backgroundGeolocation.configure(config)
    //   .subscribe((location: BackgroundGeolocationResponse) => {

    //     console.log("Hero " + JSON.stringify(location));
    //     // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    //     // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    //     // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    //     this.backgroundGeolocation.finish(); // FOR IOS ONLY

    //   });

    // // start recording location
    // this.backgroundGeolocation.start();

    // // If you wish to turn OFF background-tracking, call the #stop method.
    // //this.backgroundGeolocation.stop();

    // this.backgroundGeolocation.getValidLocations().then((data) => {
    //   console.log("1# " + data);
    // });


    // console.log("2# " + this.backgroundGeolocation.LocationProvider);


    // this.backgroundGeolocation.getLocations().then((data) => {
    //   console.log("3# " + data);
    // });
    // this.backgroundGeolocation.stop();
  }

  reservationModel: vehicaleReservationModel;
  reservVechil(id: number) {
    //this._alertsService.showConfirmationDialog(id.toString(), "");

    // this.reservationModel = new vehicaleReservationModel();
    // this.reservationModel.vehicleId = "3";

    // this.reservationModel.riderId = 1;
    // this.reservationModel.reservationEnum = reservationEnum.Start;

    // this._VehiclsProvider.reserve(this.reservationModel).subscribe(returnData => {
    //   console.log(returnData);
    // });


    this.navCtrl.push("ScanCodePage", { vId: id });
    console.log("reversation # " + id);
  }
}
