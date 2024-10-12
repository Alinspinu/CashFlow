import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { Inventary } from '../../models/inventary.model';




@Injectable({providedIn: 'root'})



export class InventaryService{


  constructor(
    private http: HttpClient,
    ){
    }

    getInventary(id: string){
      return this.http.get<Inventary>(`${environment.BASE_URL}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}`)
    }

    getAllInventary(id: string){
      return this.http.get<Inventary[]>(`${environment.BASE_URL}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}`)
    }

    saveOrUpdateInventary(date: string){
      return this.http.post<{message: string, inv: Inventary}>(`${environment.BASE_URL}ing/save-inv`, {date: date, loc: environment.LOC})
    }

    updateIngQty(id: string){
      return this.http.post<{message: string, inv: Inventary}>(`${environment.BASE_URL}ing/update-ingredient-quantity`, {inventaryId: id})
    }

    exportInv(inventaryId: string){
      return this.http.get(`${environment.BASE_URL}print/inventary?id=${inventaryId} `, {responseType: 'blob'})
    }
}
