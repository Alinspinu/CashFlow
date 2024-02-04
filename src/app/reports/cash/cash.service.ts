import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bill } from "../../models/table.model";

import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class CashService{


  constructor(
    private http: HttpClient,
    ){
    }

 getOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string){
  return this.http.post<{orders: Bill[], delProducts: any[]}>(`${environment.BASE_URL_CAFETISH}orders/get-orders`, {start: start, end: end, loc: locatie, day: day})
 }
}
