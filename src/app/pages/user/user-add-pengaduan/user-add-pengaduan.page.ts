import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import { Storage } from '@ionic/storage';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-user-add-pengaduan',
  templateUrl: './user-add-pengaduan.page.html',
  styleUrls: ['./user-add-pengaduan.page.scss'],
})
export class UserAddPengaduanPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  lat: any;
  lng: any;
  loading: any;
  address: any;
  user: any;
  kategori: any;
  subkategori: any;
  hide_identity: boolean = false;
  hide_report: boolean = false;
  pengaduan: any = {};
  token:any;

  constructor( private alert : AlertService,
               private http: HttpClient,
               private env: EnvService,
               private navCtrl: NavController,
               private storage: Storage,
               private geolocation: Geolocation,
               public plt: Platform,
               public googleMaps: GoogleMaps,
               private loadingCtrl: LoadingController,
               public zone: NgZone,
               private authService: AuthService,
               private router: Router) { 

              this.geocoder = new google.maps.Geocoder;
              let elem = document.createElement("div")
              this.GooglePlaces = new google.maps.places.PlacesService(elem);
              this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
              this.autocomplete = {
                input: ''
              };
              this.autocompleteItems = [];
              this.markers = [];
              this.loading = this.loadingCtrl.create();
              this.tryGeolocation();
              this.map = null;
              this.pengaduan.address = this.address;
              }


  async ngOnInit() {
    this.storage.get('user')
    .then(user => {
      this.user = user;
      let headers = new HttpHeaders({
        'Authorization': 'Bearer '+ this.user.user.api_token
      });

      this.http.get(this.env.API_URL+ 'ref/kategori-pengaduan', {headers: headers})
      .subscribe(data => {
        console.log(data['data']);
        this.kategori = data['data'];
      })

    });

    this.initMap();

  }

  onChange($event){
    console.log($event.target.value);
    let headers = new HttpHeaders({
      'Authorization': 'Bearer '+ this.user.user.api_token
    });
    
    this.http.get(this.env.API_URL+ 'ref/sub-kategori-pengaduan?kategori_id='+$event.target.value, {headers: headers})
    .subscribe(data => {
      this.subkategori = data['data'];
    });
  }

  async initMap(){
    let latLng = new google.maps.LatLng(-8.6027717, 115.1764153);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  tryGeolocation(){
    this.clearMarkers();//remove previous markers

    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!',
        draggable: true
      });

      this.markers.push(marker);
      this.map.setCenter(pos);
      this.getMarkerPosition(pos);
      this.addMarker(pos);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);  
            });
          });
        }
    });
  }

  async selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          animation: google.maps.Animation.DROP,
          draggable: true
        })
        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);
        this.getMarkerPosition(results[0].geometry.location);
        this.addMarker(results[0].geometry.location);
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
      }
    })

  }

  addMarker(latLng){
    this.clearMarkers();
      let marker = new google.maps.Marker({
        map: this.map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        position: latLng
      })
      this.markers.push(marker);
      google.maps.event.addListener(marker, 'dragend', () => {
        this.getMarkerPosition(marker.getPosition());
        this.lat = marker.getPosition().lat();
        this.lng = marker.getPosition().lng();
      });
    }
    
    getMarkerPosition(latlng){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({'latLng': latlng},(results, status)=> {
        this.address= results[0].formatted_address;
        console.log(this.address);
      })
    }    

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  hide_id(){
    if(this.pengaduan.hide_identity == true){
    this.alert.presentAlert('Rahasiakan Identitas', 'Dengan mengaktifkan fitur ini maka identitas anda akan di rahasiakan');
    }
  }

  hide_rp(){
    if(this.pengaduan.hide_report == true){
    this.alert.presentAlert('Rahasiakan Pengaduan', 'Dengan mengaktifkan fitur ini maka pengaduan anda akan di rahasiakan');
    }
  }

  submit(){
    // console.log(this.hide_identity, this.hide_report);
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'applicatiobn/json',
      'Authorization': 'Bearer '+ this.user.user.api_token
    });

    let data = {
      'user_id' : this.user.user.id,
      'atas_nama' : this.user.user.name,
      'subkategori_id': this.pengaduan.sub_kategori,
      'topik': this.pengaduan.topik,
      'uraian': this.pengaduan.uraian,
      'lat': this.lat,
      'lng': this.lng,
      'alamat': this.pengaduan.address,
      'hide_identitas': this.hide_identity,
      'hide_pengaduan': this.hide_report,
      'email': this.user.user.email
    };

    this.http.post(this.env.API_URL+ 'pengaduan/add', data, {headers: headers})
    .subscribe(data => {
      console.log(data);
      if(data['success']){
        this.alert.presentAlert('Success', 'Pengaduan Berhasil Disimpan');
        this.router.navigate(['/menu/user-upload-file', data['data']['id']]);
      }
    }, err => {
      console.log(err);
    });
  }

}
