import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ImpSheet } from "src/app/models/nir.model";
import { environment } from "src/environments/environment";




@Injectable({providedIn: 'root'})


export class ImpService{
    constructor(
      private http: HttpClient
    ){}



    getSheets(point: string){
      return this.http.get<ImpSheet[]>(`${environment.BASE_URL}nir/sheet?loc=${environment.LOC}&point=${point}`)
    }

    saveSheet(sheet: ImpSheet){
        return this.http.post<{sheet: ImpSheet, message: string}>(`${environment.BASE_URL}nir/sheet`, {sheet: sheet})
    }

    deleteSheet(id: string | undefined){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}nir/sheet?id=${id}`)
    }
}
