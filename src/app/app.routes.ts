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
    path: 'entry-view',
    loadComponent: () => import('./modals/entry-view/entry-view.page').then( m => m.EntryViewPage)
  },
  {
    path: 'close-day',
    loadComponent: () => import('./cash-control/close-day/close-day.page').then( m => m.CloseDayPage)
  },
  {
    path: 'monetar',
    loadComponent: () => import('./cash-control/monetar/monetar.page').then( m => m.MonetarPage)
  },

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
