import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Customer } from "./customer-check.page";


@Injectable({providedIn: 'root'})



export class CustomerCheckService{

  constructor(
    private http: HttpClient
  ){}

  searchCustomer(customerId: string){
    return this.http.get<{message: string, customer: any}>(`${environment.BASE_URL}users/customer?id=${customerId}`)
  }

  createCustomer(name: string, email: string, cardIndex: number, locatie: string){
    return this.http.post<{message: string, customer: any}>(`${environment.BASE_URL}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: locatie})
  }
}
