import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { Inventary } from '../../models/inventary.model';
import { Preferences } from '@capacitor/preferences';




@Injectable({providedIn: 'root'})



export class InventaryService{

  url: string = environment.BASE_URL

  constructor(
    private http: HttpClient,
    ){
    }


    getInventary(id: string){
      const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
      return this.http.get<Inventary>(`${this.url}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}`, {headers})
    }

    getAllInventary(id: string){
      const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
      return this.http.get<Inventary[]>(`${this.url}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}`, {headers})
    }

    saveOrUpdateInventary(date: string){
      const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
      return this.http.post<{message: string, inv: Inventary}>(`${this.url}ing/save-inv`, {date: date, loc: environment.LOC}, {headers})
    }

    updateIngQty(id: string){
      const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
      return this.http.post<{message: string, inv: Inventary}>(`${this.url}ing/update-ingredient-quantity`, {inventaryId: id}, {headers})
    }


    exportInv(inventaryId: string){
      const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
      return this.http.get(`${this.url}print/inventary?id=${inventaryId} `, {responseType: 'blob', headers: headers})
    }

}
