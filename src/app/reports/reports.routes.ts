import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cash',
        loadComponent: () => import('./cash/cash.page').then( m => m.CashPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadComponent: () => import('./products/products.page').then( m => m.ProductsPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'finance',
        loadComponent: () => import('./finance/finance.page').then( m => m.FinancePage),
        canActivate: [AuthGuard]
      },
      {
        path: 'inventary',
        loadComponent: () => import('./inventary/inventary.page').then( m => m.InventaryPage),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/reports/cash',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/reports/inventary',
    pathMatch: 'full',
  },



];
