import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Storage } from '@ionic/storage';
import { EnvService } from '../../../providers/env/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResourceLoader } from '@angular/compiler';
import { AlertService } from '../../../providers/alert/alert.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  user: any = {};

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private storage: Storage,
    private env: EnvService,
    private http: HttpClient,
    private alert: AlertService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.storage.get('user')
    .then(user => {
      console.log(user.user);
      this.user = user.user;
    })
  }

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Your Data was Edited!',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

    });
  }

  updateUser(){
    let headers = new HttpHeaders({
      'Authorization': 'Bearer '+ this.user.api_token,
      'Accept': 'application/json',
    })

    this.http.post(this.env.API_URL+ 'pengaduan/update-user', this.user, {headers: headers})
    .subscribe(user => {
      if(user['success']){
        this.storage.set('user', user)
        .then(()=> {
          this.alert.presentToast('Data Berhasil Disimpan');
          this.ionViewWillEnter();
        });
      }
    }, err => {
      console.log(err);
    })
  }

}
