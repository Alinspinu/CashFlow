import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tables',
        loadComponent: () =>
          import('../tables/tables.page').then((m) => m.TablesPage),
          canActivate: [AuthGuard]
      },
      {
        path: 'office',
        loadChildren: () =>
          import('../office/office.routes').then((m) => m.routes),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('../reports/reports.routes').then((m) => m.routes),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../reports/reports.page').then((m) => m.ReportsPage),
          canActivate: [AuthGuard]
      },
      {
        path: 'config',
        loadComponent: () =>
          import('../config/config.page').then((m) => m.ConfigPage),
          canActivate: [AuthGuard]
      },
      {
        path: 'add-product',
        loadComponent: () => import('../office/CRUD/product/product.page').then( m => m.ProductPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'add-suplier/:value',
        loadComponent: () => import('../office/CRUD/suplier/suplier.page').then( m => m.SuplierPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'add-product/:id',
        loadComponent: () => import('../office/CRUD/product/product.page').then( m => m.ProductPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-content/:id',
        loadComponent: () => import('../content/user-content/user-content.page').then( m => m.UserContentPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'cash-control',
        loadComponent: () => import('../cash-control/cash-control.page').then( m => m.CashControlPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'mobile',
        loadComponent: () => import('../cash-control/mobile/mobile.page').then( m => m.MobilePage)
      },
      {
        path: '',
        redirectTo: '/tabs/tables',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tables',
    pathMatch: 'full',
  },
];
