import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserAddPengaduanPage } from './user-add-pengaduan.page';

const routes: Routes = [
  {
    path: '',
    component: UserAddPengaduanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserAddPengaduanPage]
})
export class UserAddPengaduanPageModule {}
