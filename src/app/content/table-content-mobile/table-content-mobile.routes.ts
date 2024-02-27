import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth-guard';
// import { FoodPage } from './food/food.page';
import { TableContentMobilePage } from './table-content-mobile.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TableContentMobilePage,
    children: [
      {
        path: 'food',
        loadComponent: () =>
          import('./food/food.page').then((m) => m.FoodPage),
      },
      {
        path: 'bar',
        loadComponent: () =>
          import('./bar/bar.page').then((m) => m.BarPage),
      },
      {
        path: 'bill',
        loadComponent: () =>
          import('./bill/bill.page').then((m) => m.BillPage),
      },
      {
        path: 'coffee',
        loadComponent: () =>
          import('./coffee/coffee.page').then((m) => m.CoffeePage),
      },
      {
        path: 'shop',
        loadComponent: () =>
          import('./shop/shop.page').then((m) => m.ShopPage),
      },
      {
        path: 'cat/:id',
        loadComponent: () =>
          import('./category-content/category-content.page').then((m) => m.CategoryContentPage),
      },
      {
        path: '',
        redirectTo: '/tabs/food',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/food',
    pathMatch: 'full',
  },
  {
    path: 'tab-content',
    loadComponent: () => import('./tab-content/tab-content.page').then( m => m.TabContentPage)
  },
  {
    path: 'category-content',
    loadComponent: () => import('./category-content/category-content.page').then( m => m.CategoryContentPage)
  },
  {
    path: 'header-content',
    loadComponent: () => import('./header-content/header-content.page').then( m => m.HeaderContentPage)
  },
];
