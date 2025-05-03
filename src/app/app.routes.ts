import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then((m) => m.AuthPage),
  },

  {
    path: 'tables',
    loadComponent: () =>
      import('./tables/tables.page').then((m) => m.TablesPage),
      canActivate: [AuthGuard]
  },
  {
    path: 'cash-control',
    loadComponent: () => import('./cash-control/cash-control.page').then( m => m.CashControlPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'office',
    loadChildren: () =>
      import('./office/office.routes').then((m) => m.routes),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.routes').then((m) => m.routes),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./config/config.page').then((m) => m.ConfigPage),
      canActivate: [AuthGuard]
  },
  {
    path: 'shedule',
    loadComponent: () => import('./office/shedule/shedule.page').then( m => m.ShedulePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'pontaj',
    loadComponent: () => import('./office/pontaj/pontaj.page').then( m => m.PontajPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'table-content/:id',
    loadComponent: () => import('./content/table-content/table-content.page').then( m => m.TableContentPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'nir/:id',
    loadComponent: () => import('./office/CRUD//nir/nir.page').then( m => m.NirPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'register-locatie/:value',
    loadComponent: () => import('./office/CRUD/suplier/suplier.page').then( m => m.SuplierPage),
  },
  {
    path: 'user-display',
    loadComponent: () => import('./content/user-display/user-display.page').then( m => m.UserDisplayPage)
  },
  {
    path: 'sales',
    loadComponent: () => import('./cash-control/sales/sales.page').then( m => m.SalesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./cash-control/orders/orders.page').then( m => m.OrdersPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-product',
    loadComponent: () => import('./office/CRUD/product/product.page').then( m => m.ProductPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'cigaretes',
    loadComponent: () => import('./cash-control/cigaretes/cigaretes.page').then( m => m.CigaretesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'email',
    loadComponent: () => import('./config/email/email.page').then( m => m.EmailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'viva',
    loadComponent: () => import('./config/viva/viva.page').then( m => m.VivaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'print',
    loadComponent: () => import('./config/print/print.page').then( m => m.PrintPage),
    canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: '/tables',
    pathMatch: 'full',
  },
  {
    path: 'header',
    loadComponent: () => import('./cash-control/header/header.page').then( m => m.HeaderPage)
  },
  {
    path: 'add-customer',
    loadComponent: () => import('./content/table-content/customer-check/add-customer/add-customer.page').then( m => m.AddCustomerPage)
  },
  {
    path: 'print-modal',
    loadComponent: () => import('./config/print/print-modal/print-modal.page').then( m => m.PrintModalPage)
  },  {
    path: 'invs',
    loadComponent: () => import('./cash-control/cigaretes/invs/invs.page').then( m => m.InvsPage)
  },
  {
    path: 'inv',
    loadComponent: () => import('./cash-control/cigaretes/invs/inv/inv.page').then( m => m.InvPage)
  },
  {
    path: 'point',
    loadComponent: () => import('./config/point/point.page').then( m => m.PointPage)
  },





];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
