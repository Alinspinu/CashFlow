import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { SalePoint } from '../models/sale-point';
import { emptySalePoint } from '../models/empty-models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class PointService {



  private pointsState!: BehaviorSubject<SalePoint[]>;
  public pointsSend$!: Observable<SalePoint[]>;
  private pointState!: BehaviorSubject<SalePoint>;
  public pointSend$!: Observable<SalePoint>;
  point: SalePoint = emptySalePoint()
  points: SalePoint[] = [emptySalePoint()]


  constructor(
    private http: HttpClient,
  ){
    this.pointsState = new BehaviorSubject<SalePoint[]>([emptySalePoint()]);
    this.pointsSend$ =  this.pointsState.asObservable();
    this.pointState = new BehaviorSubject<SalePoint>(emptySalePoint());
    this.pointSend$ =  this.pointState.asObservable();
  }

  getTrueSalePoint(){
    return this.http.get<SalePoint[]>(`${environment.BASE_URL}auth/sale-point?loc=${environment.LOC}`).pipe(take(1), tap(points => {
        this.points = points
        this.pointsState.next(this.points)
    }))
  }

  selectPoint(salePoint: string){
        const point = this.points.find(p =>  p._id === salePoint)
        if(point){
            this.point = point
            this.pointState.next(this.point)
        }
  }

}
