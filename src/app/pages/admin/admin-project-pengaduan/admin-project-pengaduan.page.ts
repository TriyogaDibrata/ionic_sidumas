import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from '@ionic/angular';
import { NotificationsComponent } from '../../../components/notifications/notifications.component'
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import * as moment from 'moment';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert/alert.service';

@Component({
  selector: 'app-admin-project-pengaduan',
  templateUrl: './admin-project-pengaduan.page.html',
  styleUrls: ['./admin-project-pengaduan.page.scss'],
})
export class AdminProjectPengaduanPage implements OnInit {

  user: any;
  pengaduan: any;
  token: any;


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
    this.getProject();
  }

  getProject() {
    this.storage.get('user')
      .then(user => {
        console.log(user.user.api_token);
        this.user = user.user;
        let headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.user.api_token,
          'Accept': 'application/json'
        });

        this.http.get(this.env.API_URL + 'pengaduan/listprojectppl?opd_id=' + this.user.opd_id, { headers: headers })
          .subscribe(data => {
            console.log(data['data']);
            return this.pengaduan = data['data'];
          })
      })
  }

}
