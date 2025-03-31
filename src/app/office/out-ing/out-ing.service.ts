import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";





@Injectable({providedIn: 'root'})


export class SheetService{
  url: string = environment.BASE_URL
    constructor(
      private http: HttpClient
    ){}

addSheet(sheet: any){
  return this.http.post<{sheet: any, message: string}>(`${this.url}ing/sheet`, {sheet: sheet})
}

deleteSheet(id: string){
  return this.http.delete<{message: string}>(`${this.url}ing/sheet?id=${id}`)
}

getSheets(){
  return this.http.get<{sheets: any[]}>(`${this.url}ing/sheet?loc=${environment.LOC}`)
}


}
