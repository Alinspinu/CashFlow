import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private orderIndexState!: BehaviorSubject<number>;
  public orderIndexSend$!: Observable<number>;
  // private productCountState!: BehaviorSubject<number>;
  // public productCountSend$!: Observable<number>;



  constructor(
  ){
    this.orderIndexState = new BehaviorSubject<number>(0);
    this.orderIndexSend$ =  this.orderIndexState.asObservable();
    // this.productCountState = new BehaviorSubject<number>(0);
    // this.productCountSend$ =  this.orderIndexState.asObservable();
  }

setOrderIndex(index: number){
  this.orderIndexState.next(index)
}

// setProductCount(count: number){
//   this.productCountState.next(count)
// }


}
