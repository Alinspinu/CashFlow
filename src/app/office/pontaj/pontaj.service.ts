import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { Pontaj } from '../../models/shedule.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { emptyPontaj } from '../../models/empty-models';
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})


export class PontajService{

  private pontajState!: BehaviorSubject<Pontaj>;
  public pontajSend$!: Observable<Pontaj>;
  pontaj: Pontaj = emptyPontaj();

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient,
  ){
    this.pontajState = new BehaviorSubject<Pontaj>(emptyPontaj());
    this.pontajSend$ =  this.pontajState.asObservable();
  }




  getLastPontaj(){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get<Pontaj>(`${this.url}shedule/pontaj?loc=${environment.LOC}&pont=last`, {headers})
          .pipe(tap(response => {
            this.pontaj = response
            this.pontajState.next(this.pontaj)
      }))
  }

  getAllPont(){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get<Pontaj[]>(`${this.url}shedule/pontaj?loc=${environment.LOC}&pont=all`, {headers})
  }

  getPontByMonth(month: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get<Pontaj>(`${this.url}shedule/pontaj?loc=${environment.LOC}&month=${month}`, {headers})
  }

  paySalary(entry: any){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}register/add-entry`, entry, {headers})
  }



  addPont(month: number, year: number){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<Pontaj>(`${this.url}shedule/pontaj?loc=${environment.LOC}`, {month, year, loc: environment.LOC}, {headers})
  }

  deletePont(id: string){
    return this.http.delete<{message: string}>(`${this.url}shedule/pontaj?id=${id}`)
  }

  selectPontaj(pontaj: Pontaj){
    this.pontaj = pontaj
    this.pontajState.next(this.pontaj)
  }



}
