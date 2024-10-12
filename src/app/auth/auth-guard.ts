import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate , Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, tap } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router,

  ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user$.pipe(
      map(user => {
        // Check if the user is authenticated based on the token
        if (user && user.token && user.token.length) {
          return true; // User is authenticated
        }
        return this.router.createUrlTree(['/auth'], { queryParams: { returnUrl: state.url } });
      })
    );
  }
}

