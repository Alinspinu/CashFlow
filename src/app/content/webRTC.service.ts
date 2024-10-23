import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private socket: any;
  private productAddedSubject = new Subject<any>();
  private getUserTipSubject = new Subject<any>();
  private inviteUserToTipSubject = new Subject<any>();
  private getOnlineOrderIdSubject = new Subject<any>();
  private getOutsideOrder = new Subject<any>();
  private getUpdatadOrder = new Subject<any>();
  private getTableBillId = new Subject<any>();

  constructor() {
    this.socket = io('https://live669-0bac3349fa62.herokuapp.com');
    // this.socket = io('http://localhost:8090');

    this.socket.on('productAdded', (data: any) => {
      this.productAddedSubject.next(data);
    });
    this.socket.on('getUserTip', (data: any) => {
      this.getUserTipSubject.next(data);
    });
    this.socket.on('inviteToTip', (data: any) => {
      this.inviteUserToTipSubject.next(data);
    });
    this.socket.on('orderId', (data: any) => {
      this.getOnlineOrderIdSubject.next(data);
    });
    this.socket.on('billl', (data: any) => {
      this.getUpdatadOrder.next(data);
    })
    this.socket.on('tableBillId', (data: any) => {
      this.getTableBillId.next(data);
    })
    this.socket.on('outsideOrder', (data: any) => {
      this.getOutsideOrder.next(data)
    })
  }

  printOrder(doc: string) {
    // this.socket.emit('printOrder', doc);
  }

  printBill(doc: string) {
    // this.socket.emit('printBill', doc);
  }




  sendBill(doc: string) {
    // this.socket.emit('billl', doc);
  }

  sendProductData(data: any) {
    // this.socket.emit('productAdded', data);
  }

  getUserTip(data: any) {
    // this.socket.emit('getUserTip', data);
  }

  inviteUserToTip(data: any) {
    // this.socket.emit('inviteToTip', data);
  }

  sendOrderOutside(data: any) {
    // this.socket.emit('outsideOrder', data)
  }



  getOrderToPrint(){
    return this.getOutsideOrder.asObservable()
  }

  getInviteToTip(){
    return this.inviteUserToTipSubject.asObservable();
  }

  getTableBillIdObservable() {
    return this.getTableBillId.asObservable();
  }

  getProductAddedObservable() {

    return this.productAddedSubject.asObservable();
  }

  getUpdatedOrderObservable(){
    return this.getUpdatadOrder.asObservable()
  }

  getUserTipObservable() {
    return this.getUserTipSubject.asObservable();
  }

  getOdrerIdObservable() {
    return this.getOnlineOrderIdSubject.asObservable();
  }

}



  // printOrder(doc: string): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.emit('printOrder', doc);
  //     this.socket.on('orderProcessed', (response:any) => {
  //       observer.next(response);
  //       observer.complete();
  //     });

  //     this.socket.on('connect_error', (error: any) => {
  //       observer.error(error);
  //     });
  //   });
  // }

  // printBill(doc: string): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.emit('printBill', doc);
  //     this.socket.on('billProcessed', (response:any) => {
  //       observer.next(response);
  //       observer.complete();
  //     });

  //     this.socket.on('connect_error', (error: any) => {
  //       observer.error(error);
  //     });
  //   });
  // }
