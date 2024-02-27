
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, map, Observable, Subject, take, tap } from "rxjs";



@Injectable({providedIn: 'root'})



export class MobileService{

  private orderIndexState!: BehaviorSubject<number>;
  public orderIndexSend$!: Observable<number>;
  orderIndex: number = -1;


  constructor(){
    this.orderIndexState = new BehaviorSubject<number>(-1);
    this.orderIndexSend$ =  this.orderIndexState.asObservable();
  }


  sendData(orderIndex: number) {
    this.orderIndex = orderIndex + 1
    this.orderIndexState.next(this.orderIndex);
    console.log(this.orderIndex)
    // console.log(this.orderIndexState)
  }

}
