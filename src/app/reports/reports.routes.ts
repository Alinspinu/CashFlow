import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';
import { ReportsPage } from './reports.page';

export const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
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
        redirectTo: '/tabs/reports/cash',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/reports/cash',
    pathMatch: 'full',
  },
  {
    path: 'finance',
    loadComponent: () => import('./finance/finance.page').then( m => m.FinancePage)
  },
  {
    path: 'inventary',
    loadComponent: () => import('./inventary/inventary.page').then( m => m.InventaryPage)
  },
  {
    path: 'select-inv',
    loadComponent: () => import('./inventary/select-inv/select-inv.page').then( m => m.SelectInvPage)
  },

];
