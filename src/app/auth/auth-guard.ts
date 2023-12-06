import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate , Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { map, Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user$.pipe(map(user => {
      console.log('fromguard')

      const isAuth = !!user
      if(isAuth){
        return true
      }
      console.log(isAuth)
      return this.router.createUrlTree(['/auth'])
    }))
  }
}
