import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonApp } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  username = '';
  pages = [];

  @ViewChild(NavController) nav: NavController;

  selectedPath = '';
  user : any;

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private appCtrl: IonApp,
              private router: Router,
              private storage: Storage) 
  { 
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

  ionViewWillEnter(){
    if (this.authService.isAdmin()) {
      this.pages = [
        {title: 'Pengaduan Baru', page: '/menu/admin-home', icon: 'home'},
        {title: 'Project Pengaduan', page: '/menu/admin-project-pengaduan', icon: ''},
        {title: 'Profile', page: '/menu/admin-profile', icon: 'person'}
      ];
      this.navCtrl.navigateRoot('/menu/admin-home');
    }else {
      this.pages = [
        {title: 'Beranda', page: '/menu/user-home', icon: 'home', color: 'danger'},
        {title: 'Pengaduan saya', page: '/menu/user-pengaduan-saya', icon: 'planet', color: 'danger'},
        {title: 'Profile', page: '/menu/user-profile', icon: 'person', color: 'danger'}
      ];
      this.navCtrl.navigateRoot('/menu/user-home');
    }
    this.username = this.authService.currentUser.name;
  }

  openPage(page){
    this.navCtrl.navigateRoot(page);
  }

  logout(){
    this.storage.remove('user')
    .then(()=> {
      this.navCtrl.navigateRoot('login');
    });
  }

  // ionViewCanEnter(){
  //   return this.authService.isLoggedIn();
  // }
}
