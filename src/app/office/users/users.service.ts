import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import User from "src/app/auth/user.model";
import { emptyUser } from "src/app/models/empty-models";



@Injectable({providedIn: 'root'})


export class UsersService{



  private usersState!: BehaviorSubject<User[]>;
  public usersSend$!: Observable<User[]>;
  users: User[] = [emptyUser()];


  constructor(
    private http: HttpClient
  ){
    this.usersState = new BehaviorSubject<User[]>([emptyUser()]);
    this.usersSend$ =  this.usersState.asObservable();
  }


  // private createBasicAuthHeader(): HttpHeaders {
  //   const credentials = btoa(`${environment.API_USER}:${environment.API_PASSWORD}`);
  //   return new HttpHeaders({
  //     'Authorization': `Basic ${credentials}`
  //   });
  // }

  getUsers(){
    return this.http.post<User[]>(`${environment.BASE_URL}users?loc=${environment.LOC}`, {})
            .pipe(tap(response => {
              if(response){
                this.users = response
                this.usersState.next(this.users)
              }
            }))
  }



  editUser(user: any, id: string){

    return this.http.put<{message: string, user: User}>(`${environment.BASE_URL}users/user?id=${id}`, {update: {employee: user}})
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
    return this.http.delete<{message: string}>(`${environment.BASE_URL}users/ed-user?id=${id}`)
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
    return this.http.post<User>(`${environment.BASE_URL}users/user`, {userId: userId})
  }

  setUserDiscount(userId: string, discount: any){
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/user?id=${userId}`, {update: {discount: {general: discount.general, category: discount.category}, cashBackProcent: discount.cashBackProcent}})
  }

}
