import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'
import { Preferences } from '@capacitor/preferences';




@Injectable({providedIn: 'root'})



export class NirsService{

  url: string = environment.BASE_URL

  constructor(
    private http: HttpClient
  ){
  }




  printNir(id: string){

    return this.http.get(`${this.url}nir/print-nir?id=${id}`, { responseType: 'arraybuffer'})
  }

  getNirs(loc: string){

    return this.http.post<{nir: any}[]>(`${this.url}nir/get-nirs`, {loc: loc})
  }

  deleteNir(id: string) {

    return this.http.delete<{message: string}>(`${this.url}nir/nir?id=${id}&loc=${environment.LOC}`)
  }

  exportNirs(startDate: any, endDate: any, loc: string){

    return this.http.post(`${this.url}nir/export-xcel`, {startDate: startDate, endDate: endDate, loc: loc}, { responseType: 'blob'})
  }

  getNirsByDate(startDate: any, endDate: any, loc: string){

    return this.http.post<{nir: any}[]>(`${this.url}nir/get-nirs-by-date`, {startDate, endDate, loc})
  }
}
