import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate , Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { map, Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user$.pipe(map(user => {
      let isAuth = false
      user?.subscribe(user => {
        if(user.token.length){
          isAuth = true
        } else {
          isAuth = false
        }
      })
      if(isAuth){
        return true
      }
      return this.router.createUrlTree(['/auth'])


    }))
  }
}
