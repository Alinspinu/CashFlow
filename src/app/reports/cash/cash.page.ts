import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
;
import { CashService } from './cash.service';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';

import { OrdersViewPage } from './orders-view/orders-view.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import User from 'src/app/auth/user.model';
import { Router } from '@angular/router';



 interface paymentMethod {
  name: string,
  value: number,
  procent: number
}

interface departament {
  total: number,
  showType: boolean,
  dep: {
    name: string,
    procent: number,
    total: number
  }[]
  procent: number,
  name: string,
  products: product[]
}

interface product {
    name: string,
    qty: number,
    dep: string,
    price: number
}


interface hour {
  hour: number,
  procent: number,
  total: number
}

interface user{
  name: string,
  procent: number,
  total: number
}


@Component({
  selector: 'app-cash',
  templateUrl: './cash.page.html',
  styleUrls: ['./cash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class CashPage implements OnInit {

  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private cashSrv: CashService,
    private router: Router,
  ) { }

  startDate!: string
  endDate!: string
  today: string = this.formatDate(new Date(Date.now()).toString()).split('ora')[0]

  bills: Bill[] = []
  discountBills: Bill [] = []
  cashBackBills: Bill [] = []

  paymentMethods: paymentMethod[] = []
  billProducts: BillProduct[] = []
  departaments: departament [] = []
  hours: hour [] = []
  users: user [] = []

  total: number = 0;
  cashBack: number = 0
  discounts: number = 0

  cash: number = 0
  card: number = 0
  vivaWallet: number = 0
  voucher: number = 0
  payOnline: number = 0

  user!: User


  ngOnInit() {
    this.getUser()

  }


  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
        this.getOrders()
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }

  search(){
    this.today = ''
    this.getOrders()
  }

getOrders(){
  this.cashSrv.getOrders(this.startDate, this.endDate, this.user.locatie).subscribe(response => {
    if(response.length){
      this.resetValues()
      this.bills = response
      this.calcTotals()
    }
  })
}

resetValues(){
  this.total = 0;
  this.cashBack = 0
  this.discounts = 0
  this.cash = 0
  this.card = 0
  this.vivaWallet= 0
  this.voucher = 0
  this.payOnline = 0
  this.paymentMethods = []
  this.departaments = []
  this.billProducts = []
  this.users = []
  this.hours = []
}


calcTotals(){
  this.bills.forEach(bill => {
   if(bill.production){
    bill.products.forEach(prod => {
      this.billProducts.push(prod)
    })
     this.cashBack += bill.cashBack
     this.discounts += bill.discount
     this.total += (bill.total + bill.discount)

     if(bill.payment.cash){
       this.cash += bill.payment.cash
     }
     if(bill.payment.card){
       this.card += bill.payment.card
     }
     if(bill.payment.viva){
       this.vivaWallet += bill.payment.viva
     }
     if(bill.payment.voucher) {
       this.voucher += bill.payment.voucher
     }
     if(bill.payment.online){
       this.payOnline += bill.payment.online
     }
   }
   if(bill.discount > 0){
    this.discountBills.push(bill)
   }
   if(bill.cashBack > 0){
    this.cashBackBills.push(bill)
   }
   console.log(this.bills)
  })
  this.calcProcents()
  this.calcHours()
  this.calcUsers()
}

openBills(method: string){
if(method === 'Discount') {
  this.actionSheet.openPayment(OrdersViewPage, this.discountBills)
}
if(method === 'CashBack'){
  this.actionSheet.openPayment(OrdersViewPage, this.cashBackBills)
}
}


showOrders(){
  let billsToSend: any = []
  this.bills.forEach(el => {
    if(el.production){
      billsToSend.push(el)
    }
  })
  this.actionSheet.openPayment(OrdersViewPage, billsToSend)
}


calcHours(){
  this.bills.forEach(bill => {
    if(bill.production) {
      const hours = new Date(bill.createdAt).getHours()
      const exsitingHour = this.hours.find(p => (p.hour === hours))
      if(exsitingHour){
        exsitingHour.total = exsitingHour.total + bill.total
        exsitingHour.procent = round(exsitingHour.total * 100 / this.total)
      } else {
        const hour: hour = {
          hour: hours,
          procent: round(bill.total * 100 / this.total),
          total: bill.total
        }
        this.hours.push(hour)
      }
    }
  })
  this.hours.sort((a,b) => (a.hour - b.hour))
}

calcUsers(){
  this.bills.forEach(bill => {
    if(bill.production){
      const existingUser = this.users.find(p => (p.name === bill.employee.fullName))
      if(existingUser){
        existingUser.total = existingUser.total + bill.total
        existingUser.procent = round(existingUser.total * 100 / this.total)
      } else {
        const user: user = {
          name: bill.employee.fullName,
          total: bill.total,
          procent: round(bill.total * 100 / this.total)
        }
        this.users.push(user)
      }
    }
  })
  this.users.sort((a,b) => b.procent - a.procent)
}




calcProcents(){
  if(this.total > 0 && this.cash > 0){
    const cashMethod: paymentMethod = {
      name: 'Numerar',
      value: this.cash,
      procent: round(this.cash * 100 / this.total)
    }
    this.paymentMethods.push(cashMethod)
  }
  if(this.total > 0 && this.card > 0){
    const cardMethod: paymentMethod = {
      name: 'Card',
      value: this.card,
      procent: round(this.card * 100 / this.total)
    }
    this.paymentMethods.push(cardMethod)
  }
  if(this.total > 0 && this.vivaWallet > 0){
    const vivaMethod: paymentMethod = {
      name: 'Viva Wallet',
      value: this.vivaWallet,
      procent: round(this.vivaWallet * 100 / this.total)
    }
    this.paymentMethods.push(vivaMethod)
  }
  if(this.total > 0 && this.voucher > 0){
    const voucherMethod: paymentMethod = {
      name: 'Voucher',
      value: this.voucher,
      procent: round(this.voucher * 100 / this.total)
    }
    this.paymentMethods.push(voucherMethod)
  }
  if(this.total > 0 && this.cashBack > 0){
    const casBackMethod: paymentMethod = {
      name: 'CashBack',
      value: this.cashBack,
      procent: round(this.cashBack * 100 / this.total)
    }
    this.paymentMethods.push(casBackMethod)
  }
  if(this.total > 0 && this.payOnline > 0){
    const payOnlineMethod: paymentMethod = {
      name: 'Online',
      value: this.payOnline,
      procent: round(this.payOnline * 100 / this.total)
    }
    this.paymentMethods.push(payOnlineMethod)
  }
  if(this.total > 0 && this.discounts > 0){
    console.log(this.discounts)
    const discountMethod: paymentMethod = {
      name: 'Discount',
      value: this.discounts,
      procent: round(this.discounts * 100 / this.total)
    }
    this.paymentMethods.push(discountMethod)
  }
   this.paymentMethods.sort((a,b) => b.procent - a.procent)
   this.createDeps()
}





createDeps(){
  this.billProducts.forEach(prod => {
    const price = round(prod.price * prod.quantity)
    if(!prod.mainCat){
      prod.mainCat = 'Nedefinit'
    }
    const existingDep = this.departaments.find(p =>(p.name === prod.mainCat))
    if(existingDep) {
      const existingProduct = existingDep.products.find(p => (p.name === prod.name));
      if(existingProduct) {
        existingProduct.qty = existingProduct.qty + prod.quantity
        existingDep.total += prod.price * prod.quantity
        existingDep.procent = round(existingDep.total * 100 / this.total)
        const existingType = existingDep.dep.find(p => (p.name === prod.dep))
        if(existingType) {
          existingType.total = existingType.total + round(prod.price * prod.quantity)
          existingType.procent = 0
        } else {
          existingDep.dep.push(
            {
              name: prod.dep,
              total: price,
              procent: 0
            }
             )
        }
      } else {
        const product: product = {
          name: prod.name,
          dep: prod.dep,
          qty: prod.quantity,
          price: prod.price
        }
        existingDep.total += round(product.price * product.qty)
        existingDep.procent = round(existingDep.total * 100 / this.total)
        existingDep.products.push(product)
        const existingType = existingDep.dep.find(p => (p.name === prod.dep))
        if(existingType) {
          existingType.total = existingType.total + round(prod.price * prod.quantity)
          existingType.procent = 0
        } else {
          existingDep.dep.push(
            {
              name: prod.dep,
              total: price,
              procent: 0
            }
            )
        }
      }
    } else {
      const dep: departament = {
        total: price,
        showType: false,
        procent: round(price * 100 / this.total),
        dep: [
          {
            name: prod.dep,
            total: price,
            procent: round(price * 100 / price)
          }
        ],
        name: prod.mainCat,
        products: [
          {
            name: prod.name,
            dep: prod.dep,
            qty: prod.quantity,
            price: prod.price
          }
        ]
      }
      this.departaments.push(dep)
    }
  })

  this.departaments.sort((a,b) => b.procent - a.procent)
  this.calcTypeProcents(this.departaments)
}


calcTypeProcents(deps: departament[]){
  deps.forEach(dep => {
  dep.products.sort((a,b) => b.qty - a.qty)
   dep.dep.forEach(el => {
    el.procent = round(el.total *100 / dep.total)
   })
  })
}

showData(dep: departament){
  dep.showType = !dep.showType
}


 async selectDate(mode: string){
  if(mode === "start"){
    const startDate = await this.actionSheet.openAuth(DatePickerPage)
    if(startDate){
      this.startDate = startDate
    }
  } else {
    const endDate = await this.actionSheet.openAuth(DatePickerPage)
    if(endDate){
      this.endDate = endDate
    }
  }
  }

  formatDate(date: string){
    return formatedDateToShow(date)
  }

}
