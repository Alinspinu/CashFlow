import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Bill } from "../models/table.model";

import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class ReportsService{


  constructor(
    private http: HttpClient,
    ){
    }

 getOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string){
  return this.http.post<{orders: Bill[], delProducts: any[]}>(`${environment.BASE_URL}orders/get-orders`, {start: start, end: end, loc: locatie, day: day})
 }

 printProducts(products: string, start: string | undefined, end: string | undefined){
  return this.http.post(`${environment.BASE_URL}print/products`, {products: products, startDay: start, endDay: end}, {responseType: 'blob'})
 }
 printConsumtion(ings: string, start: string | undefined, end: string | undefined){
  return this.http.post(`${environment.BASE_URL}print/consumption`, {ings: ings, startDay: start, endDay: end}, {responseType: 'blob'})
 }
 printProduction(products: string, start: string | undefined, end: string | undefined){
  return this.http.post(`${environment.BASE_URL}print/production`, {products: products, startDay: start, endDay: end}, {responseType: 'blob'})
 }


}
