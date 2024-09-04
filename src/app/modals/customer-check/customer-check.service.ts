import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Customer } from "./customer-check.page";


@Injectable({providedIn: 'root'})



export class CustomerCheckService{

  constructor(
    private http: HttpClient
  ){}
  private createBasicAuthHeader(): HttpHeaders {
    const credentials = btoa(`${environment.API_USER}:${environment.API_PASSWORD}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`
    });
  }

  searchCustomer(customerId: string, locatie: string){
    const headers = this.createBasicAuthHeader()
    return this.http.get<{message: string, customer: any}>(`${environment.BASE_URL}users/customer?id=${customerId}&loc=${locatie}`, {headers})
  }

  createCustomer(name: string, email: string, cardIndex: any, locatie: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string, customer: any}>(`${environment.BASE_URL}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: locatie}, {headers})
  }
}
