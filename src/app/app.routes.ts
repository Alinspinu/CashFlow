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
    path: 'add-client-discount',
    loadComponent: () => import('./modals/add-client-discount/add-client-discount.page').then( m => m.AddClientDiscountPage)
  },
  {
    path: 'tips',
    loadComponent: () => import('./modals/tips/tips.page').then( m => m.TipsPage)
  },
  {
    path: 'add-product-discount',
    loadComponent: () => import('./modals/add-product-discount/add-product-discount.page').then( m => m.AddProductDiscountPage)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
