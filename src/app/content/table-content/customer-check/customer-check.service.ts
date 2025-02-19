import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Customer } from "./customer-check.page";


@Injectable({providedIn: 'root'})



export class CustomerCheckService{

  constructor(
    private http: HttpClient
  ){}


  searchCustomer(customerId: string, mode: string){
    return this.http.get<{message: string, customer: any}>(`${environment.BASE_URL}users/customer?id=${customerId}&loc=${environment.LOC}&mode=${mode}`)
  }

  createCustomer(name: string, email: string, cardIndex: number){
    return this.http.post<{message: string, customer: any}>(`${environment.BASE_URL}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: environment.LOC})
  }

  saveVoucher(code: string, value: number){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/add-voucher`, {code: code, value: value, loc: environment.LOC})
  }

  verfyVoucher(code: string){
    return this.http.post<{message: string, voucher: any}>(`${environment.BASE_URL}pay/verify-voucher`, {code: code, loc: environment.LOC})
  }

  useVoucher(id: string){
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/use-voucher`, {id: id})
  }
}
