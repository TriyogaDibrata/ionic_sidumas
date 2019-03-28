import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor( private toastCtrl: ToastController,
              private alertCtrl: AlertController) { }

  //Toast Alert
  async presentToast(message: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'dark'
    });
    toast.present();
  }

  async presentAlert(header: string, message: any) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}