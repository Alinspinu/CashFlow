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
import { formatedDateToShow, round } from '../shared/utils/functions';
import { Bill } from '../models/table.model';
import { Preferences } from '@capacitor/preferences';
import { OrderAppViewPage } from '../modals/order-app-view/order-app-view.page';
import { ContentService } from '../content/content.service';
import { Category } from '../models/category.model';

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
  allCats: Category[] = []

  catSubs!: Subscription


  constructor(
    private cashSrv: CashControlService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
    if(this.catSubs){
      this.catSubs.unsubscribe()
    }
  }

  ngOnInit() {
    this.getCashInandOut()
    this.getUser()
    this.getData()
  }


  getData(){
  this.catSubs = this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.allCats = [...response]
      }
    })
  }


  async openBill(bill: Bill){
    const result = await this.actionSheet.openPayment(OrderAppViewPage, bill)
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
     if(result && result.message === "bill"){
      console.log(result)
      this.cashSrv.createInvoice(result.orderId, this.user._id, result.clientId, this.user.locatie).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
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
          this.userCash = round(this.userCash + order.payment.cash)
        }
        if(order.payment.card){
          this.userCard = round(this.userCard + order.payment.card)
        }
        if(order.payment.viva){
          this.userViva = round(this.userViva + order.payment.viva)
        }
        if(order.payment.voucher) {
          this.userVoucher = round(this.userVoucher + order.payment.voucher)
        }
        if(order.payment.online){
          this.userOnline = round( this.userOnline + order.payment.online)
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
  this.cashSrv.removeProductDiscount(this.setZeroDiscount(this.allCats)).subscribe(response => {
    console.log(response)
    if(response){
      Preferences.remove({key: 'cashInAndOut'})
    }
  })
  this.cashSrv.raport(value).subscribe(response => {
    if(response){
      if(value === 'z'){
        this.cashIn = 0
        this.cashOut = 0
      }
      showToast(this.toastCtrl, response.message, 3000)
    }
  }, error => {
    if(error){
      showToast(this.toastCtrl, error.message, 3000)
    }
  })
}


setZeroDiscount(cats: Category[]){
  let dataToSend: any = []
  cats.forEach(cat => {
    cat.product.forEach(product => {
      console.log(product.discount)
      if(product.discount > 0){
        const data = {
          precent: 0,
          productId: product._id,
          name: product.name
        }
          dataToSend.push(data)
      }
    })
  })
  console.log(dataToSend)
  return dataToSend
}



async inAndOut(value: string){
 const response = await this.actionSheet.openPayment(CashInOutPage, value)
 if(response){
   const data = {
     mode: value,
     sum: response.value
   }
   if(value === 'in'){
    this.cashIn += data.sum
   } else {
    this.cashOut += data.sum
   }

   this.cashSrv.cashInAndOut(data).subscribe(response => {
    if(response){
      const sums = {in: this.cashIn, out: this.cashOut}
      Preferences.set({key: 'cashInAndOut', value: JSON.stringify(sums)})
      showToast(this.toastCtrl, response.message, 3000)
    }
   }, error => {
    if(error){
      showToast(this.toastCtrl, error.message, 3000)
    }
   })
 }
}


getCashInandOut(){
  Preferences.get({key: 'cashInAndOut'}).then(data => {
    if(data.value){
      const sums = JSON.parse(data.value)
      this.cashIn =  sums.in
      this.cashOut =  sums.out
    }
 })
}

}
