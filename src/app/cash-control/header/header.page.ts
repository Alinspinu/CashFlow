import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { CashControlService } from '../cash-control.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { formatOrderDateOne } from 'src/app/shared/utils/functions';
import { Bill, deletetBillProduct } from 'src/app/models/table.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HeaderPage implements OnInit {

  date: string = formatOrderDateOne(new Date())
  menuOpen: boolean = false

  activeTabIndex: number = 0

  users: {name: string, id: string, show: boolean}[] = []

  @Output() data = new EventEmitter<{orders: Bill[], delProd: deletetBillProduct[]} >();
  @Input() title: string = ''

  constructor(
        private cashService: CashControlService,
        @Inject(ActionSheetService) private actSrv: ActionSheetService,
        @Inject(MenuController) private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getOrders()
  }



  async openDate(){
    const response = await this.actSrv.entryAlert(['Zi', 'Perioadă'], 'radio', 'Căutare', 'Alege o opțiune', '', '')
    if(response === 'Zi') await this.selectDate(true)
    if(response === 'Perioadă') this.selectDate(false)

  }


  async selectDate(day: boolean){
    if(day) {
      const day = await this.actSrv.openAuth(DatePickerPage)
      this.cashService.getAllorders(day, undefined, undefined).subscribe()
      this.date = formatOrderDateOne(day)
    } else {
      const stDate = await this.actSrv.openPayment(DatePickerPage, 'ALEGE ZIUA DE ÎNCEPUT')
      if(stDate){
        const enDate = await this.actSrv.openPayment(DatePickerPage, 'ALEGE ZIUA DE SFÂRȘIT')
        this.cashService.getAllorders(undefined, stDate, enDate).subscribe()
         this.date = `${formatOrderDateOne(stDate)} - ${formatOrderDateOne(enDate)}`
      }
    }
  }

  userOrders(user: any, index: number){
    const data = this.cashService.getUserOrders(user.id, user.name)
    this.data.emit({
      orders: data.orders,
      delProd: data.delprod
    })
    this.users.forEach(u =>{
      u.show = false
    })
    this.activeTabIndex = index
    user.show = true
  }


  getOrders(){
    this.cashService.ordersSend$.subscribe({
      next: (orders) => {
        const data = this.cashService.getUserOrders('total', '')
        this.data.emit({orders: data.orders, delProd: data.delprod})
        this.getUsers(orders)

      },
      error: (error) => {
        console.log(error)
      }
    })
  }



  getUsers(orders: Bill[]){
    const uniqUsers = new Set()
    const users = orders
      .map(doc => ( doc.employee ? {id: doc.employee.user, name: doc.employee.fullName, show: false}: {id: '', name: '', show: false}))
      .filter(user => {
        const userString = JSON.stringify(user)
        if(!uniqUsers.has(userString)){
          uniqUsers.add(userString)
          return true
        }
        return false
      })
      // console.log(this.users)
      this.users = users
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

}
