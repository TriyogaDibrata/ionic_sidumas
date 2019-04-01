import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDetailPengaduanPage } from './admin-detail-pengaduan.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDetailPengaduanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDetailPengaduanPage]
})
export class AdminDetailPengaduanPageModule {}
