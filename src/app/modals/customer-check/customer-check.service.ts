import { HttpClient, HttpHeaders } from "@angular/common/http";
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
    return this.http.get<{message: string, customer: any}>(`${environment.BASE_URL}users/customer?id=${customerId}&loc=${locatie}`,{headers})
  }

  createCustomer(name: string, email: string, cardIndex: number, locatie: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string, customer: any}>(`${environment.BASE_URL}users/customer`, {name: name, email: email, cardIndex: cardIndex, loc: locatie},{headers})
  }

  saveVoucher(code: string, value: number){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/add-voucher`, {code: code, value: value}, {headers})
  }

  verfyVoucher(code: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string, voucher: any}>(`${environment.BASE_URL}pay/verify-voucher`, {code: code}, {headers})
  }

  useVoucher(id: string){
    const headers = this.createBasicAuthHeader()
    return this.http.post<{message: string}>(`${environment.BASE_URL}pay/use-voucher`, {id: id}, {headers})
  }
}
