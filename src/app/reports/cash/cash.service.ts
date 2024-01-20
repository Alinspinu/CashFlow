import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Bill } from "src/app/models/table.model";


import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class CashService{


  constructor(
    private http: HttpClient,
    ){
    }

 getOrders(start: string, end: string, loc: string){
  return this.http.post<Bill[]>(`${environment.BASE_URL}orders/get-orders`, {start: start, end: end, loc: loc})
 }
}
