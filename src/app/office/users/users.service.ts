import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import User from "src/app/auth/user.model";
import { emptyUser } from "src/app/models/empty-models";
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})


export class UsersService{



  private usersState!: BehaviorSubject<User[]>;
  public usersSend$!: Observable<User[]>;
  users: User[] = [emptyUser()];

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient
  ){
    this.usersState = new BehaviorSubject<User[]>([emptyUser()]);
    this.usersSend$ =  this.usersState.asObservable();
  }


  private createBasicAuthHeader(): HttpHeaders {
    const credentials = btoa(`${environment.API_USER}:${environment.API_PASSWORD}`);
    return new HttpHeaders({
      'bypass-tunnel-reminder': 'true',
      'Authorization': `Basic ${credentials}`
    });
  }

  getUsers(){
    const headers = this.createBasicAuthHeader()
    return this.http.post<User[]>(`${this.url}users?loc=${environment.LOC}`, {}, {headers})
            .pipe(tap(response => {
              if(response){
                console.log(response)
                this.users = response
                this.usersState.next(this.users)
              }
            }))
  }



  editUser(user: any, id: string){
    const headers = this.createBasicAuthHeader()
    return this.http.put<{message: string, user: User}>(`${this.url}users/user?id=${id}`, {update: {employee: user}}, {headers})
            .pipe(tap(response => {
              if(response){
                const userIndex = this.users.findIndex(user => user._id === response.user._id)
                if(userIndex !== -1){
                  this.users[userIndex] = response.user
                  this.usersState.next(this.users)
                }
              }
            }))
  }

  deleteUser(id: string){
    const headers = this.createBasicAuthHeader()
    return this.http.delete<{message: string}>(`${this.url}users/ed-user?id=${id}`,{headers})
          .pipe(tap(response => {
            if(response){
              const userIndex = this.users.findIndex(user => user._id === id)
              if(userIndex !== -1){
                this.users.splice(userIndex, 1)
                this.usersState.next(this.users)
              }
            }
          }))
  }

  getUser(userId: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post(`${this.url}users/user`, {userId: userId}, {headers})
  }

  setUserDiscount(userId: string, discount: any){
    const headers = this.createBasicAuthHeader()
    return this.http.put<{message: string}>(`${this.url}users/user?id=${userId}`, {update: {discount: {general: discount.general, category: discount.category}, cashBackProcent: discount.cashBackProcent}}, {headers})
  }

}
