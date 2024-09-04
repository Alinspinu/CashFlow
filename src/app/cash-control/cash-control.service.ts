import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Bill } from "../models/table.model";


@Injectable({providedIn: 'root'})



export class CashControlService{

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ){}

raport(value: string){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.PRINT_URL}print`, {rep: value}, {headers})
}

saveInventary(){
  return this.http.get<{message: string}>(`${environment.BASE_URL}ing/save-inventary?loc=${environment.LOC}`)
}

cashInAndOut(data: any){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.PRINT_URL}print`, {inOut: data}, {headers})
}

getUserOrders(userId: string) {
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/get-user-orders?userId=${userId}`)
}

changePaymnetMethod(bill: Bill){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill})
}

reprintBill(bill: string){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.PRINT_URL}print`, {fiscal: bill}, {headers})
}

removeProductDiscount(data: any){
  return this.http.post(`${environment.BASE_URL}product/disc-prod`, {data: data})
}

registerEntry(entry: any){
 return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
}

createInvoice(orderId: string, userId: string, clientId: string, locId: string){
  return this.http.post(`${environment.BASE_URL}orders/invoice`, {orderId, userId, clientId, locId}, { responseType: 'arraybuffer' })
}

}
