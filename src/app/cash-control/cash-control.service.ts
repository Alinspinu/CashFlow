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
  const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post<{message: string}>(`${this.url}pay/reports`, {value: value}, {headers})
}

saveInventary(){
  const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.get<{message: string}>(`${environment.BASE_URL}ing/save-inventary?loc=${environment.LOC}`, {headers})
}

cashInAndOut(data: any){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post<{message: string}>(`${this.url}pay/in-and-out`, data, {headers})
}

getUserOrders(userId: string) {
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/get-user-orders?userId=${userId}`, {headers})
}

changePaymnetMethod(bill: Bill){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill}, {headers})
}

reprintBill(bill: string){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post<{message: string}>(`${this.url}pay/reprint-fiscal`, {fiscal: bill}, {headers})
}

removeProductDiscount(data: any){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post(`${environment.BASE_URL}product/disc-prod`, {data: data}, {headers})
}

registerEntry(entry: any){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
 return this.http.post(`${environment.BASE_URL}register/add-entry`, entry, {headers})
}

createInvoice(orderId: string, userId: string, clientId: string, locId: string){
    const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post(`${environment.BASE_URL}orders/invoice`, {orderId, userId, clientId, locId}, { responseType: 'arraybuffer', headers: headers })
}


getAllorders(){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.get<Bill[]>(`${environment.BASE_URL}orders/all-orders?loc=${environment.LOC}`, {headers})
}

}
