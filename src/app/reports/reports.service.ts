import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Bill } from "../models/table.model";

import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { Report } from "../models/report.model";



@Injectable({providedIn: 'root'})



export class ReportsService{


  constructor(
    private http: HttpClient,
    ){
    }

 getOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string): Observable<any>{
  return this.http.post<any>(`${environment.BASE_URL}orders/get-orders`, {start: start, end: end, loc: locatie, day: day})
 }
 getDep(start: string | undefined, end: string | undefined): Observable<any>{
  return this.http.get<any>(`${environment.BASE_URL}orders/dep?start=${start}&end=${end}&loc=${environment.LOC}`)
 }
 getHavyOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string, filter: any, report: string): Observable<any>{
  return this.http.post<any>(`${environment.BASE_URL}orders/get-havy-orders`, {start: start, end: end, loc: locatie, day: day, filter, report: report})
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

 getReport(startDate: string | undefined, endDate: string | undefined){
  return this.http.get<any>(`${environment.BASE_URL}report?startDate=${startDate}&endDate=${endDate}&loc=${environment.LOC}`)
 }
 getReports(){
  return this.http.get<any[]>(`${environment.BASE_URL}report/all?loc=${environment.LOC}`)
 }

 deleteReport(reportId: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}report/delete?id=${reportId}`)
 }

 getReportsDate(){
  return this.http.get<{start: string, end: string}>(`${environment.BASE_URL}report/dates?loc=${environment.LOC}`)
 }



}
