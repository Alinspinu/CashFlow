import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';
import { OfficePage } from '../office/office.page';

export const routes: Routes = [
  {
    path: '',
    component: OfficePage,
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
        path: 'shedule',
        loadComponent: () => import('./shedule/shedule.page').then( m => m.ShedulePage),
        canActivate: [AuthGuard]
      },
      {
        path: 'nir/:id',
        loadComponent: () => import('./CRUD//nir/nir.page').then( m => m.NirPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'pontaj',
        loadComponent: () => import('./pontaj/pontaj.page').then( m => m.PontajPage),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/office/products',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/office/products',
    pathMatch: 'full',
  },
  {
    path: 'show-paymets',
    loadComponent: () => import('./pontaj/show-paymets/show-paymets.page').then( m => m.ShowPaymetsPage)
  },

  // {
  //   path: 'product-ingredient',
  //   loadComponent: () => import('./CRUD/product-ingredient/product-ingredient.page').then( m => m.ProductIngredientPage)
  // },

];
