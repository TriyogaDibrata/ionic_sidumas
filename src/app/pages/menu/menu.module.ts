import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'admin-home', loadChildren: '../admin/admin-home/admin-home.module#AdminHomePageModule' },
      { path: 'admin-profile', loadChildren: '../admin/admin-profile/admin-profile.module#AdminProfilePageModule' },
      //userpage
      { path: 'user-home', loadChildren: '../user/user-home/user-home.module#UserHomePageModule' },
      { path: 'user-profile', loadChildren: '../user/user-profile/user-profile.module#UserProfilePageModule' },
      { path: 'user-detail-pengaduan/:id', loadChildren: '../user/user-detail-pengaduan/user-detail-pengaduan.module#UserDetailPengaduanPageModule' },
      { path: 'user-add-pengaduan', loadChildren: '../user/user-add-pengaduan/user-add-pengaduan.module#UserAddPengaduanPageModule' },
      { path: 'user-pengaduan-saya', loadChildren: '../user/user-pengaduan-saya/user-pengaduan-saya.module#UserPengaduanSayaPageModule' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
