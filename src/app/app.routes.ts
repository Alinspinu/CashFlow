import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'table-content/:id',
    loadComponent: () => import('./content/table-content/table-content.page').then( m => m.TableContentPage),
    // canLoad: [AuthGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./modals/payment/payment.page').then( m => m.PaymentPage)
  },
  {
    path: 'customer-check',
    loadComponent: () => import('./modals/customer-check/customer-check.page').then( m => m.CustomerCheckPage)
  },
  {
    path: 'discount',
    loadComponent: () => import('./modals/discount/discount.page').then( m => m.DiscountPage)
  },
  {
    path: 'cashback',
    loadComponent: () => import('./modals/cashback/cashback.page').then( m => m.CashbackPage)
  },
  {
    path: 'add-employee-data',
    loadComponent: () => import('./modals/add-employee-data/add-employee-data.page').then( m => m.AddEmployeeDataPage)
  },
  {
    path: 'order-view',
    loadComponent: () => import('./modals/order-view/order-view.page').then( m => m.OrderViewPage)
  },
  // {
  //   path: 'pick-option',
  //   loadComponent: () => import('./modals/pick-option/pick-option.page').then( m => m.PickOptionPage)
  // },
  // {
  //   path: 'add-product',
  //   loadComponent: () => import('./office/CRUD//product/product.page').then( m => m.ProductPage)
  // },
  // {
  //   path: 'add-ingredient',
  //   loadComponent: () => import('./office/CRUD//ingredient/ingredient.page').then( m => m.IngredientPage)
  // },
  // {
  //   path: 'add-category',
  //   loadComponent: () => import('./office/CRUD/category/category.page').then( m => m.CategoryPage)
  // },
  // {
  //   path: 'pick-qty',
  //   loadComponent: () => import('./modals/pick-qty/pick-qty.page').then( m => m.PickQtyPage)
  // },
  {
    path: 'sub-product',
    loadComponent: () => import('./office/CRUD/sub-product/sub-product.page').then( m => m.SubProductPage)
  },
  {
    path: 'cash-in-out',
    loadComponent: () => import('./modals/cash-in-out/cash-in-out.page').then( m => m.CashInOutPage)
  }
  // {
  //   path: 'products',
  //   loadComponent: () => import('./office/products/products.page').then( m => m.ProductsPage)
  // },
  // {
  //   path: 'user-content/:id',
  //   loadComponent: () => import('./content/user-content/user-content.page').then( m => m.UserContentPage)
  // },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
