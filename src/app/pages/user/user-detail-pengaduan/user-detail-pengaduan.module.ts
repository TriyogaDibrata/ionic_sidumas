import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserDetailPengaduanPage } from './user-detail-pengaduan.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailPengaduanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserDetailPengaduanPage]
})
export class UserDetailPengaduanPageModule {}
