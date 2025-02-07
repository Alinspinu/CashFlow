import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";

import { environment } from "src/environments/environment";
import { Day } from "./cash-register.model";



@Injectable({providedIn: 'root'})



export class CashRegisterService{

  balckList: string[] = [];



  constructor(
    private http: HttpClient,
    ){
    }

    exportRegister(startDate: any, endDate: any, loc: string){
      return this.http.post(`${environment.BASE_URL}register/create-xcel`,{startDate: startDate, endDate: endDate, loc: loc},{responseType: 'blob'})
    }

    getDocuments(page: number): Observable<{message: string, documents: Day[]}> {
      return this.http.get<{message: string, documents: Day[]}>(`${environment.BASE_URL}register/show-cash-register?page=${page}&loc=${environment.LOC}`);
    }

    deleteEntry(id: string){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}register/delete-entry?id=${id}`)
    }

    getDaysByDate(startDate: any, endDate: any, loc: string){
      return this.http.post<{message: string, documents: Day[]}>(`${environment.BASE_URL}register/get-days`,{startDate: startDate, endDate: endDate, loc: loc})
    }

    addEntry(entry: any){
      return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
    }

    deleteDay(id: string){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}register/day?id=${id}`)
    }

}







