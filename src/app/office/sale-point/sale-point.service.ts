import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'

import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptySalePoint } from "src/app/models/empty-models";
import { SalePoint } from "src/app/models/sale-point";
import { Preferences } from "@capacitor/preferences";




@Injectable({providedIn: 'root'})



export class SalePointService{

  private pointsState!: BehaviorSubject<SalePoint[]>;
  public pointsSend$!: Observable<SalePoint[]>;
  private pointState!: BehaviorSubject<SalePoint>;
  public pointSend$!: Observable<SalePoint>;
  point: SalePoint = emptySalePoint()
  points: SalePoint[] = [emptySalePoint()];

  constructor(
    private http: HttpClient
  ){
    this.pointsState = new BehaviorSubject<SalePoint[]>([emptySalePoint()]);
    this.pointsSend$ =  this.pointsState.asObservable();
    this.pointState = new BehaviorSubject<SalePoint>(emptySalePoint());
    this.pointSend$ =  this.pointState.asObservable();
  }


  getPoints(){
    return this.http.get<SalePoint[]>(`${environment.BASE_URL}users/sale-point?loc=${environment.LOC}`)
        .pipe(tap(points => {
            this.points = points
            this.pointsState.next([...this.points])
        }))
  }
  getUnAuthPoints(){
    return this.http.get<SalePoint[]>(`${environment.BASE_URL}auth/sale-point?loc=${environment.LOC}`)
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

  editPoint(salePoint: SalePoint){
    return this.http.put<{message: string, point: SalePoint}>(`${environment.BASE_URL}users/sale-point`, {point: salePoint})
      .pipe(tap(point => {
        const index = this.points.findIndex(p => p._id === point.point._id)
        if(index !== -1){
          this.points[index] = point.point
          this.pointsState.next([...this.points])
        }
      }))
  }


  actvatePoint(point: SalePoint){
    const pInd = this.points.findIndex(po => po._id === point._id)
    this.points.forEach(po => po.status = false)
    if(pInd !== -1) {
      this.points[pInd].status = true
      this.point = this.points[pInd]
      Preferences.set({key: 'point', value: JSON.stringify(this.point)})
      this.pointsState.next(this.points)
      this.pointState.next(this.point)
    }
  }




}
