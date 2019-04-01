import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  user: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get('user')
    .then(user => {
      this.user = user.user;
    })
  }

  ionViewWillEnter() {
    
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
      this.navCtrl.navigateForward('/home-results');
    });
  }

}
