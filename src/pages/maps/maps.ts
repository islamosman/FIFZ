import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController, MenuController, NavParams, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  HtmlInfoWindow
} from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AutocompletePage } from '../autocomplete/autocomplete';
import { LocationAccuracy } from '@ionic-native/location-accuracy'
import { fromEvent } from 'rxjs/observable/fromEvent';
import { LocationsProvider } from '../../providers/Map/locations';
import { GeoModel } from '../../models/MapModel'
import { vehicaleModel } from '../../models/vehicaleModel';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    private menu: MenuController, private _location: LocationsProvider, private openNativeSettings: OpenNativeSettings,
    public navParams: NavParams, private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation,
    private ModalCtrl: ModalController, private locationAccuracy: LocationAccuracy) {
    // Begin Constractor
    this.geoModelVar = new GeoModel();

  }

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/img/scoter1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/scoter1.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/scoter1.png",
    }
  ];
  

  ngOnInit() {

    this.address = {
      place: ''
    };

    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    let errorCallback = (e) => console.error(e);

    this.diagnostic.isGpsLocationAvailable().then(successCallback).catch(errorCallback);

    //this.diagnostic.isCameraAvailable().then(successCallback, errorCallback);




    this.platform.ready().then(() => {

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log("Can req : " + canRequest)
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }

      });

      this.diagnostic.requestLocationAuthorization("always")
        .then((state) => {
          console.log(JSON.stringify(state));
        }).catch(e => console.error(e));

      // this.openNativeSettings.open("location").then((data)=>{
      //   console.log(JSON.stringify(data));
      // })
      // this.requestLocationAccuracy();
      this.geoModelVar.lat = 41.799240000000005;
      this.geoModelVar.lng = 140.75875000000002;
      //this._location.GetCurrent().then(((resp) => {
      // this.geoModelVar.lat = resp.coords.latitude;
      // this.geoModelVar.lng = resp.coords.longitude;
      this.loadMap();
      //}));
    });
  }

  showAddressModal() {
    let modal = this.ModalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
    });
    modal.present();
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
  }

  loadMap() {
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
console.log(JSON.stringify(this.map.getVisibleRegion()));

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
        url: "./assets/imgs/scoter1.png",
        size: {
          width: 24,
          height: 24
        }
      },
      iconData: {
        url: "./assets/imgs/scoter1.png",
        size: {
          width: 24,
          height: 24
        }
      }
      ,
      styles: "",
      animation: 'DROP',
      draggable: true,
      position: {
        lat: this.lat,
        lng: this.lng
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((e) => {
      console.log(JSON.stringify(e));
      htmlInfoWindow.open(marker);
    });

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then((readyData) => {
        console.log(JSON.stringify(readyData));
        // Get area codinates
        this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe((e) => {
          // console.log("d " +JSON.stringify(e));
        });
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

  addMarker(marker: Marker) {

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
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
};

this.backgroundGeolocation.configure(config)
.subscribe((location: BackgroundGeolocationResponse) => {

console.log("Hero " + JSON.stringify(location));
// IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
// and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
// IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
this.backgroundGeolocation.finish(); // FOR IOS ONLY

});

// start recording location
this.backgroundGeolocation.start();

// If you wish to turn OFF background-tracking, call the #stop method.
//this.backgroundGeolocation.stop();

    this.backgroundGeolocation.getValidLocations().then((data) => {
      console.log("1# " + data);
    });

    
      console.log("2# " + this.backgroundGeolocation.LocationProvider);
    

    this.backgroundGeolocation.getLocations().then((data) => {
      console.log("3# " + data);
    });
    this.backgroundGeolocation.stop();
  }

}
