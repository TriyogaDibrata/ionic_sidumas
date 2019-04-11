import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { AuthGuard } from 'src/app/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'admin-home',
        loadChildren: '../admin/admin-home/admin-home.module#AdminHomePageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'admin-profile',
        loadChildren: '../admin/admin-profile/admin-profile.module#AdminProfilePageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'admin-detail-pengaduan/:id',
        loadChildren: '../admin/admin-detail-pengaduan/admin-detail-pengaduan.module#AdminDetailPengaduanPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'admin-project-pengaduan',
        loadChildren: '../admin/admin-project-pengaduan/admin-project-pengaduan.module#AdminProjectPengaduanPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      { path: 'admin-detail-project/:id', 
        loadChildren: '../admin/admin-detail-project/admin-detail-project.module#AdminDetailProjectPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'admin-tindak-lanjut/:id',
        loadChildren: '../admin/admin-tindak-lanjut/admin-tindak-lanjut.module#AdminTindakLanjutPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      //userpage
      {
        path: 'user-home',
        loadChildren: '../user/user-home/user-home.module#UserHomePageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'user-profile',
        loadChildren: '../user/user-profile/user-profile.module#UserProfilePageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'user-detail-pengaduan/:id',
        loadChildren: '../user/user-detail-pengaduan/user-detail-pengaduan.module#UserDetailPengaduanPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'user-add-pengaduan',
        loadChildren: '../user/user-add-pengaduan/user-add-pengaduan.module#UserAddPengaduanPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'user-pengaduan-saya',
        loadChildren: '../user/user-pengaduan-saya/user-pengaduan-saya.module#UserPengaduanSayaPageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'user-upload-file/:id',
        loadChildren: '../user/user-upload-file/user-upload-file.module#UserUploadFilePageModule',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },
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
export class MenuPageModule { }
