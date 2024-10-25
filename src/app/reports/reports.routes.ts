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
    path: 'select-inv',
    loadComponent: () => import('./inventary/select-inv/select-inv.page').then( m => m.SelectInvPage)
  },
  {
    path: 'add-report',
    loadComponent: () => import('./add-report/add-report.page').then( m => m.AddReportPage)
  },  {
    path: 'upload-log',
    loadComponent: () => import('./inventary/upload-log/upload-log.page').then( m => m.UploadLogPage)
  },


];
