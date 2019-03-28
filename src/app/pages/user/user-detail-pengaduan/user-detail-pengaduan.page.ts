import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { EnvService } from 'src/app/providers/env/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-detail-pengaduan',
  templateUrl: './user-detail-pengaduan.page.html',
  styleUrls: ['./user-detail-pengaduan.page.scss'],
})
export class UserDetailPengaduanPage implements OnInit {

  id_pengaduan: any;
  user: any;
  token: any;
  pengaduan: any;
  files: any;
  tindaklanjut: any;
  state: any;

  constructor(private alert: AlertService,
  private route: ActivatedRoute,
  private env: EnvService,
  private http: HttpClient,
  private authService: AuthService,
  private storage: Storage,
  private loadingCtrl: LoadingController,) { }

  ngOnInit() {
    this.id_pengaduan = this.route.snapshot.paramMap.get('id'); 
    this.getDetail();
  }


  ionViewWillEnter(){

  }

  async getDetail(){
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.storage.get('user')
    .then(token => {
      this.token = token;
      
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.token.user.api_token
      })

      this.http.get(this.env.API_URL+ 'pengaduan/detail?pengaduan_id='+this.id_pengaduan, {headers: headers})
      .subscribe( data => {
        console.log(data['data']);
        this.pengaduan = data['data'];
        this.user = data['data']['has_user'][0];
        this.files = data['data']['files'];
        this.tindaklanjut = data['data']['tanggapans'];
        loading.dismiss();
      })

    })
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  async presentLoading(loading){
    return await loading.present();
  }

}
