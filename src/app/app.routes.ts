import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'table-content/:id',
    loadComponent: () => import('./content/table-content/table-content.page').then( m => m.TableContentPage)
  },
  {
    path: 'pick-option',
    loadComponent: () => import('./modals/pick-option/pick-option.page').then( m => m.PickOptionPage)
  },
  {
    path: 'add-product',
    loadComponent: () => import('./office/CRUD//product/product.page').then( m => m.ProductPage)
  },
  {
    path: 'add-ingredient',
    loadComponent: () => import('./office/CRUD//ingredient/ingredient.page').then( m => m.IngredientPage)
  },
  {
    path: 'add-category',
    loadComponent: () => import('./office/CRUD/category/category.page').then( m => m.CategoryPage)
  },
  {
    path: 'pick-qty',
    loadComponent: () => import('./modals/pick-qty/pick-qty.page').then( m => m.PickQtyPage)
  },
  {
    path: 'sub-product',
    loadComponent: () => import('./office/CRUD/sub-product/sub-product.page').then( m => m.SubProductPage)
  },
  {
    path: 'products',
    loadComponent: () => import('./office/products/products.page').then( m => m.ProductsPage)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
