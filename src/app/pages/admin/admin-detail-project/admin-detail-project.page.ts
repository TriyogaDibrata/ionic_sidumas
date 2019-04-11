import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-admin-detail-project',
  templateUrl: './admin-detail-project.page.html',
  styleUrls: ['./admin-detail-project.page.scss'],
})
export class AdminDetailProjectPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  project_id: any;
  user: any;
  pengaduan: any;

  limit = 5;
  offset = 0;

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private http: HttpClient,
    private env: EnvService,
    private navCtrl: NavController,
    private alert: AlertService,
    private socialSharing: SocialSharing,
  ) { }

  ngOnInit() {
    this.project_id = this.route.snapshot.paramMap.get('id');
  }

  ionViewWillEnter(){
    this.getDetailProject();
  }

  getDetailProject(infiniteScroll?){
    this.storage.get('user')
    .then(user => {
     console.log('success');
     this.user = user['user'];

     let headers = {
       'Authorization': 'Bearer ' + this.user.api_token,
       'Accept': 'application/json'
     }
     
     this.http.get(this.env.API_URL +'pengaduan/detailproject?project_id='+this.project_id+'&limit=' + this.limit, {headers: headers})
     .subscribe(data => {
       console.log(data);
       this.pengaduan = data['data'];
       if (infiniteScroll) {
        infiniteScroll.target.complete();
      }
     }, err => {
       console.log(err);
     })

    }).catch(err => {
      console.log('Cant find user');
    })
  }

  loadMore(infiniteScroll) {
    this.limit = this.pengaduan.length + 5;
    this.getDetailProject(infiniteScroll);

    if (this.limit === this.pengaduan.length) {
      infiniteScroll.enable(false);
    }
  }

  doRefresh(event) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.user.api_token,
      'Accept': 'application/json'
    });

    this.http.get(this.env.API_URL +'pengaduan/detailproject?project_id='+this.project_id+'&limit=' + this.limit, { headers: headers })
      .subscribe(data => {
        console.log(data['data']);
        this.pengaduan = data['data'];
        event.target.complete();
      }, err => {
        console.log(err);
        event.target.complete();
      })
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  goToDetail(id) {
    this.navCtrl.navigateForward(['/menu/admin-detail-pengaduan', id]);
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

}
