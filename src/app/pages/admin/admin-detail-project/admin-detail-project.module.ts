import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminDetailProjectPage } from './admin-detail-project.page';

const routes: Routes = [
  {
    path: '',
    component: AdminDetailProjectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminDetailProjectPage]
})
export class AdminDetailProjectPageModule {}
