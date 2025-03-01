import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'
import { Nir } from "src/app/models/nir.model";
import { Record, Suplier } from "src/app/models/suplier.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptyNir } from "src/app/models/empty-models";




@Injectable({providedIn: 'root'})



export class NirsService{

  private nirsState!: BehaviorSubject<Nir[]>;
  public nirsSend$!: Observable<Nir[]>;
  nirs: Nir[] = [emptyNir()];

  constructor(
    private http: HttpClient
  ){
    this.nirsState = new BehaviorSubject<Nir[]>([emptyNir()]);
    this.nirsSend$ =  this.nirsState.asObservable();
  }


  printNir(id: string){
    return this.http.get(`${environment.BASE_URL}nir/print-nir?id=${id}`, { responseType: 'arraybuffer' })
  }

  getNirs(){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/get-nirs`, {loc: environment.LOC})
        .pipe(tap(nirs => {
          this.nirs = nirs
          this.nirsState.next([...this.nirs])
        }))
  }

  deleteNirs(ids: string[]){
    return this.http.put<{message: string}>(`${environment.BASE_URL}nir/delete-nirs`, {ids: ids})
  }


  deleteNir(id: string) {
    return this.http.delete<{message: string}>(`${environment.BASE_URL}nir/nir?id=${id}&loc=${environment.LOC}`)
        .pipe(tap(response => {
          if(response){
            const index = this.nirs.findIndex(n => n._id === id)
            if(index !== -1){
              this.nirs.splice(index, 1)
              this.nirsState.next([...this.nirs])
            }
          }
        }))
  }

  exportNirs(startDate: any, endDate: any, loc: string){
    return this.http.post(`${environment.BASE_URL}nir/export-xcel`, {startDate: startDate, endDate: endDate, loc: loc}, { responseType: 'blob',})
  }

  getNirsByDate(startDate: any, endDate: any, loc: string){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/get-nirs-by-date`, {startDate, endDate, loc})
            .pipe(tap(nirs => {
              this.nirs = nirs
              this.nirsState.next([...this.nirs])
            }))
  }


  getnirsBySuplier(id: string){
    return this.http.get<Nir[]>(`${environment.BASE_URL}nir/get-nirs?id=${id}`)
        .pipe(tap(nirs => {
          this.nirs = nirs
          this.nirsState.next([...this.nirs])
        }))
  }


  updateDocPaymentStatus(update: boolean, id: string[], type: string){
    return this.http.post<{message: string, nirs: Nir[]}>(`${environment.BASE_URL}nir/pay`, {update, id, type})
        .pipe(tap(response => {
          this.nirs = this.nirs.map(nir => {
            const updatedNir = response.nirs.find(n => n._id === nir._id)
            if(updatedNir){
             return nir = updatedNir
            } else {
             return nir
            }
         })
         this.nirsState.next([...this.nirs])
        }))
  }

  updateNirEFacturaStatus(nirId: string, eFatcturaID: string){
    return this.http.put<Nir>(`${environment.BASE_URL}nir/update`, {nirId: nirId, id: eFatcturaID})
        .pipe(tap(nir => {
            const index = this.nirs.findIndex(n => n._id === nirId)
            this.nirs[index] = nir
            this.nirsState.next([...this.nirs])
        }))
  }

  updateSuplierRecords(id: string, record: Record){
    return this.http.put<{message: string, suplier: Suplier}>(`${environment.BASE_URL}suplier/add-record`, {id, record})
  }

  saveNir(nir: Nir){
    return this.http.post<{message: string, nir: Nir}>(`${environment.BASE_URL}nir/save-nir`, {nir: nir, loc: environment.LOC})
        .pipe(tap(response => {
          if(response && response.nir){
            this.nirs.unshift(response.nir)
            this.nirsState.next([...this.nirs])
          }
        }))
  }

  updateNirsBySuplier(id: string){
    return this.http.post<Nir[]>(`${environment.BASE_URL}nir/update`, {id: id})
  }
}
