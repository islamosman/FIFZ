import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { ResponseModel } from '../../models/ResponseModel';
import { Storage } from '@ionic/storage';
import { vehicaleReservationModel, vehicaleModel } from '../../models/vehicaleModel';
import { reservationEnum } from '../../providers/Enums/reservationEnum';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationsProvider } from '../../providers/Map/locations';
import { GeoModel } from '../../models/MapModel';
import { LatLng, Poly } from '@ionic-native/google-maps';
import { vehiclesIcons } from '../../providers/Enums/vehiclesIcons';
/**
 * Generated class for the MapsapiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;

@IonicPage()
@Component({
  selector: 'page-mapsapi',
  templateUrl: 'mapsapi.html',
})
export class MapsapiPage {
  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  lat: any;
  long: any;
  // Variables
  geoModelVar: GeoModel;
  //vehicles;

  constructor(public navCtrl: NavController, private platform: Platform, public _VehiclsProvider: VehiclsProvider, private storage: Storage
    , private geolocation: Geolocation, private menu: MenuController, public navParams: NavParams, private diagnostic: Diagnostic,
    public modalController: ModalController, private locationAccuracy: LocationAccuracy, private _location: LocationsProvider) {
    this.geoModelVar = new GeoModel();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HistoryPage');
    this.menu.swipeEnable(true);
    this.menu.enable(true);
  }
  ionViewWillEnter() { this.menu.enable(true) }
  ionViewWillLeave() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLoad() {
    this.storage.get("RideStatus").then(d => {

      if (d != null) {
        let reservModel = <vehicaleReservationModel>d;
        console.table(reservModel)
        if (reservModel.reservationEnum == reservationEnum.Start) {

          let modal = this.modalController.create(
            'InridestatusPage', null, { enableBackdropDismiss: false, cssClass: 'modal-bottom' }
          );
          modal.present();
        }
      }

    });
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


      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function (position) {
      //     this.geoModelVar.lat = position.coords.latitude;
      //     this.geoModelVar.lng = position.coords.longitude;
      //     this.loadMap();
      //   });
      // } else {
      this.geoModelVar.lat = "30.0371824";
      this.geoModelVar.lng = "31.2145495";
      this.loadMap();
      //}

      // this._location.GetCurrent().then(((resp) => {
      //   this.geoModelVar.lat = resp.coords.latitude;
      //   this.geoModelVar.lng = resp.coords.longitude;

      //   this.loadMap();
      // })).catch(err => {
      //   console.log(err);
      //   this.geoModelVar.lat = "30.0371824";
      //   this.geoModelVar.lng = "31.2145495";
      //   this.loadMap();
      // }
      // );


    });
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   this.lat = resp.coords.latitude;
    //   this.long = resp.coords.longitude;

    //   this.initMap();
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
  }


  loadMap() {

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      tilt: 30,
      mapTypeControl: false,
      //scaleControl: false,
      // rotateControl: false,
      fullscreenControl: false,
      center: { lat: this.geoModelVar.lat, lng: this.geoModelVar.lng }
    });

    this.directionsDisplay.setMap(this.map);

    this.getVehicles();

    this.addYourLocationButton();
  }

  getVehicles() {
    console.clear();
    this._VehiclsProvider.byArea().subscribe(returnData => {
      let ResultData = <ResponseModel>returnData;
      //this.vehicles = [];
      //  this.map.clear();
      let tempPosition;
      //console.log(ResultData.ReturnedObject.$values);
      for (let item of ResultData.ReturnedObject.$values) {
        let vechilModel: vehicaleModel = item;
        tempPosition = new LatLng(vechilModel.Lat, vechilModel.Lng);

        // console.log(Poly.containsLocation(tempPosition, pointsPoly) + "    " + tempPosition);

        // if (Poly.containsLocation(tempPosition, pointsPoly)) {
        item.iconImageEnum = vehiclesIcons[item.iconImageEnum];
        // this.vehicles.push(item);
        console.log(vechilModel)
        this.addMarker(item)
        // }
      }
    });
  }

  initMap() {

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      //scaleControl: false,
      // rotateControl: false,
      fullscreenControl: false,
      center: { lat: this.lat, lng: this.long }
    });

    //     this.map.setMyLocationEnabled(true);
    // this.map.getUiSettings().setMyLocationButtonEnabled(true);

    this.directionsDisplay.setMap(this.map);
    // this.addYourLocationButton();

    let map = this.map;
    // this.addMarker({ lat: this.lat, lng: this.long }, "sc 1", "123", 0, "");
    // this.addMarker({ lat: -25.363, lng: 131.044 }, "sc 2", "987", 1, "");
    //   let infowindow = new google.maps.InfoWindow({
    //     content: "name"
    //   });
    //   let marker = new google.maps.Marker({
    //     map: this.map,
    //     icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
    //       new google.maps.Size(22, 22),
    //       new google.maps.Point(0, 18),
    //       new google.maps.Point(11, 11)),
    //     position: { lat: this.lat, lng: this.long }
    //   });
    //   this.map.setCenter({ lat: this.lat, lng: this.long });

    //   google.maps.event.addListener(marker, 'click', (function (marker, i) {
    //     return function () {
    //       infowindow.setContent("name1");
    //       this.getVehicles(infowindow);
    //     }
    // })(marker, 0));

    // google.maps.event.addListener(marker, 'click', () => {
    //   //infoWindow.open(this.map, marker);
    //   this.getVehicles();
    // });
    // marker.addListener('click', function() {
    //   this.ngZOne.run(()=>{
    //     this.getVehicles();
    //  });

    //   map.setZoom(8);
    //   map.setCenter(marker.getPosition());
    // });

    map.addListener('center_changed', function (e) {
      // 3 seconds after the center of the map has changed, pan back to the
      // marker.
      console.clear();
      console.log(map.getBounds())

      // console.log(map.getBounds().extend())

      console.log(map.getBounds().getCenter())
      console.log(map.getBounds().getNorthEast())
      console.log(map.getBounds().getSouthWest())
      // console.log(map.getBounds().intersects())

      let poundsJson = map.getBounds().toJSON();
      console.log(map.getCenter().lat())
      console.log(map);

      let polygonArray = [];


      // console.log({ lat: map.getBounds().getNorthEast().lat(), lng: map.getBounds().getNorthEast().lng() });
      // console.log({ lat: map.getBounds().getSouthWest().lat(), lng: map.getBounds().getSouthWest().lng() });
      polygonArray.push({ lat: map.getBounds().getSouthWest().lat(), lng: map.getBounds().getSouthWest().lng() });
      polygonArray.push({ lat: map.getBounds().getNorthEast().lat(), lng: map.getBounds().getNorthEast().lng() });
      polygonArray.push({ lat: map.getBounds().getCenter().lat(), lng: map.getBounds().getCenter().lng() });




      // let polyObj = new google.maps.Polygon({
      //   paths: polygonArray,
      //   strokeWeight: 0,
      //   fillOpacity: 0.45,
      //   editable: true
      // });
      // polyObj.setMap(map);

    });

    console.log("Finished")
  }

  // marker: any;
  addMarker(vehicaleModel: vehicaleModel) {//location, name, plateNo, i, imagePath
    console.log(vehicaleModel.id)
    let infowindow = new google.maps.InfoWindow({
      content: vehicaleModel.id.toString()
    });

    let tempPos = { lat: Number(vehicaleModel.Lat), lng: Number(vehicaleModel.Lng) };
    console.log(tempPos)

    // if (!marker || !marker.setPosition) {
    let marker = new google.maps.Marker({
      position: tempPos,
      map: this.map,
      draggable: false,
      icon: {
        url: vehicaleModel.iconImageEnum,
        size: {
          width: 50,
          height: 70
        }
      },
      iconData: {
        url: vehicaleModel.iconImageEnum,
        size: {
          width: 50,
          height: 70
        }
      }
    });

    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(this.map, marker);
      let modal = this.modalController.create(
        'SelectedRabbitPage', { vId: infowindow.content }, { enableBackdropDismiss: true, cssClass: 'modal-center' }
      );
      modal.present();
    });

    // google.maps.event.addListener(this.marker, 'click', (function (marker, i) {

    //   return function () {
    //     //this.getVehicles("D")
    //     infowindow.setContent(name + ' (' + plateNo + ')');
    //     infowindow.open(this.map, marker);
    //   }
    // })(this.marker, i));
  }

  // getVehicles(infowindow) {
  //   let pointsPoly: any[] = [];

  //   console.log("GetVvvvvv" + infowindow)
  // pointsPoly.push({data.farLeft.lat, data.farLeft.lng));
  // pointsPoly.push(new LatLng(data.farRight.lat, data.farRight.lng));
  // pointsPoly.push(new LatLng(data.northeast.lat, data.northeast.lng));
  // // pointsPoly.push(new LatLng(data.southwest.lat, data.southwest.lng));
  // pointsPoly.push(new LatLng(data.nearRight.lat, data.nearRight.lng));
  // pointsPoly.push(new LatLng(data.nearLeft.lat, data.nearLeft.lng));

  // this._VehiclsProvider.byArea(pointsPoly).subscribe(returnData => {
  //   let ResultData = <ResponseModel>returnData;
  //   this.vehicles = [];
  //   this.map.clear();
  //   let tempPosition;
  //   //console.log(ResultData.ReturnedObject.$values);
  //   for (let item of ResultData.ReturnedObject.$values) {
  //     let vechilModel: vehicaleModel = item;
  //     tempPosition = new LatLng(vechilModel.Lat, vechilModel.Lng);

  //    // console.log(Poly.containsLocation(tempPosition, pointsPoly) + "    " + tempPosition);

  //     if (Poly.containsLocation(tempPosition, pointsPoly)) {
  //       item.iconImageEnum = vehiclesIcons[item.iconImageEnum];
  //       this.vehicles.push(item);
  //       this.addMarker(item)
  //     }
  //   }
  // });
  // }

  addYourLocationButton() {
    let map = this.map;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
      });
    } else {
    }
  }
}
