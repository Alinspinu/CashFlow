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
  {
    path: 'user-display',
    loadComponent: () => import('./content/user-display/user-display.page').then( m => m.UserDisplayPage)
  },
  {
    path: 'tips',
    loadComponent: () => import('./content/user-display/tips/tips.page').then( m => m.TipsPage)
  },
  {
    path: 'meniu',
    loadComponent: () => import('./content/user-display/meniu/meniu.page').then( m => m.MeniuPage)
  },
  {
    path: 'bill',
    loadComponent: () => import('./content/user-display/bill/bill.page').then( m => m.BillPage)
  },
  {
    path: 'meniu',
    loadComponent: () => import('./content/order-content/meniu/meniu.page').then( m => m.MeniuPage)
  },
  {
    path: 'bill',
    loadComponent: () => import('./content/order-content/bill/bill.page').then( m => m.BillPage)
  },
  {
    path: 'order-content/:id',
    loadComponent: () => import('./content/order-content/order-content.page').then( m => m.OrderContentPage)
  },
  {
    path: 'bill',
    loadComponent: () => import('./content/order-content/bill/bill.page').then( m => m.BillPage)
  },
  {
    path: 'meniu',
    loadComponent: () => import('./content/order-content/meniu/meniu.page').then( m => m.MeniuPage)
  },


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
