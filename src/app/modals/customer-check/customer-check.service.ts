import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Customer } from "./customer-check.page";


@Injectable({providedIn: 'root'})



export class CustomerCheckService{

  constructor(
    private http: HttpClient
  ){}

  searchCustomer(customerId: string, locatie: string){
    return this.http.get<{message: string, customer: any}>(`${environment.BASE_URL}users/customer?id=${customerId}&loc=${locatie}`)
  }

  createCustomer(name: string, email: string, cardIndex: number, locatie: string){
    return this.http.post<{message: string, customer: any}>(`${environment.BASE_URL}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: locatie})
  }

  saveVoucher(code: string, value: number){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/add-voucher`, {code: code, value: value})
  }

  verfyVoucher(code: string){
    return this.http.post<{message: string, voucher: any}>(`${environment.BASE_URL}pay/verify-voucher`, {code: code})
  }

  useVoucher(id: string){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/use-voucher`, {id: id})
  }
}
