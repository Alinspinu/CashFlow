import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'




@Injectable({providedIn: 'root'})



export class NirsService{

  constructor(
    private http: HttpClient
  ){}


  printNir(id: string){
    return this.http.get(`${environment.BASE_URL}nir/print-nir?id=${id}`, { responseType: 'arraybuffer' })
  }

  getNirs(loc: string){
    return this.http.post(`${environment.BASE_URL}nir/get-nirs`, {loc: loc})
  }

  deleteNir(id: string) {
    return this.http.delete<{message: string}>(`${environment.BASE_URL}nir/nir?id=${id}`)
  }

  exportNirs(startDate: any, endDate: any, loc: string){
    return this.http.post(`${environment.BASE_URL}nir/export-xcel`, {startDate: startDate, endDate: endDate, loc: loc}, { responseType: 'blob',})
  }

  registerEntry(entry: any){
    return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
  }
  payNir(update: boolean, id: string){
    return this.http.post<{message: string}>(`${environment.BASE_URL}nir/pay`, {update: update, id: id})
  }
}
