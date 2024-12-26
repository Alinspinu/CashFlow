import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";

import { environment } from "src/environments/environment";
import { Day } from "./cash-register.model";
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})



export class CashRegisterService{

  balckList: string[] = [];
  url: string = environment.BASE_URL



  constructor(
    private http: HttpClient,
    ){
    }


    exportRegister(startDate: any, endDate: any, loc: string){
        const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
      return this.http.post(`${this.url}register/create-xcel`,{startDate: startDate, endDate: endDate, loc: loc},{responseType: 'blob', headers: headers})
    }

    getDocuments(page: number, loc: string): Observable<{message: string, documents: Day[]}> {
        const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
      return this.http.get<{message: string, documents: Day[]}>(`${this.url}register/show-cash-register?page=${page}&loc=${loc}`, {headers});
    }

    deleteEntry(id: string){
        const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
      return this.http.delete<{message: string}>(`${this.url}register/delete-entry?id=${id}`, {headers})
    }

    getDaysByDate(startDate: any, endDate: any, loc: string){
        const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
      return this.http.post<{message: string, documents: Day[]}>(`${this.url}register/get-days`,{startDate: startDate, endDate: endDate, loc: loc}, {headers})
    }


}
