import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ToastController, ModalController, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/Camera';
import { VehiclsProvider } from '../../providers/Map/vechilsApi';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HttpClient } from '@angular/common/http';
import { Storage } from "@ionic/storage";
// import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AlertsProvider } from '../../providers/generic/AlertsProvider';
// import { FilePath } from '@ionic-native/file-path';
// import { FilePath } from '@ionic-native/file-path/ngx';
// import { File, FileEntry } from '@ionic-native/File/ngx';
// import { HttpClient } from '@angular/common/http';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { Storage } from '@ionic/storage';
// import { Diagnostic } from '@ionic-native/diagnostic';
/**
 * Generated class for the SettingsrabbitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settingsrabbit',
  templateUrl: 'settingsrabbit.html',
})
export class SettingsrabbitPage implements OnInit {

  token:any;
  constructor(
    public _alerts: AlertsProvider,
    private storage: Storage,
    public http: HttpClient,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private filePath: FilePath,
    // private plt: Platform,
    // private storage: Storage,
    // private file: File,
    // private modalCtrl: ModalController,
    public _VehiclsProvider: VehiclsProvider,
    public events: Events,
    //  public toastCtrl: ToastController,
    // private webview: WebView, private diagnostic: Diagnostic,
    // private toastController: ToastController, private ref: ChangeDetectorRef,
    public navCtrl: NavController, public navParams: NavParams) {
    //this.transfer = new FileTransfer();


    this.storage.get('UserState').then(user => {
      if (user != undefined && user != "") {
        this.token=user.tocken;
console.log("at ssssetting     ttt    "  + this.token)
        this.events.publish('user:created', user);
      } else {
          this.events.publish("unauthorized:requestError");
      }
  });

  }

  ionViewDidLoad() {
  }

  images = [];
  ngOnInit() {
    // let formData: FormData = new FormData();

    // //  headers.set('Content-Type','multipart/form-data');



    // formData.append('image', '/assets/imgs/logo-green.png', "Name");
    // // let base64Image = 'data:image/jpeg;base64,' + 'assets/imgs/logo-green.png';

    // this._VehiclsProvider.uploadPic(formData).subscribe(returnData => {

    // });

    // this.plt.ready().then(() => {
    //   this.loadStoredImages();
    // });
  }
  imageURI: any;
  imageFileName: any;
  imageTitle: any;
  isImageSelected: boolean = false;
  chooseFile() {
    let options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };


    this.camera.getPicture(options).then((img) => {
      this.imageURI = img;
      this.isImageSelected = true;
    }).catch((reason) => {
      console.log(reason);
    });
  }
  doImageUpload() {

    let filename = this.imageURI.split('/').pop();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      params: { 'title': this.imageTitle }
    };

    fileTransfer.upload(this.imageURI, 'http://192.168.43.198:5000/api/Vehicles/UploadFile', options).then((res) => {


    }, (err) => {

    });

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetController.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
          //          icon: '../assets/imgs/guy.png'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      //correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      let base64Image = imagePath;//'data:image/jpeg;base64,' +
      console.log(imagePath)
      this.storage.get('UserState').then(user => {
        console.log(user.tocken)


        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //this.copyFileToLocalDir(imagePath);

        this._alerts.showLoader();
        // new one
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: 'file',
          chunkedMode: false,
          mimeType: 'mutipart/form-data',
          // mimeType: "image/jpeg",
          headers: { Connection: "close" ,
          'Authorization': 'Bearer ' + this.token
        },
          params: { 'title': "file" }
        }

        fileTransfer.upload(encodeURI(imagePath), encodeURI('https://rabbit-app.com/api/Vehicles/UploadFile'), options)
          //        fileTransfer.upload(encodeURI(imagePath), encodeURI('http://192.168.43.198:5000/api/FlyAuth/upload'), options)
          // fileTransfer.upload(imagePath, encodeURI('http://192.168.43.198:5001/api/Vehicles/UploadFile'), options)
          .then((data) => {
            this._alerts.hideLoader();
            this._alerts.showWarningToaster("Uploaded Successfully");
            
          }, (err) => {
            this._alerts.hideLoader();
            this._alerts.showWarningToaster("Uploaded Successfully");
            console.log(err);
          });
        //end 

        // this._VehiclsProvider.uploadPic(base64Image, user.tocken).subscribe(returnData => {

        this.camera.cleanup();
        // });
      });
      //console.log(base64Image);


      // let url = `${apiConfig.apiUrl}/Vehicles/UploadId`;

      // var options: FileUploadOptions = {
      //   fileKey: 'image',
      //   chunkedMode: false,
      //   mimeType: 'mutipart/form-data',
      // };

      // const FileTransfer = this.transfer.create();

      // FileTransfer.upload(imagePath, url, options).then(x => {
      //   console.log(x.response);
      // });


      //  let modal = this.modalCtrl.create('UploadModalPage', { data: imagePath });
      // modal.present();
      // modal.onDidDismiss(data => {
      // //   if (data && data.res) {

      // //     let headers: Headers = new Headers();
      // //     var body = {
      // //       profile_picture: data.url
      // //     };
      // //     headers.append('x-auth-token', this.token);
      // //     this.http.put('https://zappbackendservice.herokuapp.com/upload_picture', body, {headers: headers})
      // //     .subscribe(res => {
      // //       this.ionViewDidLoad();
      //      });

      //   }
      // });


    });
  }


  copyFileToLocalDir(namePath) {
    this.filePath.resolveNativePath(namePath).then(x => {

      console.log("ssssssssssssssssssss " + x)
    });

  }
  // getImage() {
  //   this.plt.ready().then(() => {

  //     this.diagnostic.requestCameraAuthorization()
  //       .then((state) => {

  //         const options: CameraOptions = {
  //           quality: 100,
  //           destinationType: this.camera.DestinationType.FILE_URI,
  //           saveToPhotoAlbum: false,
  //           correctOrientation: true,
  //           encodingType: this.camera.EncodingType.JPEG,
  //           mediaType: this.camera.MediaType.PICTURE,
  //           sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //         }

  //         this.camera.getPicture(options).then((imageData) => {
  //           this.imageURI = imageData;
  //         }, (err) => {
  //           console.log(err);
  //           this.presentToast(err);
  //         });


  //       });
  //   });

  // }

  uploadFile() {
    // let loader = this.loadingCtrl.create({
    //   content: "Uploading..."
    // });
    // loader.present();
    // const fileTransfer: FileTransferObject = this.transfer.create();

    // let options: FileUploadOptions = {
    //   fileKey: 'ionicfile',
    //   fileName: 'ionicfile',
    //   chunkedMode: false,
    //   mimeType: "image/jpeg",
    //   headers: {}
    // }

    // fileTransfer.upload(this.imageURI, 'http://192.168.0.7:8080/api/uploadImage', options)
    //   .then((data) => {
    //   console.log(data+" Uploaded Successfully");
    //   this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
    //   loader.dismiss();
    //   this.presentToast("Image uploaded successfully");
    // }, (err) => {
    //   console.log(err);
    //   loader.dismiss();
    //   this.presentToast(err);
    // });
  }

  // presentToast(msg) {
  //   let toast = this.toastCtrl.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'bottom'
  //   });

  //   toast.onDidDismiss(() => {
  //     console.log('Dismissed toast');
  //   });

  //   toast.present();
  // }

  //   loadStoredImages() {
  //     this.storage.get("imagesS").then(images => {
  //       if (images) {
  //         let arr = JSON.parse(images);
  //         this.images = [];
  //         for (let img of arr) {
  //          let filePath = this.file.dataDirectory + img;
  //          let resPath = this.pathForImage(filePath);
  //           this.images.push({ name: img, path: resPath, filePath: filePath });
  //         }
  //       }
  //     });
  //   }

  //   pathForImage(img) {
  //     if (img === null) {
  //       return '';
  //     } else {
  //       let converted = this.webview.convertFileSrc(img);
  //       return converted;
  //     }
  //   }

  //   async presentToast(text) {
  //     const toast = await this.toastController.create({
  //         message: text,
  //         position: 'bottom',
  //         duration: 3000
  //     });
  //     toast.present();
  //   }

  //   async selectImage() {
  //     const actionSheet = await this.actionSheetController.create({
  //       title: "Select Image source",
  //       buttons: [{
  //         text: 'Load from Library',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //         }
  //       },
  //       {
  //         text: 'Use Camera',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.CAMERA);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //       ]
  //     });
  //     await actionSheet.present();
  //   }

  //   takePicture(sourceType: PictureSourceType) {
  //     var options: CameraOptions = {
  //       quality: 100,
  //       sourceType: sourceType,
  //       saveToPhotoAlbum: false,
  //       correctOrientation: true
  //     };

  //     this.camera.getPicture(options).then(imagePath => {
  //       if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  //         this.filePath.resolveNativePath(imagePath)
  //           .then(filePath => {
  //             let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //             let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
  //             this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //           });
  //       } else {
  //         var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
  //         var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
  //         this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //       }
  //     });

  //   }

  //   createFileName() {
  //     var d = new Date(),
  //         n = d.getTime(),
  //         newFileName = n + ".jpg";
  //     return newFileName;
  // }

  // copyFileToLocalDir(namePath, currentName, newFileName) {
  //     this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
  //         this.updateStoredImages(newFileName);
  //     }, error => {
  //         this.presentToast('Error while storing file.');
  //     });
  // }

  // updateStoredImages(name) {
  //     this.storage.get("imagesS").then(images => {
  //         let arr = JSON.parse(images);
  //         if (!arr) {
  //             let newImages = [name];
  //             this.storage.set("imagesS", JSON.stringify(newImages));
  //         } else {
  //             arr.push(name);
  //             this.storage.set("imagesS", JSON.stringify(arr));
  //         }

  //         let filePath = this.file.dataDirectory + name;
  //         let resPath = this.pathForImage(filePath);

  //         let newEntry = {
  //             name: name,
  //             path: resPath,
  //             filePath: filePath
  //         };

  //         this.images = [newEntry, ...this.images];
  //         this.ref.detectChanges(); // trigger change detection cycle
  //     });
  // }

}
