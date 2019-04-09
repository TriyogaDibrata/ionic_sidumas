import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController, NavController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Router, ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { EnvService } from 'src/app/providers/env/env.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-admin-tindak-lanjut',
  templateUrl: './admin-tindak-lanjut.page.html',
  styleUrls: ['./admin-tindak-lanjut.page.scss'],
})
export class AdminTindakLanjutPage implements OnInit {

  id_pengaduan: any;
  user: any;

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
    private alertCtrl: AlertController,
    private alert: AlertService,
    private envService: EnvService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.id_pengaduan = this.route.snapshot.paramMap.get('id');
    console.log(this.id_pengaduan);
    this.getUser();
    this.photos = [];
  }

  getUser() {
    this.storage.get('user')
      .then(user => {
        console.log(user['user']);
        this.user = user['user'];
      })
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

  uploadImages() {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.user.api_token,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    let data = {
      'pengaduan_id': this.id_pengaduan,
      'files': this.photos
    }

    this.http.post(this.envService.API_URL + 'pengaduan/upload-files', data, { headers: headers })
      .subscribe(data => {
        console.log(JSON.stringify(data));
        this.alert.presentToast("Lampiran Berhasil Disimpan");
        this.navCtrl.navigateRoot('/menu/user-home');
      }, err => {
        console.log(err);
        this.alert.presentAlert('Gagal', "Lampiran gagal disimpan!");
      });
  }

}