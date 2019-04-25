import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController, LoadingController } from '@ionic/angular';
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

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
})
export class AdminHomePage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';
  user: any;
  pengaduan: any;
  token: any;

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
    private loading: LoadingController,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getPengaduan();
    this.menuCtrl.enable(true);
  }

  public showSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.pengaduan.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async getPengaduan(infiniteScroll?) {

    const loading = await this.loading.create({
      spinner: "bubbles",
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });

    loading.present();

    this.storage.get('user')
      .then(user => {
        this.user = user.user;
        let headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.user.api_token,
          'Accept': 'application/json'
        });

        this.http.get(this.env.API_URL + 'pengaduan/listopd?opd_id='+this.user.opd_id+'&limit=' + this.limit, { headers: headers })
          .subscribe(data => {
            console.log(data['data']);
            this.pengaduan = data['data'];
            loading.dismiss();
            if (infiniteScroll) {
              infiniteScroll.target.complete();
            }
          }, err => {
            console.log(err);
            loading.dismiss();
          })
      })
  }

  loadMore(infiniteScroll) {
    this.limit = this.pengaduan.length + 5;
    this.getPengaduan(infiniteScroll);

    if (this.limit === this.pengaduan.length) {
      infiniteScroll.enable(false);
    }
  }

  doRefresh(event) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.user.api_token,
      'Accept': 'application/json'
    });

    this.http.get(this.env.API_URL + 'pengaduan/listopd?opd_id='+this.user.opd_id+'&limit=' + this.limit, { headers: headers })
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
    this.navCtrl.navigateForward(['/menu/admin-detail-pengaduan', id]);
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

  async refreshPage(){
    this.getPengaduan();
  }

}

