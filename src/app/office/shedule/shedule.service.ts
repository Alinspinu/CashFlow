import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { Shedule } from '../../models/shedule.model';
import { emptyShedule } from '../../models/empty-models';
import { BehaviorSubject, Observable, take, tap, of } from 'rxjs';



@Injectable({providedIn: 'root'})


export class SheduleService{

  private sheduleState!: BehaviorSubject<Shedule>;
  public sheduleSend$!: Observable<Shedule>;
  shedule: Shedule = emptyShedule();

  constructor(
    private http: HttpClient,
  ){
    this.sheduleState = new BehaviorSubject<Shedule>(emptyShedule());
    this.sheduleSend$ =  this.sheduleState.asObservable();
  }




getLastShedule(){
  return this.http.get<Shedule>(`${environment.BASE_URL}shedule?loc=${environment.LOC}&shedule=last`)
      .pipe(tap(response => {
        console.log(response)
        this.shedule = response
        this.sheduleState.next(this.shedule)
  }))
}

getAllShedules(){
  return this.http.get<Shedule[]>(`${environment.BASE_URL}shedule?loc=${environment.LOC}&shedule=all`)
}

addEntry(user: any, day: any, month: string, dayValue: number){
    return this.http.put<Shedule>(`${environment.BASE_URL}shedule`, {sheduleId: this.shedule._id, day, user, month, dayValue, loc: environment.LOC})
    .pipe(tap(response => {
      if(response){
        this.shedule = response
        console.log('add entry', this.shedule)
        this.sheduleState.next(this.shedule)
      }
    }))
}

addShedule(){
  return this.http.post<Shedule>(`${environment.BASE_URL}shedule`, {loc: environment.LOC, salePoint: environment.POINT})
}

selectShedule(shedule: Shedule){
  this.shedule = shedule
  console.log(this.shedule)
  this.sheduleState.next(this.shedule)
}

deleteEntry(userId: any, day: string, month: string, dateStr: string){
  return this.http.delete<Shedule>(`${environment.BASE_URL}shedule?sheduleId=${this.shedule._id}&userId=${userId}&day=${day}&month=${month}&dateStr=${dateStr}&loc=${environment.LOC}`)
  .pipe(tap(response => {
    if(response){
      this.shedule = response
      this.sheduleState.next(this.shedule)
    }
  }))

}

updateUserWorkLog(userId: string, workLog: any){
  return this.http.put(`${environment.BASE_URL}users/work-log`,{userId, workLog})
}

deleteUserWorkEntry(userId: string, day: any){
    return this.http.post(`${environment.BASE_URL}users/work-log`, {userId, day})
}



}
