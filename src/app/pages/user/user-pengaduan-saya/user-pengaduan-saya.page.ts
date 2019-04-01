import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-pengaduan-saya',
  templateUrl: './user-pengaduan-saya.page.html',
  styleUrls: ['./user-pengaduan-saya.page.scss'],
})
export class UserPengaduanSayaPage implements OnInit {

  user: any;
  pengaduan: any;
  countList: any;

  constructor(private menuCtrl: MenuController,
    private authService: AuthService,
    private storage: Storage,
    private http: HttpClient,
    private env: EnvService,
    private router: Router) { }

  ngOnInit() {
    this.getUser();
  }

  ionViewWillEnter() {
  }

  getUser(){
    this.storage.get('user')
    .then(user => {
      this.user = user.user;
      this.getPengaduanSaya();
    })
  }

  getPengaduanSaya() {
    console.log(this.user);
    let headers = new HttpHeaders({
      Authorization: "Bearer " + this.user.api_token
    })

    this.http.get(this.env.API_URL + "pengaduan/listsaya?user_id=" + this.user.id, { headers: headers })
      .subscribe(data => {
        console.log(data);
        this.countList = data['count'];
        this.pengaduan = data['data'];
      }, err => {
        console.log(err);
      })
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  goToDetail(id) {
    this.router.navigate(['/menu/user-detail-pengaduan', id]);
  }

  doRefresh(event) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.user.api_token
    });

    this.http.get(this.env.API_URL + "pengaduan/listsaya?user_id=" + this.user.id, { headers: headers })
      .subscribe(data => {
        this.countList = data['count'];
        this.pengaduan = data['data'];
        event.target.complete();
      }, err => {
        console.log(err);
        event.target.complete();
      })
  }

}
