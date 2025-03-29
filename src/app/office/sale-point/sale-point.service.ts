import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'

import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptySalePoint } from "src/app/models/empty-models";
import { SalePoint } from "src/app/models/sale-point";




@Injectable({providedIn: 'root'})



export class SalePointService{

  private pointsState!: BehaviorSubject<SalePoint[]>;
  public pointsSend$!: Observable<SalePoint[]>;
  points: SalePoint[] = [emptySalePoint()];

  constructor(
    private http: HttpClient
  ){
    this.pointsState = new BehaviorSubject<SalePoint[]>([emptySalePoint()]);
    this.pointsSend$ =  this.pointsState.asObservable();
  }


  getPoints(){
    return this.http.get<SalePoint[]>(`${environment.BASE_URL}users/sale-point?loc=${environment.LOC}`)
        .pipe(tap(points => {
            this.points = points
            this.pointsState.next([...this.points])
        }))
  }

  deletePoint(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}/users/sale-point?id=${id}`)
        .pipe(tap(response => {
          const index = this.points.findIndex(p => p._id === id)
          if(index !== -1){
            this.points.splice(index, 1)
            this.pointsState.next([...this.points])
          }
        }))
  }

  addSalePoint(salePoint: SalePoint){
    return this.http.post<SalePoint>(`${environment.BASE_URL}users/sale-point`, {salePoint: salePoint})
        .pipe(tap(point => {
          this.points.push(point)
          this.pointsState.next([...this.points])
        }))
  }



}
