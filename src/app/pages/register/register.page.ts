import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { EnvService } from 'src/app/providers/env/env.service';
import { AlertService } from 'src/app/providers/alert/alert.service';
import { AuthService } from 'src/app/providers/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

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


  //Jump to login page
  goToLogin() {
    this.navCtrl.navigateRoot('login');
  }
}