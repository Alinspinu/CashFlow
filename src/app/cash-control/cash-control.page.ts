import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { CashControlService } from './cash-control.service';
import { Subscription } from 'rxjs';
import { formatOrderDateOne, getUserFromLocalStorage} from '../shared/utils/functions';
import { Bill, deletetBillProduct } from '../models/table.model';
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
  imports: [IonicModule, CommonModule]
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



  constructor(
    private cashSrv: CashControlService,
  ) { }



  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }

  ngOnInit() {
    this.cashSrv.getAllorders(undefined, undefined, undefined).subscribe()
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


