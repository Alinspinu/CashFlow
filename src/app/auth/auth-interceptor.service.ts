import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import User from './user.model';


@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the user data from Preferences
    return from(Preferences.get({ key: 'authData' })).pipe(
      switchMap(data => {
        if (data.value) {
          const user = JSON.parse(data.value) as User;
          if (user && user.token) {
            const secureReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            return next.handle(secureReq);  // Pass the cloned request with the authorization header
          }
        }
        return next.handle(req);
      }),
      catchError(error => {
        console.error('Error fetching user data from Preferences', error);
        return next.handle(req);
      })
    );
  }

}

