import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Suplier } from "src/app/models/suplier.model";




@Injectable({providedIn: 'root'})


export class SupliersService{

constructor(
  private http: HttpClient
){}

getSupliers(){
  return this.http.get<Suplier[]>(`${environment.BASE_URL}suplier/get-supliers?loc=${environment.LOC}`)
}


deleteSuplier(id: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}suplier/remove-suplier?suplierId=${id}`)
}

editSuplier(suplierId: string, update: any){
  return this.http.put<{message: string, suplier: Suplier}>(`${environment.BASE_URL}suplier/update-suplier`, {suplierId, update})
}

getSuplier(id: string){
  return this.http.get<Suplier>(`${environment.BASE_URL}suplier/get-suplier?suplierId=${id}`)
}

addRecord(record: any, suplierId: string){
  return this.http.post<any>(`${environment.BASE_URL}suplier/add-record`, {record, suplierId})
}

deleteRecord(suplierId: string, docId: string, amount: number){
  return this.http.put<{message: string}>(`${environment.BASE_URL}suplier/remove-record`, {suplierId, docId, amount })
}

}
