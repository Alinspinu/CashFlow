import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";

import { environment } from "src/environments/environment";
import { Day, emptyDay } from "./cash-register.model";



@Injectable({providedIn: 'root'})



export class CashRegisterService{

  balckList: string[] = [];

  private entriesState!: BehaviorSubject<Day[]>;
  public entriesSend$!: Observable<Day[]>;
  entries: Day[] = [emptyDay()]

  constructor(
    private http: HttpClient
  ){
    this.entriesState = new BehaviorSubject<Day[]>([emptyDay()]);
    this.entriesSend$ =  this.entriesState.asObservable();
  }

    exportRegister(startDate: any, endDate: any,  point: string){
      return this.http.post(`${environment.BASE_URL}register/create-xcel`,{startDate: startDate, endDate: endDate, loc: environment.LOC, point: point},{responseType: 'blob'})
    }

    getDocuments(point: string): Observable<{message: string, documents: Day[]}> {
      return this.http.get<{message: string, documents: Day[]}>(`${environment.BASE_URL}register/show-cash-register?loc=${environment.LOC}&point=${point}`)
        .pipe(tap(res => {
          this.entries = res.documents
          this.entriesState.next(this.entries)
        }))
    }

    deleteEntry(id: string, eIndex: number, dayIndex: number){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}register/delete-entry?id=${id}`)
        .pipe(tap(res => {
          const day = this.entries[dayIndex]
          const entry = day.entry[eIndex];
          day.cashOut = day.cashOut - entry.amount
          day.entry.splice(eIndex, 1)
          this.entriesState.next(this.entries)
        }))

    }

    getDaysByDate(startDate: any, endDate: any, loc: string, point: string){
      return this.http.post<{message: string, documents: Day[]}>(`${environment.BASE_URL}register/get-days`,{startDate: startDate, endDate: endDate, loc: loc, point: point})
    }

    addEntry(entry: any){
      return this.http.post<Day>(`${environment.BASE_URL}register/add-entry`, entry)
        .pipe(tap(res => {
          const dayIndex = this.entries.findIndex(el => el.date === res.date)
          this.entries[dayIndex] = res
          this.entriesState.next(this.entries)
        }))
    }
 
    deleteDay(id: string){
      return this.http.delete<{message: string}>(`${environment.BASE_URL}register/day?id=${id}`)
        .pipe(tap(res => {
          const index = this.entries.findIndex(e => e._id === id )
          this.entries.slice(index, 1)
          this.entriesState.next(this.entries)
        }))
    }

}







