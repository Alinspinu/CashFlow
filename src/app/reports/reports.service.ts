import { HttpClient, HttpParams } from "@angular/common/http";
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

 getOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string, point: string): Observable<any>{
  return this.http.post<any>(`${environment.BASE_URL}orders/get-orders`, {start: start, end: end, loc: locatie, day: day, point: point})
 }
 getDep(start: string | undefined, end: string | undefined, point: string): Observable<any>{
  return this.http.get<any>(`${environment.BASE_URL}orders/dep?start=${start}&end=${end}&loc=${environment.LOC}&point=${point}`)
 }
 getHavyOrders(start: string | undefined, end: string | undefined, day: string | undefined, locatie: string, filter: any, report: string, point: string): Observable<any>{
  return this.http.post<any>(`${environment.BASE_URL}orders/get-havy-orders`, {start: start, end: end, loc: locatie, day: day, filter, report: report, point: point})
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

 getReport(startDate: string | undefined, endDate: string | undefined, point: string){
  return this.http.get<any>(`${environment.BASE_URL}report?startDate=${startDate}&endDate=${endDate}&loc=${environment.LOC}&point=${point}`)
 }

 getReports(point: string){
  const params = new HttpParams()
    .set('loc', environment.LOC)
    .set('point', point)
  return this.http.get<any[]>(`${environment.BASE_URL}report/all`, {params})
 }

 deleteReport(reportId: string){
  const params = new HttpParams()
    .set('id', reportId)
  return this.http.delete<{message: string}>(`${environment.BASE_URL}report/delete`, {params})
 }

 deleteReports(start: string, end: string, point: string){
  const params = new HttpParams()
    .set('start', start)
    .set('end', end)
    .set('loc', environment.LOC)
    .set('point', point)
  return this.http.delete<{message: string}>(`${environment.BASE_URL}report/all`, {params})
 }

 saveReport(report: Report){
  return this.http.post<{message: string, report: Report}>(`${environment.BASE_URL}report`, {report: report})
 }

 getLastReport(point: string){
  return this.http.get<Report>(`${environment.BASE_URL}report/last?loc=${environment.LOC}&point=${point}`)
 }

 getReportsDate(point: string){
  const params = new HttpParams()
    .set('loc', environment.LOC)
    .set('point', point)
  return this.http.get<{start: string, end: string}>(`${environment.BASE_URL}report/dates`, {params})
 }



}
