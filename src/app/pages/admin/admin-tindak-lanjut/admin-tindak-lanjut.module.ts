import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminTindakLanjutPage } from './admin-tindak-lanjut.page';

const routes: Routes = [
  {
    path: '',
    component: AdminTindakLanjutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminTindakLanjutPage]
})
export class AdminTindakLanjutPageModule {}
