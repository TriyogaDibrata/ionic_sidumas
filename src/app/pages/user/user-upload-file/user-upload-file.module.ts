import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserUploadFilePage } from './user-upload-file.page';

const routes: Routes = [
  {
    path: '',
    component: UserUploadFilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserUploadFilePage]
})
export class UserUploadFilePageModule {}
