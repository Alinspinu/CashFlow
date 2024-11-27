import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'
import { Nir } from "src/app/models/nir.model";
import { Record, Suplier } from "src/app/models/suplier.model";




@Injectable({providedIn: 'root'})



export class NirsService{

  constructor(
    private http: HttpClient
  ){}


  printNir(id: string){
    return this.http.get(`${environment.BASE_URL}nir/print-nir?id=${id}`, { responseType: 'arraybuffer' })
  }

  getNirs(){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/get-nirs`, {loc: environment.LOC})
  }

  deleteNir(id: string) {
    return this.http.delete<{message: string}>(`${environment.BASE_URL}nir/nir?id=${id}&loc=${environment.LOC}`)
  }

  exportNirs(startDate: any, endDate: any, loc: string){
    return this.http.post(`${environment.BASE_URL}nir/export-xcel`, {startDate: startDate, endDate: endDate, loc: loc}, { responseType: 'blob',})
  }

  getNirsByDate(startDate: any, endDate: any, loc: string){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/get-nirs-by-date`, {startDate, endDate, loc})
  }

  getSuplier(input: any){
    return this.http.post<any[]>(`${environment.BASE_URL}suplier/send-supliers`, {search: input, loc: environment.LOC})
  }

  getnirsBySuplier(id: string){
    const params = new HttpParams()
    .set('id', id)
    return this.http.get<Nir[]>(`${environment.BASE_URL}nir/get-nirs`, {params})
  }

  updateNirsBySuplier(id: string){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/update`, {id: id})
  }

  updateDocPaymentStatus(update: boolean, id: string[], type: string){
    return this.http.post<{message: string, nirs: Nir[]}>(`${environment.BASE_URL}nir/pay`, {update, id, type})
  }

  updateNirEFacturaStatus(nirId: string, eFatcturaID: string){
    return this.http.put<Nir>(`${environment.BASE_URL}nir/update`, {nirId: nirId, id: eFatcturaID})
  }

  updateSuplierRecords(id: string, records: Record[]){
    return this.http.put<{message: string, suplier: Suplier}>(`${environment.BASE_URL}suplier/add-record`, {id, records})
  }
}
