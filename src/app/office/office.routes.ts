import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('../office/products/products.page').then((m) => m.ProductsPage),
          canActivate: [AuthGuard]
      },
      {
        path: 'ingredient',
        loadComponent: () => import('./ingredient/ingredient.page').then( m => m.IngredientPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'cash-register',
        loadComponent: () => import('./cash-register/cash-register.page').then( m => m.CashRegisterPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.page').then( m => m.UsersPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'nirs',
        loadComponent: () => import('./nirs/nirs.page').then( m => m.NirsPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'supliers',
        loadComponent: () => import('./supliers/supliers.page').then( m => m.SupliersPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'suplier/:id',
        loadComponent: () => import('./supliers/suplier-records/suplier-records.page').then( m => m.SuplierRecordsPage),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/office/products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/office/products',
    pathMatch: 'full',
  },













  // {
  //   path: 'product-ingredient',
  //   loadComponent: () => import('./CRUD/product-ingredient/product-ingredient.page').then( m => m.ProductIngredientPage)
  // },

];
