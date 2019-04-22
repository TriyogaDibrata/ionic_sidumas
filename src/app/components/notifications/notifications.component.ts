import { Component, OnInit } from '@angular/core';
import { EnvService } from 'src/app/providers/env/env.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import * as moment from 'moment';
import { NavController, PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  user: any;
  notifications: any;

  constructor( private env: EnvService,
               private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController,
               private popover: PopoverController) { }

  ngOnInit() {
    this.getNotif();
  }

  getNotif(){
    this.storage.get('user')
    .then(data => {
      this.user = data['user'];

      let headers = {
        'Authorization': 'Bearer ' + this.user.api_token,
        'Accept': 'application/json'
      }

      this.http.get(this.env.API_URL + 'pengaduan/notifikasi?user_id='+this.user.id+'&limit=5', {headers: headers})
      .subscribe(resp => {
        console.log(resp['data']);
        this.notifications = resp['data'];
      })
    })
  }

  converTime(time) {
    moment.locale('id')
    let a = moment(time).fromNow();
    return a;
  }

  goToDetail(pengaduan_id){
    this.navCtrl.navigateForward(['/menu/user-detail-pengaduan', pengaduan_id]);
    this.popover.dismiss();
  }

}
