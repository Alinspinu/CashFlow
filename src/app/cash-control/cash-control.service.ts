import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Bill, deletetBillProduct } from "../models/table.model";
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { emptyBill, emptyDeletetBillProduct } from "../models/empty-models";
import { cigarsInv } from "../models/inventary.model";

@Injectable({providedIn: 'root'})



export class CashControlService{


    private ordersState!: BehaviorSubject<Bill[]>;
    private delProdState!: BehaviorSubject<deletetBillProduct[]>;

    public ordersSend$!: Observable<Bill[]>;
    public delProdSend$!: Observable<deletetBillProduct[]>;

    orders: Bill[] = [emptyBill()];
    delPrd: deletetBillProduct[] = [emptyDeletetBillProduct()];

    constructor(
      private http: HttpClient,
      private auth: AuthService,
    ){
      this.ordersState = new BehaviorSubject<Bill[]>([emptyBill()]);
      this.delProdState = new BehaviorSubject<deletetBillProduct[]>([emptyDeletetBillProduct()]);

      this.ordersSend$ =  this.ordersState.asObservable();
      this.delProdSend$ =  this.delProdState.asObservable();
    }


raport(value: string, mainServer: any){
  return this.http.get<{message: string}>(`${environment.BASE_URL}pay/reports?value=${value}&serverId=${mainServer._id}`)
}

saveInventary(){
  return this.http.get<{message: string}>(`${environment.SAVE_URL}ing/save-inventary?loc=${environment.LOC}`)
}

cashInAndOut(data: any, mainServer: any){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/in-and-out`, {data: data, mainServer: mainServer})
}

getUserOrders(userId: string, name: string) {
  let ord: Bill[] = []
  let prod: deletetBillProduct[] = []
  if(userId === 'total'){
    ord = this.orders
    prod = this.delPrd
  } else {
    ord = this.orders.filter(o => {
      if(o.employee){
       return o.employee.user === userId
      } else{
        return o
      }
    })
    prod = this.delPrd.filter(p => {
      if(p.employee){
        return p.employee.name === name
      } else {
        return p
      }
    })
  }
  return {orders: ord, delprod: prod};
}

getAllorders(day: string |undefined, start: string | undefined, end: string | undefined){
  return this.http.post<{orders: Bill[], delProducts: deletetBillProduct[]}>(`${environment.BASE_URL}orders/get-orders`, {loc: environment.LOC, day: day, start: start, end: end})
    .pipe(tap(response => {
      this.orders = response.orders
      this.delPrd =response.delProducts
      this.ordersState.next([...this.orders])
      this.delProdState.next([...this.delPrd])
    }))
}

addUpdateOrders(order: Bill){
  const index = this.orders.findIndex(o => o._id === order._id)
  if(index !== -1){
    this.orders[index] = order
    this.ordersState.next([...this.orders])
  } else {
    this.orders.push(order)
    this.ordersState.next([...this.orders])
  }
}

addDelProduct(product: deletetBillProduct){
  const index = this.delPrd.findIndex(p => p._id === product._id)
  if(index !== -1){
    this.delPrd[index] = product
    this.delProdState.next([...this.delPrd])
  } else {
    this.delPrd.push(product)
    this.delProdState.next([...this.delPrd])
  }
}

changePaymnetMethod(bill: Bill){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/change-payment-method`, {bill: bill})
}

reprintBill(bill: string, mainServer: any){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/reprint-fiscal`, {bill: bill, mode: true, mainServer: mainServer})
}

printNefiscal(bill: string, mainServer: any){
  return this.http.post<{message: string}>(`${environment.BASE_URL}pay/print-unreg`, {bill: bill, mainServer: mainServer})
}

removeProductDiscount(data: any){
  return this.http.post(`${environment.BASE_URL}product/disc-prod`, {data: data})
}

createInvoice(orderId: string, userId: string, clientId: string, locId: string){
  return this.http.post(`${environment.BASE_URL}orders/invoice`, {orderId, userId, clientId, locId}, { responseType: 'arraybuffer'})
}

printReport(report: any){
  return this.http.post<{message: string}>(`${environment.BASE_URL}print/report`, {report: report})
}

saveEntry(entry: any){
  return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
}

saveCigInv(sheet: cigarsInv){
  return this.http.post<{first: cigarsInv, second: cigarsInv, message: string}>(`${environment.BASE_URL}ing/smoke`, {sheet: sheet})
}

getLastCigInv(mode: string){
  return this.http.get<cigarsInv[]>(`${environment.BASE_URL}ing/smoke?loc=${environment.LOC}&point=${environment.POINT}&mode=${mode}`)
}

updateFound(sheet: cigarsInv){
  return this.http.put<{message: string, sheet: cigarsInv}>(`${environment.BASE_URL}ing/smoke`, {sheet: sheet})
}


}
