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
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'add-product',
        loadComponent: () => import('../office/CRUD/product/product.page').then( m => m.ProductPage)
      },
      {
        path: 'add-nir',
        loadComponent: () => import('../office/nir/nir.page').then( m => m.NirPage)
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
