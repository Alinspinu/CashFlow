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
    path: 'order-content/:id',
    loadComponent: () => import('./content/order-content/order-content.page').then( m => m.OrderContentPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'register-locatie/:value',
    loadComponent: () => import('./office/CRUD/suplier/suplier.page').then( m => m.SuplierPage),
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
