import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { formatedDateToShow, round } from 'src/app/shared/utils/functions';
import { OrderAppViewPage } from 'src/app/modals/order-app-view/order-app-view.page';
import { Bill } from 'src/app/models/table.model';
import { CashControlService } from '../cash-control.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ContentService } from 'src/app/content/content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { CashInOutPage } from 'src/app/modals/cash-in-out/cash-in-out.page';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.page.html',
  styleUrls: ['./mobile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MobilePage implements OnInit {

  userSub!: Subscription
  user!: any

  orders: Bill[] = []
  data: Bill[] = []

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

  productSearch!: string


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
    if(this.catSubs){
      this.catSubs.unsubscribe()
    }
  }

  ngOnInit() {
    this.getUser()
  }


    searchProduct(ev: any){
      this.productSearch = ev.target.value;
      this.orders = this.data.filter(parentItem =>
        parentItem.products.some(child =>
          child.name.toLowerCase().includes(this.productSearch.toLowerCase())
        )
      );
    }

  async openBill(bill: Bill){
    const result = await this.actionSheet.openMobileModal(OrderAppViewPage, bill, false)
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
        this.data = response
        this.orders = [...this.data]
        this.calcCashIn()
      }
    })
  }

  calcCashIn(){
    this.userCash = 0
    this.userCard = 0
    this.userViva = 0
    this.userVoucher = 0
    this.userOnline = 0
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



}
