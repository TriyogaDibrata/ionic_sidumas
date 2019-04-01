import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from 'src/app/providers/env/env.service';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public onLoginForm: FormGroup;

  FB_APP_ID: number = 299977957296137;

  constructor(public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storage: Storage,
    private http: HttpClient,
    private envService: EnvService,
    private alertService: AlertService,
    private fb: Facebook,
    private googlePlus: GooglePlus,
  ) { }

  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      'password': [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.authService.getToken().then(data => {
      console.log(this.authService.isLoggedIn);
      if (this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot('menu');
      }
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async login(form: FormGroup) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.authService.login(form.value.email, form.value.password)
      .subscribe(data => {
        console.log(data['success']);
        if (data['success']) {
          this.navCtrl.navigateRoot('menu');
          loading.dismiss();
        }
      }, err => {
        console.error(err);
        this.alertService.presentAlert('Login Failed', 'Please Check Your Credentials');
        loading.dismiss();
      });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  //Jump to register page
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  // async googleLogin(){
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Please wait...'
  //   });
  //   this.presentLoading(loading);
  //   this.googlePlus.login({
  //     'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
  //     'webClientId': "401245627689-4ceut94d75nmslud8un0lafphp6mm6ph.apps.googleusercontent.com", // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
  //     'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
  //     })
  //     .then(user => {
  //       console.log(user);
  //     })
  // }

  googleLogin() {
    this.googlePlus.login({
      'webClientId' : '233891482843-8loh9klg8ginehhhrpch7i0pi47q21ci.apps.googleusercontent.com'
    })
      .then(res => {
        console.log(res);
      });
    }
     
  


  async fbLogin() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    // let permissions = new Array<string>();

    //the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
      .then(response => {
        let userId = response.authResponse.userID;

        //Getting name and gender properties
        this.fb.api("/me?fields=name,email", permissions)
          .then(user => {
            // return console.log(user.email);
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            let sm_type = 'facebook';

            this.authService.socialMediaLogin(user.name, user.email, sm_type, user.id, user.picture)
              .subscribe(data => {
                console.log(data['success']);
                if (data['success']) {
                  this.alertService.presentToast('Login Success');
                  this.navCtrl.navigateRoot('menu');
                  loading.dismiss();
                }
              }, err => {
                console.error(err);
                this.alertService.presentAlert('Login Failed', 'Please Check Your Credentials');
                loading.dismiss();
              });

          }).catch(err => {
            console.log(err);
            this.alertService.presentToast('Failed to access facebook');
          })
      }, error => {
        console.log(error.message);
        loading.dismiss();
      });
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: JSON.stringify(msg),
      buttons: ['OK']
    });

    await alert.present();
  }

}
