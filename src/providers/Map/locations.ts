import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/observable/of';
import { GeoModel } from '../../models/MapModel';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationsProvider {
   currentGeoModel: GeoModel

   constructor(private geolocation: Geolocation) {
   }

   GetCurrent(): Promise<Geoposition> {

      return this.geolocation.getCurrentPosition({ enableHighAccuracy: true });
   }

   GetCurrent2(): Observable<Geoposition> {

      return this.geolocation.watchPosition({ enableHighAccuracy: true });


   }
   GetCurrent3(): Promise<GeoModel> {
      // return new Promise((resolve, reject) => {
      //     this.http.post(ClientApiUrl + "workorder/UpdateAndLockWorkOrders", workOrders, { headers: headers })
      //         .map(res => res.json()).toPromise()//convert to promise
      //         .then(//call then instead of subscribe to form the promise chain.
      //         data => {
      //             resolve(data);
      //         },
      //         err => {
      //             reject(err);
      //         });
      // });
      //console.log("1 ");
      return new Promise((resolve, reject) => {

         this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
            console.log(" Current Geo " + JSON.stringify(resp.coords));
            this.currentGeoModel.lat = resp.coords.latitude;
            this.currentGeoModel.lng = resp.coords.longitude;

            console.log("22 " + JSON.stringify(this.currentGeoModel));
            resolve(this.currentGeoModel);

         }).catch((error) => {
            reject(error);
         });

      });
   }

   getDistanceBetweenPoints(start, end, units) {

      let earthRadius = {
         miles: 3958.8,
         km: 6371
      };

      let R = earthRadius[units || 'miles'];
      let lat1 = start.lat;
      let lon1 = start.lng;
      let lat2 = end.lat;
      let lon2 = end.lng;

      let dLat = this.toRad((lat2 - lat1));
      let dLon = this.toRad((lon2 - lon1));
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = R * c;

      return
   }

   toRad(x) {
      return x * Math.PI / 180;
   }
}