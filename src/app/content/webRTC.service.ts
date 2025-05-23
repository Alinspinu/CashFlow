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
  private delProduct = new Subject<any>();
  private readCard = new Subject<any>();

  constructor() {
    this.socket = io('https://socket.flowmanager.ro');

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
    this.socket.on('delProduct', (data: any) => {
      this.delProduct.next(data)
    })
    this.socket.on('readCard', (data: any) => {
      this.readCard.next(data)
    })
  }

  printOrder(doc: string) {
    // this.socket.emit('printOrder', doc);
  }

  printBill(doc: string) {
    // this.socket.emit('printBill', doc);
  }

  connectToReader(doc: string){
    this.socket.emit('readCard', doc)
  }




  sendBill(doc: string) {
    this.socket.emit('billl', doc);
  }

  sendProductData(data: any) {
    this.socket.emit('productAdded', data);
  }

  getUserTip(data: any) {
    this.socket.emit('getUserTip', data);
  }

  inviteUserToTip(data: any) {
    this.socket.emit('inviteToTip', data);
  }

  sendOrderOutside(data: any) {
    this.socket.emit('outsideOrder', data)
  }


  getCardData(){
    return this.readCard.asObservable()
  }

  getDelProduct(){
    return this.delProduct.asObservable()
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


