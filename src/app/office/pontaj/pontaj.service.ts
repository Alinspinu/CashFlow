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


  getLastPontaj(){
    return this.http.get<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&pont=last`)
          .pipe(tap(response => {
            this.pontaj = response
            this.pontajState.next(this.pontaj)
      }))
  }

  getAllPont(){
    return this.http.get<Pontaj[]>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&pont=all`)
  }

  getPontByMonth(month: string){
    return this.http.get<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&month=${month}`)
  }

  paySalary(entry: any){
    return this.http.post(`${environment.BASE_URL}register/add-entry`, entry)
  }



  addPont(month: number, year: number){
    return this.http.post<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}`, {month, year, loc: environment.LOC})
  }

  selectPontaj(pontaj: Pontaj){
    this.pontaj = pontaj
    this.pontajState.next(this.pontaj)
  }



}
