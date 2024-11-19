import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Bill } from "../models/table.model";
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})



export class CashControlService{

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ){}

raport(value: string){
  const headers = this.auth.apiAuth()
  return this.http.get<{message: string}>(`${environment.SAVE_URL}pay/reports?value=${value}`)
}

saveInventary(){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.get<{message: string}>(`${environment.SAVE_URL}ing/save-inventary?loc=${environment.LOC}`, {headers})
}

cashInAndOut(data: any){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.SAVE_URL}pay/in-and-out`, {data: data}, {headers})
}

getUserOrders(userId: string) {
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/get-user-orders?userId=${userId}`, {headers})
}

getAllorders(){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/all-orders?loc=${environment.LOC}`, {headers})
}

changePaymnetMethod(bill: Bill){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill}, {headers})
}

reprintBill(bill: string){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.SAVE_URL}pay/print-bill`, {bill: bill}, {headers})
}

printNefiscal(bill: string){
  const headers = this.auth.apiAuth()
  return this.http.post<{message: string}>(`${environment.SAVE_URL}pay/print-unreg`, {bill: bill}, {headers})
}

removeProductDiscount(data: any){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post(`${environment.BASE_URL}product/disc-prod`, {data: data}, {headers})
}

createInvoice(orderId: string, userId: string, clientId: string, locId: string){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post(`${environment.BASE_URL}orders/invoice`, {orderId, userId, clientId, locId}, { responseType: 'arraybuffer', headers })
}

printReport(report: any){
  return this.http.post<{message: string}>(`${environment.SAVE_URL}print/report`, {report: report})
}

saveEntry(entry: any){
  return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
}

}
