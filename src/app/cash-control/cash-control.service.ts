import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Bill } from "../models/table.model";
import { Preferences } from '@capacitor/preferences';


@Injectable({providedIn: 'root'})



export class CashControlService{

  url: string = environment.SAVE_URL

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ){
    // this.getUrl()
  }


  // async getUrl(){
  //   Preferences.get({key: 'serverUrl'}).then( async (data)  => {
  //     if(data.value) {
  //       this.url = data.value
  //     }
  //   })
  // }

raport(value: string){
  return this.http.post<{message: string}>(`${this.url}pay/reports`, {value: value})
}

saveInventary(){
  return this.http.get<{message: string}>(`${environment.BASE_URL}ing/save-inventary?loc=${environment.LOC}`)
}

cashInAndOut(data: any){
  return this.http.post<{message: string}>(`${this.url}pay/in-and-out`, data)
}

getUserOrders(userId: string) {
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/get-user-orders?userId=${userId}`)
}

changePaymnetMethod(bill: Bill){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill})
}

reprintBill(bill: string){
  return this.http.post<{message: string}>(`${this.url}pay/reprint-fiscal`, {fiscal: bill})
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


getAllorders(){
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/all-orders?loc=${environment.LOC}`)
}

}
