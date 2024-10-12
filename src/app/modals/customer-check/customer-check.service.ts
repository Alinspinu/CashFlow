import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Customer } from "./customer-check.page";
import { Preferences } from '@capacitor/preferences';


@Injectable({providedIn: 'root'})



export class CustomerCheckService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient
  ){
  }


  searchCustomer(customerId: string, locatie: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.get<{message: string, customer: any}>(`${this.url}users/customer?id=${customerId}&loc=${locatie}`, {headers})
  }

  createCustomer(name: string, email: string, cardIndex: any, locatie: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.post<{message: string, customer: any}>(`${this.url}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: locatie}, {headers})
  }
}
