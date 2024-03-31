import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'table-content/:id',
    loadComponent: () => import('./content/table-content/table-content.page').then( m => m.TableContentPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'register-locatie/:value',
    loadComponent: () => import('./office/CRUD/suplier/suplier.page').then( m => m.SuplierPage),
  },
  {
    path: 'table-content-mobile/:id',
    loadChildren: () => import('./content/table-content-mobile/table-content-mobile.routes').then( m => m.routes)
  },
  {
    path: 'scan-qr',
    loadComponent: () => import('./modals/scan-qr/scan-qr.page').then( m => m.ScanQrPage)
  },
  {
    path: 'spinner',
    loadComponent: () => import('./modals/spinner/spinner.page').then( m => m.SpinnerPage)
  },
  {
    path: 'add-to-inventary',
    loadComponent: () => import('./modals/add-to-inventary/add-to-inventary.page').then( m => m.AddToInventaryPage)
  },


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
