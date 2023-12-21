import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'






@Injectable({providedIn: 'root'})


export class UsersService{


  constructor(
    private http: HttpClient
  ){}

  getUsers(filter: string, searchInput: string){
    return this.http.post<{}[]>(`${environment.BASE_URL}users?search=${searchInput}`, {filter: filter})
  }

  editUser(user: any, id: string){
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/user?id=${id}`, {employee: user})
  }
  deleteUser(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}users/ed-user?id=${id}`)
  }

  getUser(userId: string){
    return this.http.post(`${environment.BASE_URL}users/user`, {userId: userId})
  }

}
