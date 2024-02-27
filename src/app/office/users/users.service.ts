import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'






@Injectable({providedIn: 'root'})


export class UsersService{


  constructor(
    private http: HttpClient
  ){}

  getUsers(filter: string, searchInput: string, locatie: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post<{}[]>(`${environment.BASE_URL}users?search=${searchInput}&loc=${locatie}`, {filter: filter}, {headers})
  }

  editUser(user: any, id: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/user?id=${id}`, {update: {employee: user}}, {headers})
  }
  deleteUser(id: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.delete<{message: string}>(`${environment.BASE_URL}users/ed-user?id=${id}`,{headers})
  }

  getUser(userId: string){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post(`${environment.BASE_URL}users/user`, {userId: userId}, {headers})
  }

  setUserDiscount(userId: string, discount: any){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/user?id=${userId}`, {update: {discount: {general: discount.general, category: discount.category}, cashBackProcent: discount.cashBackProcent}}, {headers})
  }

}
