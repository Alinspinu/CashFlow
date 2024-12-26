import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Suplier } from "src/app/models/suplier.model";




@Injectable({providedIn: 'root'})


export class SupliersService{
  url: string = environment.BASE_URL
constructor(
  private http: HttpClient
){
}


getSupliers(){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<Suplier[]>(`${this.url}suplier/get-supliers?loc=${environment.LOC}`, {headers})
}


deleteSuplier(id: string){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.delete<{message: string}>(`${this.url}suplier/remove-suplier?suplierId=${id}`, {headers})
}

editSuplier(suplierId: string, update: any){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.put<{message: string, suplier: Suplier}>(`${this.url}suplier/update-suplier`, {suplierId, update}, {headers})
}

getSuplier(id: string){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<Suplier>(`${this.url}suplier/get-suplier?suplierId=${id}`, {headers})
}

addRecord(record: any, suplierId: string){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post<any>(`${this.url}suplier/add-record`, {record, suplierId}, {headers})
}

deleteRecord(suplierId: string, docId: string, amount: number){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.put<{message: string}>(`${this.url}suplier/remove-record`, {suplierId, docId, amount }, {headers})
}

}
