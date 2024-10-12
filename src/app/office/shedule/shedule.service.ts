import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { Shedule } from '../../models/shedule.model';
import { emptyShedule } from '../../models/empty-models';
import { BehaviorSubject, Observable, take, tap, of } from 'rxjs';
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})


export class SheduleService{

  private sheduleState!: BehaviorSubject<Shedule>;
  public sheduleSend$!: Observable<Shedule>;
  shedule: Shedule = emptyShedule();

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient,
  ){
    this.sheduleState = new BehaviorSubject<Shedule>(emptyShedule());
    this.sheduleSend$ =  this.sheduleState.asObservable();
  }




  private createBasicAuthHeader(): HttpHeaders {
    const credentials = btoa(`${environment.API_USER}:${environment.API_PASSWORD}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'bypass-tunnel-reminder': 'true'
    });
  }

getLastShedule(){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
  return this.http.get<Shedule>(`${this.url}shedule?loc=${environment.LOC}&shedule=last`, {headers})
      .pipe(tap(response => {
        this.shedule = response
        this.sheduleState.next(this.shedule)
  }))
}

getAllShedules(){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
  return this.http.get<Shedule[]>(`${this.url}shedule?loc=${environment.LOC}&shedule=all`, {headers})
}

addEntry(user: any, day: any, month: string, dayValue: number){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
    return this.http.put<Shedule>(`${this.url}shedule`, {sheduleId: this.shedule._id, day, user, month, dayValue, loc: environment.LOC}, {headers})
    .pipe(tap(response => {
      if(response){
        this.shedule = response
        this.sheduleState.next(this.shedule)
      }
    }))
}

addShedule(){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
  return this.http.post<Shedule>(`${this.url}shedule`, {loc: environment.LOC})
}

selectShedule(shedule: Shedule){
  this.shedule = shedule
  this.sheduleState.next(this.shedule)
}

deleteEntry(userId: any, day: string, month: string, dateStr: string){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
  return this.http.delete<Shedule>(`${this.url}shedule?sheduleId=${this.shedule._id}&userId=${userId}&day=${day}&month=${month}&dateStr=${dateStr}&loc=${environment.LOC}`, {headers})
  .pipe(tap(response => {
    if(response){
      this.shedule = response
      this.sheduleState.next(this.shedule)
    }
  }))

}

updateUserWorkLog(userId: string, workLog: any){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
  return this.http.put(`${this.url}users/work-log`,{userId, workLog}, {headers})
}

deleteUserWorkEntry(userId: string, day: any){
  const  headers: HttpHeaders = this.createBasicAuthHeader()
    return this.http.post(`${this.url}users/work-log`, {userId, day}, {headers})
}



}
