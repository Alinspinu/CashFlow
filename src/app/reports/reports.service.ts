import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { Bill } from "../models/table.model";

import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { Report } from "../models/report.model";
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})



export class ReportsService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient,
    ){
    }




 getOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string): Observable<any>{
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post<any>(`${this.url}orders/get-orders`, {start: start, end: end, loc: locatie, day: day}, {headers})
 }
 getDep(start: string | undefined, end: string | undefined): Observable<any>{
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<any>(`${this.url}orders/dep?start=${start}&end=${end}&loc=${environment.LOC}`, {headers})
 }
 getHavyOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string, filter: any, report: string): Observable<any>{
  const  headers: HttpHeaders = new HttpHeaders({
    'bypass-tunnel-reminder': 'true'
  });
  return this.http.post<any>(`${this.url}orders/get-havy-orders`, {start: start, end: end, loc: locatie, day: day, filter, report: report}, {headers})
 }

 printProducts(products: string, start: string | undefined, end: string | undefined){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post(`${this.url}print/products`, {products: products, startDay: start, endDay: end}, {responseType: 'blob', headers: headers})
 }
 printConsumtion(ings: string, start: string | undefined, end: string | undefined){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post(`${this.url}print/consumption`, {ings: ings, startDay: start, endDay: end}, {responseType: 'blob', headers: headers})
 }
 printProduction(products: string, start: string | undefined, end: string | undefined){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post(`${this.url}print/production`, {products: products, startDay: start, endDay: end}, {responseType: 'blob', headers: headers})
 }

 getReport(startDate: string | undefined, endDate: string | undefined){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<any>(`${this.url}report?startDate=${startDate}&endDate=${endDate}&loc=${environment.LOC}`, {headers})
 }
 getReports(){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<any[]>(`${this.url}report/all?loc=${environment.LOC}`, {headers})
 }



}
