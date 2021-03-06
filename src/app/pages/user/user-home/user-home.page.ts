import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { NotificationsComponent } from '../../../components/notifications/notifications.component'
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { IonContent } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PopmenuComponent } from '../../../components/popmenu/popmenu.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  user: any;
  pengaduan: any;
  token: any;
  notif: any;
  reachBottom: boolean = false;

  limit = 5;
  offset = 0;

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
    private alert: AlertService,
    private socialSharing: SocialSharing,
    private platform: Platform,
  ) { 
  }

  ngOnInit() {
    this.menuCtrl.enable(true);
    this.getNotif();
  }

  ionViewWillEnter() {
    this.platform.ready()
    .then(()=> {
      this.getPengaduan();
    })
  }

  public showSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  getPengaduan(infiniteScroll?) {
    this.storage.get('user')
      .then(user => {
        this.user = user.user;
        let headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.user.api_token,
          'Accept': 'application/json'
        });

        this.http.get(this.env.API_URL + 'pengaduan/list?limit=' + this.limit, { headers: headers })
          .subscribe(data => {
            console.log(data['data']);
            this.pengaduan = data['data'];
            if (infiniteScroll) {
              infiniteScroll.target.complete();
            }
          }, err => {
            this.alertServie.presentAlert('Message', 'Cant Load Data')
          })
      })
  }

  loadMore(infiniteScroll) {
    this.limit = this.pengaduan.length + 5;
    this.getPengaduan(infiniteScroll);

    if (this.limit == this.pengaduan.length) {
      infiniteScroll.enable(false);
      this.infiniteScroll.disabled;
      this.reachBottom = true;
    }
  }

  doRefresh(event) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.user.api_token,
      'Accept': 'application/json'
    });

    this.http.get(this.env.API_URL + 'pengaduan/list?limit=' + this.limit, { headers: headers })
      .subscribe(data => {
        console.log(data['data']);
        this.pengaduan = data['data'];
        event.target.complete();
      }, err => {
        console.log(err);
        event.target.complete();
      })
  }

  goToDetail(id) {
    this.navCtrl.navigateForward(['/menu/user-detail-pengaduan', id]);
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
      showBackdrop: true,
      cssClass: 'custom-popover'
    });
    return await popover.present();
  }

  toTop() {
    this.content.scrollToTop(1500);
  }

  addVote(pengaduan_id) {
    console.log(this.user.id, pengaduan_id);
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'applicatiobn/json',
      'Authorization': 'Bearer ' + this.user.api_token
    });

    let data = {
      'user_id': this.user.id,
      'pengaduan_id': pengaduan_id,
    };

    this.http.post(this.env.API_URL + 'pengaduan/add-vote', data, { headers: headers })
      .subscribe(data => {
        if (data['success']) {
          this.alert.presentToast(data['message']);
          this.ionViewWillEnter();
        } else {
          this.alert.presentToast(data['message']);
        }
      }, err => {
        console.log(err);
      });
  }

  share(id, topik) {
    this.socialSharing.share("Sistem Pengaduan Masyarakat Kabupaten Badung", topik, null, "sidumas.badungkab.go.id/pengaduan/get/"+id).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }

  getNotif(){
    this.storage.get('user')
    .then(data => {
      this.user = data['user'];

      let headers = new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'applicatiobn/json',
        'Authorization': 'Bearer ' + this.user.api_token
      });

      this.http.get(this.env.API_URL + 'pengaduan/notifikasi?user_id='+this.user.id+'&limit=5', {headers: headers})
      .subscribe(resp => {
        console.log(resp['data']);
        this.notif = resp['data'];
      })
    })
  }

}

