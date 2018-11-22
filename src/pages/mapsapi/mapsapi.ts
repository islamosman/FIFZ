import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


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

  constructor(public navCtrl: NavController
    , private geolocation: Geolocation, private menu: MenuController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter HistoryPage');
    this.menu.swipeEnable(true);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;

      this.initMap();
    }).catch((error) => {
      console.log('Error getting location', error);
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
    console.log("Finished")
  }

  addYourLocationButton() {
    // var controlDiv = document.createElement('div');

    // var firstChild = document.createElement('button');
    // firstChild.style.backgroundColor = '#fff';
    // firstChild.style.border = 'none';
    // firstChild.style.outline = 'none';
    // firstChild.style.width = '28px';
    // firstChild.style.height = '28px';
    // firstChild.style.borderRadius = '2px';
    // firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    // firstChild.style.cursor = 'pointer';
    // firstChild.style.marginRight = '10px';
    // firstChild.style.padding = '0';
    // firstChild.title = 'Your Location';
    // controlDiv.appendChild(firstChild);

    // var secondChild = document.createElement('div');
    // secondChild.style.margin = '5px';
    // secondChild.style.width = '18px';
    // secondChild.style.height = '18px';
    // secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    // secondChild.style.backgroundSize = '180px 18px';
    // secondChild.style.backgroundPosition = '0 0';
    // secondChild.style.backgroundRepeat = 'no-repeat';
    // firstChild.appendChild(secondChild);

    // google.maps.event.addListener(this.map, 'center_changed', function () {
    //     secondChild.style['background-position'] = '0 0';
    // });

    // firstChild.addEventListener('click', function () {
    //     var imgX = '0',
    //         animationInterval = setInterval(function () {
    //             imgX = imgX === '-18' ? '0' : '-18';
    //             secondChild.style['background-position'] = imgX+'px 0';
    //         }, 500);
    let map = this.map;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {

        // this.map = new google.maps.Map(this.mapElement.nativeElement, {
        //   zoom: 15,
        //   streetViewControl: false,
        //   mapTypeId: google.maps.MapTypeId.ROADMAP,
        //   zoomControl:false,
        //   mapTypeControl: false,
        //   fullscreenControl: false,
        //   center:{lat : position.coords.latitude ,lng : position.coords.longitude}
        // });

        let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(latlng);
        // let marker = new google.maps.Marker({
        //   map: this.map,
        //   icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        //     new google.maps.Size(22, 22),
        //     new google.maps.Point(0, 18),
        //     new google.maps.Point(11, 11)),
        //   position: latlng
        // });
        // this.map.setCenter(latlng);
        // clearInterval(animationInterval);
        // secondChild.style['background-position'] = '-144px 0';
      });
    } else {
      // clearInterval(animationInterval);
      //secondChild.style['background-position'] = '0 0';
    }
    // });

    // controlDiv.index = 1;
    //this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }
}
