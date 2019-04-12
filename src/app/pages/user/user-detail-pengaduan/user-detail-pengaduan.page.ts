import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterContentInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { EnvService } from 'src/app/providers/env/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-user-detail-pengaduan',
  templateUrl: './user-detail-pengaduan.page.html',
  styleUrls: ['./user-detail-pengaduan.page.scss'],
})
export class UserDetailPengaduanPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any;
  my_loc: any;

  id_pengaduan: any;
  user: any;
  token: any;
  pengaduan: any;
  files: any;
  tindaklanjut: any;
  comments: any;
  state: any;

  komentar: any;
  tanggapans: any;
  komentar_body: any;
  tindaklanjut_body: any;

  constructor(private alert: AlertService,
  private route: ActivatedRoute,
  private env: EnvService,
  private http: HttpClient,
  private authService: AuthService,
  private storage: Storage,
  private loadingCtrl: LoadingController,
  private socialSharing: SocialSharing,
  private geoloc: Geolocation) { }

  ngOnInit() {
    this.id_pengaduan = this.route.snapshot.paramMap.get('id'); 
  }


  ionViewWillEnter(){
    this.getDetail();
  }

  public showComments() {
    this.komentar_body = !this.komentar_body;
  }

  public showTl() {
    this.tindaklanjut_body = !this.tindaklanjut_body;
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
        this.files = data['data']['files'];
        this.initMap();
        loading.dismiss();
      }, err => {
        console.log(err);
      })

      this.http.get(this.env.API_URL+ 'pengaduan/komentar?pengaduan_id='+this.id_pengaduan, {headers: headers})
      .subscribe( res => {
        console.log(res['data']);
        this.comments = res['data'];
        loading.dismiss();
      }, err => {
        console.log(err);
      })

      this.http.get(this.env.API_URL+ 'pengaduan/tindaklanjut?pengaduan_id='+this.id_pengaduan, {headers: headers})
      .subscribe( item => {
        console.log(item['data']);
        this.tanggapans = item['data'];
        loading.dismiss();
      }, err => {
        console.log(err);
      })

    })
  }

  myLocation(){
    this.geoloc.watchPosition()
    .subscribe((resp) => {
      this.my_loc = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
    })
  }

  async initMap(){
    let latLng = new google.maps.LatLng(this.pengaduan.koordinat_lat, this.pengaduan.koordinat_lng);

    let mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: false,
      scaleControl: false,
      zoomControl: false
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let infowindow = new google.maps.InfoWindow({
      content: "<a href='https://www.google.com/maps?saddr="+this.my_loc+"&daddr="+latLng+"' target='_blank'>"+this.pengaduan.alamat+"</a>"
    });

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
    })

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    });
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  async presentLoading(loading){
    return await loading.present();
  }

  addKomentar(){
    // console.log(this.id_pengaduan, this.token.user.id, this.token.user.api_token);
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'applicatiobn/json',
      'Authorization': 'Bearer '+ this.token.user.api_token
    });

    let data = {
      'user_id' : this.token.user.id,
      'pengaduan_id': this.id_pengaduan,
      'komentar': this.komentar
    };

    this.http.post(this.env.API_URL+ 'pengaduan/add-komentar', data, {headers: headers})
    .subscribe(data => {
      console.log(data);
      if(data['success']){
        this.alert.presentToast(data['message']);
        this.komentar = "";
        this.ionViewWillEnter();
      } else {
        this.alert.presentToast(data['message']);
      }
    }, err => {
      console.log(err);
    });
  }

  addVote() {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'applicatiobn/json',
      'Authorization': 'Bearer ' + this.token.user.api_token
    });

    let data = {
      'user_id': this.token.user.id,
      'pengaduan_id': this.id_pengaduan,
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

}
