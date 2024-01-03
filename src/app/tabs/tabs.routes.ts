import { Routes } from '@angular/router';
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
          // canLoad: [AuthGuard]
      },
      {
        path: 'office',
        loadChildren: () =>
          import('../office/office.routes').then((m) => m.routes),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('../reports/reports.page').then((m) => m.ReportsPage),
      },
      {
        path: 'add-product',
        loadComponent: () => import('../office/CRUD/product/product.page').then( m => m.ProductPage)
      },
      {
        path: 'add-suplier',
        loadComponent: () => import('../office/CRUD/suplier/suplier.page').then( m => m.SuplierPage)
      },
      {
        path: 'add-product/:id',
        loadComponent: () => import('../office/CRUD/product/product.page').then( m => m.ProductPage)
      },
      {
        path: 'user-content/:id',
        loadComponent: () => import('../content/user-content/user-content.page').then( m => m.UserContentPage)
      },
      {
        path: 'cash-control',
        loadComponent: () => import('../cash-control/cash-control.page').then( m => m.CashControlPage)
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
