import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { Pontaj } from '../../models/shedule.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { emptyPontaj } from '../../models/empty-models';



@Injectable({providedIn: 'root'})


export class PontajService{

  private pontajState!: BehaviorSubject<Pontaj>;
  public pontajSend$!: Observable<Pontaj>;
  pontaj: Pontaj = emptyPontaj();

  constructor(
    private http: HttpClient,
  ){
    this.pontajState = new BehaviorSubject<Pontaj>(emptyPontaj());
    this.pontajSend$ =  this.pontajState.asObservable();
  }


  getLastPontaj(point: string){
    return this.http.get<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&pont=last&point=${point}`)
          .pipe(tap(response => {
            this.pontaj = response
            this.pontajState.next(this.pontaj)
      }))
  }

  getAllPont(point: string){
    return this.http.get<Pontaj[]>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&pont=all&point=${point}`)
  }

  getPontByMonth(month: string, point: string){
    return this.http.get<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&month=${month}&point=${point}`)
  }

  paySalary(entry: any){
    return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
  }

  addPont(month: number, year: number, point: string){
    return this.http.post<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}`, {month, year, loc: environment.LOC, salePoint: point})
  }

  deletePont(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}shedule/pontaj?id=${id}`)
  }

  selectPontaj(pontaj: Pontaj){
    this.pontaj = pontaj
    this.pontajState.next(this.pontaj)
  }

  deletePayLog(payID: string, userID: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}users/work-log?userID=${userID}&payID=${payID}`)
  }



}
