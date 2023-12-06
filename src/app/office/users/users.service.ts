import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'






@Injectable({providedIn: 'root'})


export class UsersService{


  constructor(
    private http: HttpClient
  ){}

  getUsers(filter: string, searchInput: string){
    return this.http.post<{}[]>(`${environment.BASE_LOCAL_URL}users?search=${searchInput}`, {filter: filter})
  }

  editUser(user: any){

  }

  getUser(userId: string){
    return this.http.post(`${environment.BASE_LOCAL_URL}users/user`, {userId: userId})
  }

}
