import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CashControlService } from './cash-control.service';
import { showToast } from '../shared/utils/toast-controller';
import { ActionSheetService } from '../shared/action-sheet.service';
import { CashInOutPage } from '../modals/cash-in-out/cash-in-out.page';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { formatedDateToShow } from '../shared/utils/functions';
import { Bill } from '../models/table.model';
import { OrderViewPage } from '../modals/order-view/order-view.page';

@Component({
  selector: 'app-cash-control',
  templateUrl: './cash-control.page.html',
  styleUrls: ['./cash-control.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CashControlPage implements OnInit, OnDestroy {

  userSub!: Subscription
  user!: any

  orders: Bill[] = []

  userCash: number = 0;
  userCard: number = 0;
  userViva: number = 0;
  userVoucher: number = 0;
  userOnline: number = 0;
  userTotal: number = 0

  cashIn: number = 0;
  cashOut: number = 0;





  constructor(
    private cashSrv: CashControlService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }

  ngOnInit() {
    this.getUser()
  }


  async openBill(bill: Bill){
    const result = await this.actionSheet.openPayment(OrderViewPage, bill)
    if( result && result.message === 'changePayment'){
      this.cashSrv.changePaymnetMethod(result.order).subscribe(response => {
        if(response) {
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, error => {
        if(error) {
          console.log(error )
          showToast(this.toastCtrl, error.message, 3000)
        }
      })
    }
     if(result && result.message === "reprint") {
        this.cashSrv.reprintBill(result.order).subscribe(response => {
          if(response) {
            showToast(this.toastCtrl, response.message, 3000)
          }
        }, error => {
          if(error) {
            console.log(error )
            showToast(this.toastCtrl, error.message, 3000)
          }
        })
    }
  }

  getOrders(){
    this.cashSrv.getUserOrders(this.user._id).subscribe(response => {
      if(response) {
        this.orders = response
        this.calcCashIn()
      }
    })
  }

  calcCashIn(){
    if(this.orders){
      this.orders.forEach((order: Bill) => {
        if(order.payment.cash){
          this.userCash += order.payment.cash
        }
        if(order.payment.card){
          this.userCard += order.payment.card
        }
        if(order.payment.viva){
          this.userViva += order.payment.viva
        }
        if(order.payment.voucher) {
          this.userVoucher += order.payment.voucher
        }
        if(order.payment.online){
          this.userOnline += order.payment.online
        }
      })
      this.calcTotal()
    }
  }

  calcTotal(){
    this.userTotal = this.userCash + this.userCard +this.userOnline + this.userViva + this.userOnline + this.userVoucher
  }


 getUser(){
  this.userSub = this.authSrv.user$.subscribe(response => {
    if(response) {
      response.subscribe(user => {
        if(user) {
          this.user = user
          this.getOrders()
        }
      })
    }
  })
 }

 today(){
  return formatedDateToShow(Date.now()).split('ora')[0]
 }

 orderTime(date: any){
  return formatedDateToShow(date).split('ora')[1]
 }


 showPaymentMethod(payment: any){
  let method = []
    if(payment.cash && payment.cash > 0){
      method.push(`Cash ${payment.cash} Lei`)
    }
    if(payment.card && payment.card > 0){
      method.push(`Card ${payment.card} Lei`)
    }
    if(payment.voucher && payment.voucher > 0){
      method.push(`Voucher ${payment.voucher} Lei`)
    }
    if(payment.viva && payment.viva > 0){
      method.push(`Viva ${payment.viva } Lei`)
    }
    if(payment.online && payment.online > 0){
      method.push(`Online ${payment.online } Lei`)
    }
    return method
 }

reports(value: string){
  this.cashSrv.raport(value).subscribe(response => {
    if(response){
      showToast(this.toastCtrl, response.message, 3000)
    }
  }, error => {
    if(error){
      showToast(this.toastCtrl, error.message, 3000)
    }
  })
}

async inAndOut(value: string){
 const response = await this.actionSheet.openPayment(CashInOutPage, value)
 if(response){
   const data = {
     mode: value,
     sum: response.value
   }
   if(value === 'in'){
    this.cashIn = this.cashIn + data.sum
   } else {
    this.cashOut = this.cashOut + data.sum
   }
   this.cashSrv.caahInAndOut(data).subscribe(response => {
    if(response){
      showToast(this.toastCtrl, response.message, 3000)
    }
   }, error => {
    if(error){
      showToast(this.toastCtrl, error.message, 3000)
    }
   })
 }
}

}
