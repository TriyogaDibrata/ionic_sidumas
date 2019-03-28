import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { EnvService } from '../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser : any = {};
  isLoggedIn = false;

  constructor( private http: HttpClient,
    private storage: Storage,
    private envService: EnvService) { 
      
  }

  login(email: String, password: String) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(this.envService.API_URL + 'login',
      {email: email, password: password}, {headers: headers}
    ).pipe(
      tap(user => {
        console.log(user);
        this.storage.set('user', user)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.currentUser = user;
        this.isLoggedIn = true;
        return user;
      }),
    );
  }

  socialMediaLogin(name: String, email: String, social_media: String, social_id: String, avatar: String) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(this.envService.API_URL + 'socialmedialogin',
      {name: name, email: email, social_media: social_media, social_id: social_id, avatar: avatar}, {headers: headers}
    ).pipe(
      tap(user => {
        console.log(user);
        this.storage.set('user', user)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.currentUser = user;
        this.isLoggedIn = true;
        return user;
      }),
    );
  }

  register(name: String, email: String, password: String, password_confirmation: String) {
    return this.http.post(this.envService.API_URL + 'register',
      {name: name, email: email, password: password, password_confirmation: password_confirmation}
    )
  }

  logout() {
    const headers = new HttpHeaders({
      'Authorization': this.currentUser["token_type"]+" "+this.currentUser.user["api_token"]
    });
    
    return this.http.get(this.envService.API_URL + 'logout', { headers: headers })
    .pipe(
      tap(data => {
        this.storage.remove("user");
        this.isLoggedIn = false;
        delete this.currentUser;
        return data;
      })
    )
  }

  isAdmin(){
    return this.currentUser.user.tipe == 1;
  }

  getToken() {
    return this.storage.get('user').then(
      data => {
        this.currentUser = data;
        if(this.currentUser != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.currentUser = null;
        this.isLoggedIn=false;
      }
    );
  }
  
  loginx (name: string, pw: string) : Promise<boolean> {
    return new Promise((resolve, reject ) => {
      if (name === 'admin' && pw === 'admin'){
        this.currentUser = {
          name: name,
          role: 0
        };
        resolve(true);
      } else if ( name  === 'user' && pw === 'user'){
        this.currentUser = {
          name : name,
          role: 1
        };
        resolve(true);
      } else {
        reject (false);
      }
    });
  }

  isLoggedInx(){
    return this.currentUser != null;
  }

  logoutx(){
    this.currentUser == null;
  }


}
