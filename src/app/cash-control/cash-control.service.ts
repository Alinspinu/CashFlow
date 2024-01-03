import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Bill } from "../models/table.model";

@Injectable({providedIn: 'root'})



export class CashControlService{

  constructor(
    private http: HttpClient
  ){}

raport(value: string){
  return this.http.get<{message: string}>(`${environment.BASE_URL}pay/reports?value=${value}`)
}

caahInAndOut(data: any){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/in-and-out`, {data: data})
}

getUserOrders(userId: string) {
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/get-user-orders?userId=${userId}`)
}

changePaymnetMethod(bill: Bill){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill})
}

reprintBill(bill: Bill){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/print-bill`, {bill: bill})
}

}
