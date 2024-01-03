import { Routes } from '@angular/router';
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
      },
      {
        path: 'ingredient',
        loadComponent: () => import('./ingredient/ingredient.page').then( m => m.IngredientPage)
      },
      {
        path: 'live-stoc',
        loadComponent: () => import('./live-stoc/live-stoc.page').then( m => m.LiveStocPage)
      },
      {
        path: 'cash-register',
        loadComponent: () => import('./cash-register/cash-register.page').then( m => m.CashRegisterPage)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.page').then( m => m.UsersPage)
      },
      {
        path: 'nir',
        loadComponent: () => import('../office/nir/nir.page').then( m => m.NirPage)
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
    path: 'product-ingredient',
    loadComponent: () => import('./CRUD/product-ingredient/product-ingredient.page').then( m => m.ProductIngredientPage)
  },

];
