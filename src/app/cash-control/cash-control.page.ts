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
import { SpinnerPage } from '../modals/spinner/spinner.page';
import { AddEntryPage } from '../modals/add-entry/add-entry.page';
import { UsersService } from '../office/users/users.service';
import { CloseDayPage } from './close-day/close-day.page';
import { environment } from '../../environments/environment.prod';


interface payment {
  description: string,
  amount: number
  date: string,
  document: {tip: string, number: string},
  users: string[]
}

@Component({
  selector: 'app-cash-control',
  templateUrl: './cash-control.page.html',
  styleUrls: ['./cash-control.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage]
})
export class CashControlPage implements OnInit, OnDestroy {

  userSub!: Subscription
  user!: any

  orders: Bill[] = []
  data: Bill[] = []
  users: {name: string, id: string, show: boolean}[] = []

  userCash: number = 0;
  userCard: number = 0;
  userViva: number = 0;
  userVoucher: number = 0;
  userOnline: number = 0;
  userTotal: number = 0
  userTips: number = 0

  cashIn: number = 0;
  cashOut: number = 0;
  allCats: Category[] = []

  catSubs!: Subscription
  productSearch!: string

  isLoading: boolean = true
  message: boolean = false

  disableButtons: boolean = false

  payments: payment[] = []
  paymentsTotal: number = 0



  constructor(
    private cashSrv: CashControlService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    private contSrv: ContentService,
    private userSrv: UsersService,
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
    this.getPaymentsFromLocalStorage()
    this.getUser()
    this.getData()
    this.userSrv.getUsers().subscribe()
  }


  getData(){
  this.catSubs = this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.allCats = [...response]
      }
    })
  }

  showOrders(user: any){
    if(user.id === 'total'){
      this.getAllOrders()
    } else{
      this.getOrders(user.id)
      user.show = true
      this.users.forEach(obj => {
        if(obj.id !== user.id){
          obj.show = false
        }
      })
    }

  }

  searchProduct(ev: any){
    this.productSearch = ev.target.value;
    this.orders = this.data.filter(parentItem =>
      parentItem.products.some(child =>
        child.name.toLowerCase().includes(this.productSearch.toLowerCase())
      )
    );
  }




 async closeDay(){
    const data = await this.actionSheet.openPayment(CloseDayPage,
      {
        pay: this.payments,
        payTotal: this.paymentsTotal,
        cashTotal: this.userCash,
        card: this.userTotal - this.userCash,
        name: this.user.employee.fullName
      })
      if(data){
        showToast(this.toastCtrl, data, 1500)
        this.onReports('z')

      }

  }




  async adPayment(){
      const data = await this.actionSheet.openPayment(AddEntryPage, 'user')
      if(data && data.entry){
       const tip = data.entry.typeOf
       const payment: payment = {
        description: data.entry.description,
        amount: +data.entry.amount,
        date: data.entry.date,
        document: data.entry.document,
        users: []
       }

       if(tip === 'Bonus vanzari'){
         const users = data.entry.description.split(',')
         users.shift()
          payment.description = 'Bonus vanzari'
          payment.users = users
       }

       this.payments.push(payment)
       this.paymentsTotal += payment.amount
       Preferences.set({key: 'payments', value: JSON.stringify({pay: this.payments, total: this.paymentsTotal})})
      }
  }

  getPaymentsFromLocalStorage(){
    Preferences.get({key: 'payments'}).then(data => {
      if(data.value){
        const payments = JSON.parse(data.value)
        this.payments =  payments.pay
        this.paymentsTotal = payments.total
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
     if(result && result.message === "fiscal") {
        const order = JSON.stringify(result.order)
        this.isLoading = true
        this.cashSrv.reprintBill(order).subscribe(response => {
          if(response) {
            this.isLoading = false
            showToast(this.toastCtrl, response.message, 3000)
          }
        }, error => {
          if(error) {
            this.isLoading = false
            if(error.error && error.error.message === "timeout of 5000ms exceeded"){
              showToast(this.toastCtrl, 'Nu se poate realiza conexiunea cu inprimanta!', 3000)
            } else {
              showToast(this.toastCtrl, error.error.message, 3000)
            }
          }
        })
     }
     if(result && result.message === "nefiscal"){
      const order = JSON.stringify(result.order)
      this.isLoading = true
      this.cashSrv.printNefiscal(order).subscribe(response => {
        if(response) {
          this.isLoading = false
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, error => {
        if(error) {
          this.isLoading = false
          if(error.error && error.error.message === "timeout of 5000ms exceeded"){
            showToast(this.toastCtrl, 'Nu se poate realiza conexiunea cu inprimanta!', 3000)
          } else {
            showToast(this.toastCtrl, error.error.message, 3000)
          }
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


  getOrders(id: string){
    this.cashSrv.getUserOrders(id).subscribe(response => {
      if(response) {
        this.data = response
        this.orders = [...this.data]
        this.calcCashIn()
        this.isLoading = false
      }
    })
  }

  getAllOrders(){
    this.cashSrv.getAllorders().subscribe(response => {
      if(response) {
        this.data = response
        this.orders = [...this.data]
        this.calcCashIn()
        this.getUsers()
        this.isLoading = false
      }
    })
  }

  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response) {
        this.user = response
        this.getAllOrders()
      }
    })
   }

  getUsers(){
    const uniqUsers = new Set()
    const users = this.data
      .map(doc => ( doc.employee ? {id: doc.employee.user, name: doc.employee.fullName, show: false}: {id: '', name: '', show: false}))
      .filter(user => {
        const userString = JSON.stringify(user)
        if(!uniqUsers.has(userString)){
          uniqUsers.add(userString)
          return true
        }
        return false
      })
      this.users = users
      this.users.unshift({id: 'total', name: 'total', show: true})
  }

  calcCashIn(){
    this.userCash = 0
    this.userCard = 0
    this.userViva = 0
    this.userVoucher = 0
    this.userOnline = 0
    this.userTips = 0;
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
          if(order.tips > 0){
            this.userTips = round(this.userTips + order.tips)
          }
      })
      this.calcTotal()
    }
  }

  calcTotal(){
    this.userTotal = this.userCash + this.userCard +this.userOnline + this.userViva + this.userVoucher
    this.isLoading = false
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


async onReports(value: string){
  if(value === 'z'){
    const response = await this.actionSheet.deleteAlert('PRINTEAZĂ RAPORTUL Z', 'RAPORT Z')
    if(response){
      this.reports(value)
    }
  } else {
    this.reports(value)
  }
}


reports(value: string){
  this.disableButtons = true
  this.cashSrv.removeProductDiscount(this.setZeroDiscount(this.allCats)).subscribe(response => {
    if(response){

    }
  })
  this.cashSrv.raport(value).subscribe(response => {
    if(response){
      this.disableButtons = false
      if(value === 'z'){
        this.isLoading = true
        this.message = true
        const entry = {
          tip: 'income',
          date: new Date().toISOString(),
          description: 'Incasare Raport Z',
          amount: this.userCash,
          locatie: environment.LOC,
          typeOf: 'Incasare raport Z'
        }

        this.cashSrv.saveEntry(entry).subscribe({
          next: (response) => {
            this.cashSrv.saveInventary().subscribe({
              next: (response) => {
                if(response){
                  this.isLoading = false
                  this.message = false
                  Preferences.remove({key: 'payments'})
                  Preferences.remove({key: 'cashInAndOut'})
                  showToast(this.toastCtrl, "Gata calculele au fost făcute!", 3000)
                }
              },
              error: (error) => {
                console.log(error)
                this.isLoading = false
                this.message = false
                showToast(this.toastCtrl, error.message, 2000)
              }
            })
          },
          error: (error) => {
            console.log(error)
            this.isLoading = false
            this.message = false
            showToast(this.toastCtrl, error.message, 2000)
          }
        })


        this.cashIn = 0
        this.cashOut = 0
      }
      showToast(this.toastCtrl, response.message, 3000)
    }
  }, error => {
    if(error){
      this.disableButtons = false
      if(error.error && error.error.message === 'timeout of 5000ms exceeded'){
        showToast(this.toastCtrl, 'Conexiunea cu imprimanta nu poate fi stabilită', 3000)
      } else {
        showToast(this.toastCtrl, error.error.message, 3000)
      }
    }
  })
}


setZeroDiscount(cats: Category[]){
  let dataToSend: any = []
  cats.forEach(cat => {
    cat.product.forEach(product => {
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
  return dataToSend
}



async inAndOut(value: string){
 const response = await this.actionSheet.openPayment(CashInOutPage, value)
 if(response){
  this.disableButtons = true
   const data = {
     mode: value,
     sum: response.value
   }
   this.cashSrv.cashInAndOut(data).subscribe(response => {
    if(response){
      this.disableButtons = false
      if(value === 'in'){
        this.cashIn += data.sum
       } else {
        this.cashOut += data.sum
       }
      const sums = {in: this.cashIn, out: this.cashOut}
      Preferences.set({key: 'cashInAndOut', value: JSON.stringify(sums)})
      showToast(this.toastCtrl, response.message, 3000)
    }
   }, error => {
    if(error){
      this.disableButtons = false
      if(error.error && error.error.message === 'timeout of 5000ms exceeded'){
        showToast(this.toastCtrl, 'Conexiunea cu imprimanta nu poate fi stabilită', 3000)
      } else {
        showToast(this.toastCtrl, error.error.message, 3000)
      }
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
