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

  url: string = environment.BASE_URL

  activeLogoutTimer!: any;

  // async getUrl(){
  //   Preferences.get({key: 'serverUrl'}).then( async (data)  => {
  //     if(data.value) {
  //       this.url = data.value
  //     }
  //   })
  // }


  private user = new BehaviorSubject<User>(emptyUser());

  get user$() {
      return from(Preferences.get({key: 'authData'})).pipe(map(data => {
        if(data.value){
          const userData = JSON.parse(data.value) as User
          const tokenDate = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
          if(tokenDate <= 0){
            return null
          }else {
            if(this.user.value){
              if(this.user.value.cashBack < userData.cashBack && this.user.value.cashBack !== -1){
                userData.cashBack = this.user.value.cashBack;
              }
            }
            this.user.next(userData);
            return userData
          };
        } else {
          return null
        };
      }));
  };

  constructor(private http: HttpClient){
  }


  apiAuth(){
    const username = environment.LOC;
    const password = environment.API_PASS;

    const credentials = btoa(`${username}:${password}`); // Base64 encode username and password
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true',
        Authorization: `Basic ${credentials}`
      });
    return headers
  }


  onLogin(email: string, password: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      })
    };
    return this.http.post<any>(`${this.url}auth/login`,{email, password, loc: environment.LOC, adminEmail: environment.ADMIN_EMAIL}, httpOptions)
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  onRegister(name: string, email: string, tel: string, password: string, confirmPassword: string, firstCart: string, survey: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      })
    };
    return this.http.post<{message: string, id: string}>(`${this.url}auth/register`,{name, email, password, confirmPassword, firstCart, survey, tel, loc: environment.LOC}, httpOptions);
  };

  verifyToken(token: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      })
    };
    return this.http.post<any>(`${this.url}auth/verify-token`, {token: token}, httpOptions)
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  };

  sendResetEmail(email: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      })
    };
   return this.http.post<AuthResData>(`${this.url}auth/send-reset-email`, {email}, httpOptions);
  };

  resetPassword(token: string, password: string, confirmPassword: string){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'bypass-tunnel-reminder': 'true'
      })
    };
    return this.http.post(`${this.url}auth/reset-password`, {token, password, confirmPassword}, httpOptions)
        .pipe(tap(this.setAndStoreUserData.bind(this)));
  }

  private setAndStoreUserData(userData: any){
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
          user: decodedToken.userId,
          salary: userData.employee.salary
        },
        workLog: userData.employee.workLog,
        payments: userData.employee.payments
      });
      const tokenDate = new Date(expirationDate).getTime() - new Date().getTime();
      console.log(tokenDate)
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
