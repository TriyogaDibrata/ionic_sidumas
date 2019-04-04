import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-user-upload-file',
  templateUrl: './user-upload-file.page.html',
  styleUrls: ['./user-upload-file.page.scss'],
})
export class UserUploadFilePage implements OnInit {

  id_pengaduan: any;

  public photos: any;
  public base64Image: string;

  constructor(private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.id_pengaduan = this.route.snapshot.paramMap.get('id');
    console.log(this.id_pengaduan);
    this.photos = [];
  }

  async deletePhoto(index) {
    const confirm = await this.alertCtrl.create({
      header: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    await confirm.present();
  }

  async selectPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Upload Gambar',
      buttons: [{
        text: 'Pilih Dari Gallery',
        icon: 'photos',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Ambil Gamber',
        icon: 'camera',
        handler: () => {
          this.takePhoto(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  takePhoto(sourceType) {
    const options: CameraOptions = {
      quality: 100, // picture quality
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      sourceType: sourceType,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }


}
