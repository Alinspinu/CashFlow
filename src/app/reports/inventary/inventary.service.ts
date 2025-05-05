import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { Observable, tap } from "rxjs";
import { CompareInv, Inventary } from '../../models/inventary.model';




@Injectable({providedIn: 'root'})



export class InventaryService{


  constructor(
    private http: HttpClient,
    ){
    }

    getInventary(id: string, point: string){
      return this.http.get<Inventary>(`${environment.BASE_URL}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}&point=${point}`)
    }

    getAllInventary(id: string, point: string){
      return this.http.get<Inventary[]>(`${environment.BASE_URL}ing/get-inventary?inventaryId=${id}&loc=${environment.LOC}&point=${point}`)
    }

    saveOrUpdateInventary(date: string, point: string){
      return this.http.post<{message: string, inv: Inventary}>(`${environment.BASE_URL}ing/save-inv`, {date: date, loc: environment.LOC, point: point})
    }

    updateIngQty(id: string, point: string){
      return this.http.post<{message: string, inv: Inventary}>(`${environment.BASE_URL}ing/update-ingredient-quantity`, {inventaryId: id, point: point})
    }

    exportInv(inventaryId: string){
      return this.http.get(`${environment.BASE_URL}print/inventary?id=${inventaryId} `, {responseType: 'blob'})
    }

    compareInventary(start: string, end: string, point: string){
      return this.http.post<{compareInv: CompareInv}>(`${environment.BASE_URL}ing/compare-inv`, {start, end, loc: environment.LOC, point: point})
    }

    deleteLog(logID: string, ingID: string){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/log?ingID=${ingID}&logID=${logID}`)
    }
}
