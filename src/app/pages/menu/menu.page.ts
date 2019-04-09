import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonApp, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  username = '';
  pages = [];
  extras = [];

  @ViewChild(NavController) nav: NavController;

  selectedPath = '';
  user: any;
  constructor(private navCtrl: NavController,
    private authService: AuthService,
    private appCtrl: IonApp,
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController,
    private callNumber: CallNumber) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    })
  }

  ngOnInit() {
    this.storage.get('user')
      .then(user => {
        this.user = user['user'];
        console.log(this.user);
      });
  }

  ionViewWillEnter() {
    if (this.authService.isAdmin()) {
      this.pages = [
        { title: 'Pengaduan Baru', page: '/menu/admin-home', icon: 'home', color: 'none' },
        { title: 'Semua Pengaduan', page: '/menu/admin-project-pengaduan', icon: 'planet', color: 'none' },
        { title: 'Profile', page: '/menu/admin-profile', icon: 'person', color: 'none' }
      ];
      this.navCtrl.navigateRoot('/menu/admin-home');
    } else {
      this.pages = [
        { title: 'Beranda', page: '/menu/user-home', icon: 'home', color: 'none' },
        { title: 'Pengaduan saya', page: '/menu/user-pengaduan-saya', icon: 'planet', color: 'none' },
        { title: 'Kelola Profile', page: '/menu/user-profile', icon: 'person', color: 'none' }
      ];

      this.extras = [
        { title: 'Layanan Gawat Darurat 112', icon: 'call', funcion: 'emergencyCall()' }
      ]
      this.navCtrl.navigateRoot('/menu/user-home');
    }
    this.username = this.authService.currentUser.name;
  }

  openPage(page) {
    this.navCtrl.navigateRoot(page.page);
  }

  async emergencyCall() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi!',
      message: 'Anda akan membuat panggilan ke layanan gawat darurat ?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Iya',
          handler: () => {
            this.call112();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  call112() {
    this.callNumber.callNumber("112", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi!',
      message: 'Apakah anda yakin untuk keluar ?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Iya',
          handler: () => {
            this.storage.remove('user')
              .then(() => {
                this.navCtrl.navigateRoot('login');
              });
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  checkActivePage(page) {
  }
}
