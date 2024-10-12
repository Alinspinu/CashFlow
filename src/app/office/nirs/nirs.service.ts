import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'
import { Preferences } from '@capacitor/preferences';




@Injectable({providedIn: 'root'})



export class NirsService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient
  ){
  }




  printNir(id: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get(`${this.url}nir/print-nir?id=${id}`, { responseType: 'arraybuffer', headers: headers})
  }

  getNirs(loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{nir: any}[]>(`${this.url}nir/get-nirs`, {loc: loc}, {headers})
  }

  deleteNir(id: string) {
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.delete<{message: string}>(`${this.url}nir/nir?id=${id}&loc=${environment.LOC}`, {headers})
  }

  exportNirs(startDate: any, endDate: any, loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}nir/export-xcel`, {startDate: startDate, endDate: endDate, loc: loc}, { responseType: 'blob', headers: headers})
  }

  getNirsByDate(startDate: any, endDate: any, loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{nir: any}[]>(`${this.url}nir/get-nirs-by-date`, {startDate, endDate, loc}, {headers})
  }
}
