import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { CashControlService } from './cash-control.service';
import { ActionSheetService } from '../shared/action-sheet.service';
import { Subscription } from 'rxjs';
import { formatOrderDateOne, getUserFromLocalStorage} from '../shared/utils/functions';
import { Bill, deletetBillProduct } from '../models/table.model';
import { MenuController } from '@ionic/angular';
import { OrdersPage } from './orders/orders.page';
import { SalesPage } from './sales/sales.page';
import { ProductsPage } from './products/products.page';
import { emptyBill, emptyDeletetBillProduct } from '../models/empty-models';



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
  imports: [IonicModule, CommonModule, FormsModule, OrdersPage, SalesPage, ProductsPage]
})
export class CashControlPage implements OnInit, OnDestroy {

  activeTabIndex: number = 0

  date: string = formatOrderDateOne(new Date())
  access: number = 1

  userSub!: Subscription
  user!: any
  users: {name: string, id: string, show: boolean}[] = []

  orders: Bill[] = []
  ordersDone: Bill[] = []
  data: {orders: Bill[], delProd: deletetBillProduct[]} = {orders: [emptyBill()], delProd: [emptyDeletetBillProduct()]}

  menuOpen: boolean = false

  title: string = 'Încasări'

  appPages: any = [
    {name: 'Încasări', icon: '../../assets/icon/cash-register.svg', show: true},
    {name: 'Comenzi', icon: '../../assets/icon/document.svg', show: false},
    {name: 'Produse', icon: '../../assets/icon/foood.svg', show: false},
  ]



  constructor(
    private cashSrv: CashControlService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    @Inject(MenuController) private menuCtrl: MenuController
  ) { }



  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
    this.menuChange()
  }

  ngOnInit() {
    this.menuChange()
    this.cashSrv.getAllorders(undefined, undefined, undefined).subscribe()
    this.getOrders()
    this.getAccess()
  }

  getAccess(){
    getUserFromLocalStorage().then(user => {
      if(user){
        this.access = user.employee.access
      }
    })
  }




  userOrders(user: any, index: number){
    const data = this.cashSrv.getUserOrders(user.id, user.name)
    this.data = {
      orders: data.orders,
      delProd: data.delprod
    }

    this.users.forEach(u =>{
      u.show = false
    })
    this.activeTabIndex = index
    user.show = true
  }

  changeDate(date: any){
    this.date = date
  }



  getOrders(){
    this.cashSrv.ordersSend$.subscribe({
      next: (orders) => {
        this.ordersDone = orders.filter(o => o.status === 'done')
        this.getUsers()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


   getUsers(){
    const uniqUsers = new Set()
    const users = this.ordersDone
      .map(doc => ( doc.employee ? {id: doc.employee.user, name: doc.employee.fullName, show: false}: {id: '', name: '', show: false}))
      .filter(user => {
        const userString = JSON.stringify(user)
        if(!uniqUsers.has(userString)){
          uniqUsers.add(userString)
          return true
        }
        return false
      })
      this.users = users.filter(u => u.id !== '')
      console.log(this.users)
      this.users.unshift({id: 'total', name: 'total', show: true})
  }



private async menuChange(){
  const menu = await this.menuCtrl.get('start');
  if (menu) {
    menu.addEventListener('ionDidClose', () => {
      this.menuOpen = false
    });
    menu.addEventListener('ionDidOpen', () => {
         this.menuOpen = true
    });
  }
}

selectPage(page: string){
    const index = this.appPages.findIndex((p:any) => p.name == page)
    this.appPages = this.appPages.map((p:any) => ({...p, show: false}))
    this.appPages[index].show = true
    this.title = page
}




// async adPayment(){
//   const data = await this.actionSheet.openPayment(AddEntryPage, 'user')
//   if(data && data.entry){
//    const tip = data.entry.typeOf
//    const payment: payment = {
//     description: data.entry.description,
//     amount: +data.entry.amount,
//     date: data.entry.date,
//     document: data.entry.document,
//     users: []
//    }

//    if(tip === 'Bonus vanzari'){
//      const users = data.entry.description.split(',')
//      users.shift()
//       payment.description = 'Bonus vanzari'
//       payment.users = users
//    }

//    this.payments.push(payment)
//    this.paymentsTotal += payment.amount
//    Preferences.set({key: 'payments', value: JSON.stringify({pay: this.payments, total: this.paymentsTotal})})
//   }
// }

}


