import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';
import { ReportsPage } from './reports.page';

export const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
      {
        path: 'live-stoc',
        loadComponent: () => import('../reports/live-stoc/live-stoc.page').then( m => m.LiveStocPage),
      },
      {
        path: 'cash',
        loadComponent: () => import('./cash/cash.page').then( m => m.CashPage)
      },
      {
        path: 'products',
        loadComponent: () => import('./products/products.page').then( m => m.ProductsPage)
      },
      {
        path: '',
        redirectTo: '/tabs/reports/live-stoc',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/reports/live-stoc',
    pathMatch: 'full',
  },

];