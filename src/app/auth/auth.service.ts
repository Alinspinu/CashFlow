import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  BehaviorSubject, from, map, tap } from "rxjs";
import  {jwtDecode } from 'jwt-decode'
import { Preferences } from "@capacitor/preferences";
import {environment} from "../../environments/environment"
import User from "./user.model";
import { emptyUser } from "../models/empty-models";



export interface AuthResData {
message: string ,
user: {
  name: string,
  email: string,
  id: string,
}
}


@Injectable({providedIn: 'root'})

export class AuthService{
  activeLogoutTimer!: any;


  private user = new BehaviorSubject<User>(emptyUser());

  get user$() {
      return from(Preferences.get({key: 'authData'})).pipe(map(data => {
        if(data.value){
          const userData = JSON.parse(data.value) as {
            _id: string,
            name: string,
            token: string,
            admin: number,
            cashBack: number,
            email: string,
            tokenExpirationDate: any,
            status: string,
            telephone: string,
            locatie: string,
            employee: {position: string, fullName: string, user: string, access: number}
          };
          const tokenDate = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
          if(tokenDate <= 0){
            return this.user.asObservable();
          } else if(tokenDate > 0) {
            this.user.next(userData);
            this.aoutoLogout(tokenDate);
            return this.user.asObservable();
          } else if(this.user.value.cashBack < userData.cashBack && this.user.value.cashBack !== -1){
            userData.cashBack = this.user.value.cashBack;
            this.user.next(userData);
            return this.user.asObservable();
          }else {
            this.user.next(userData);
            return this.user.asObservable();
          };
        } else {
          return null
        };
      }));
  };

  constructor(private http: HttpClient){}

  onLogin(email: string, password: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post<any>(`${environment.BASE_URL}auth/login`,{email, password, adminEmail: environment.ADMIN_EMAIL, loc: environment.LOC}, {headers})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  onRegister(name: string, email: string, tel: string, password: string, confirmPassword: string, firstCart: string, survey: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post<{message: string, id: string}>(`${environment.BASE_URL}auth/register`,{name, email, password, confirmPassword, firstCart, survey, tel, loc: environment.LOC}, {headers});
  };

  verifyToken(token: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post<any>(`${environment.BASE_URL}auth/verify-token`, {token: token}, {headers})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  };

  sendResetEmail(email: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
   return this.http.post<AuthResData>(`${environment.BASE_URL}auth/send-reset-email`, {email}, {headers});
  };

  resetPassword(token: string, password: string, confirmPassword: string){
    return this.http.post(`${environment.BASE_URL}auth/reset-password`, {token, password, confirmPassword})
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  private setAndStoreUserData(userData: any){
    console.log(userData)
    if(userData.message){
    } else {
      const decodedToken: any = jwtDecode(userData.token);
      const expirationDate: any = new Date(+Date.now().toString() + (decodedToken.exp-decodedToken.iat) * 1000);
      const data = JSON.stringify({
        _id: decodedToken.userId,
        name: userData.name,
        token: userData.token,
        admin: userData.admin,
        cashBack: userData.cashBack,
        email: userData.email,
        tokenExpirationDate: expirationDate,
        status: userData.status,
        telephone: userData.telephone,
        locatie: userData.locatie,
        employee: {
          fullName: userData.employee.fullName,
          position: userData.employee.position,
          access: userData.employee.access,
          user: decodedToken.userId
        }
      });
      const tokenDate = new Date(expirationDate).getTime() - new Date().getTime();
      this.aoutoLogout(tokenDate);
      this.user.next(JSON.parse(data));
    Preferences.set({key: 'authData', value: data});
    };
  };

  updateCaskBack(user: User){
     this.user.next(user);
  }

  logout(){
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    Preferences.remove({key: "authData"});
    Preferences.remove({key: 'data'});
  }

  private aoutoLogout(duration: number) {
    if(this.activeLogoutTimer){
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(()=> {
      this.logout();
    }, duration);
  };

};
