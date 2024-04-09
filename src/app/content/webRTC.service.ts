import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {
  private socket: any;
  private productAddedSubject = new Subject<any>();
  private getUserTipSubject = new Subject<any>();
  private inviteUserToTipSubject = new Subject<any>();
  private getOnlineOrderIdSubject = new Subject<any>();
  private setOrderOnlineTime = new Subject<any>();

  constructor() {
    this.socket = io('https://live669-0bac3349fa62.herokuapp.com');

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

  getInviteToTip(){
    return this.inviteUserToTipSubject.asObservable();
  }

  getProductAddedObservable() {
    return this.productAddedSubject.asObservable();
  }

  getUserTipObservable() {
    return this.getUserTipSubject.asObservable();
  }
  getOdrerIdObservable() {
    return this.getOnlineOrderIdSubject.asObservable();
  }
}
