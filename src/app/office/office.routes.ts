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
        path: 'supliers',
        loadComponent: () => import('./supliers/supliers.page').then( m => m.SupliersPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'suplier/:id',
        loadComponent: () => import('./supliers/suplier/suplier.page').then( m => m.SuplierPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'e-factura',
        loadComponent: () => import('./e-factura/e-factura.page').then( m => m.EFacturaPage),
        canActivate: [AuthGuard]
      },
      {
        path: 'imp',
        loadComponent: () => import('./imp/imp.page').then( m => m.ImpPage),
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
      // {
      //   path: 'ingredients',
      //   loadComponent: () => import('./e-factura/ingredients/ingredients.page').then( m => m.IngredientsPage)
      // },
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
  {
    path: 'record-modal',
    loadComponent: () => import('./supliers/suplier/record-modal/record-modal.page').then( m => m.RecordModalPage)
  },
  {
    path: 'add-nir',
    loadComponent: () => import('./CRUD/nir/add-nir/add-nir.page').then( m => m.AddNirPage)
  },
  {
    path: 'add-ing',
    loadComponent: () => import('./CRUD/nir/add-ing/add-ing.page').then( m => m.AddIngPage)
  },
  {
    path: 'ingredient-content',
    loadComponent: () => import('./ingredient/ingredient-content/ingredient-content.page').then( m => m.IngredientContentPage)
  },
  {
    path: 'record',
    loadComponent: () => import('./nirs/record/record.page').then( m => m.RecordPage)
  },
  {
    path: 'sale-point',
    loadComponent: () => import('./sale-point/sale-point.page').then( m => m.SalePointPage)
  },
  {
    path: 'add-point-modal',
    loadComponent: () => import('./sale-point/add-point-modal/add-point-modal.page').then( m => m.AddPointModalPage)
  },
  {
    path: 'categories',
    loadComponent: () => import('./products/categories/categories.page').then( m => m.CategoriesPage)
  },  {
    path: 'report',
    loadComponent: () => import('./CRUD/product/report/report.page').then( m => m.ReportPage)
  },












  // {
  //   path: 'product-ingredient',
  //   loadComponent: () => import('./CRUD/product-ingredient/product-ingredient.page').then( m => m.ProductIngredientPage)
  // },

];
