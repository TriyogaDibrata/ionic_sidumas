import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EnvService } from 'src/app/providers/env/env.service';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { AuthService } from 'src/app/providers/auth/auth.service';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  FB_APP_ID: number = 299977957296137;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private env: EnvService,
    private storage: Storage,
    private alertService: AlertService,
    private authService: AuthService,
    private fb: Facebook,
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    //Form validations
    this.onRegisterForm = this.formBuilder.group({
      'name': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      'password': [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      'cpassword': [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])]
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  //Register Process
  async register(form: FormGroup) {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.authService.register(form.value.name, form.value.email, form.value.password, form.value.cpassword).subscribe(
      data => {
        this.authService.login(form.value.email, form.value.password)
          .subscribe(data => {
            loading.dismiss();
          },
            error => {
              console.log(error);
            },
            () => {
              loading.dismiss();
              this.navCtrl.navigateRoot('menu');
            }
          );
        this.alertService.presentToast(data['message']);
      },
      error => {
        loading.dismiss();
        console.log(error);
        this.alertService.presentAlert('Register Failed', 'Cannot Store Data to Database')
      },
      () => {

      }
    );
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


  //Jump to login page
  goToLogin() {
    this.navCtrl.navigateRoot('login');
  }
}