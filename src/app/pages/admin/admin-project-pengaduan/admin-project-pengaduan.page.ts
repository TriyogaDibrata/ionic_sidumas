import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
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
  selector: 'app-admin-project-pengaduan',
  templateUrl: './admin-project-pengaduan.page.html',
  styleUrls: ['./admin-project-pengaduan.page.scss'],
})
export class AdminProjectPengaduanPage implements OnInit {

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
  project: any;

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
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getProject();
    this.menuCtrl.enable(true);
  }

  getProject() {
    this.storage.get('user')
      .then(user => {
        this.user = user.user;
        let headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.user.api_token,
          'Accept': 'application/json'
        });

        this.http.get(this.env.API_URL + 'pengaduan/projectppl?opd_id=' + this.user.opd_id + '&limit=' + this.limit, { headers: headers })
          .subscribe(data => {
            console.log(data['data']);
            this.project = data['data'];
          })
      })
  }

  detailProject(id) {
    this.navCtrl.navigateForward(['/menu/admin-detail-project', id]);
  }
}