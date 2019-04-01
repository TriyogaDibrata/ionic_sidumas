import { Component, OnInit } from '@angular/core';
import {NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
import { NotificationsComponent } from '../../../components/notifications/notifications.component'
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert/alert.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  user : any;
  pengaduan: any;
  token: any;
  
  showSearchBar: boolean = false;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertServie: AlertService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private http: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getPengaduan();
  }

  public showSearch() {

    this.showSearchBar = !this.showSearchBar;
  }

  getPengaduan(){
    this.storage.get('user')
    .then(user => {
      console.log(user.user.api_token);
      this.user = user.user;
      let headers = new HttpHeaders({
        'Authorization': 'Bearer '+ this.user.api_token,
        'Accept': 'application/json'
      });
  
      this.http.get(this.env.API_URL+ 'pengaduan/list', {headers: headers})
      .subscribe(data =>{
        console.log(data['data']);
        return this.pengaduan = data['data'];
      })
    })
  }

  doRefresh(event) {
    this.getPengaduan();
    event.target.complete();
  }

  goToDetail(id){
    this.router.navigate(['/menu/user-detail-pengaduan', id]);
  }

  ionViewWillEnter(){
  this.menuCtrl.enable(true);
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  settings() {
    this.navCtrl.navigateForward('settings');
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

}

