import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { ActionSheetService } from '../shared/action-sheet.service';
import { showToast } from '../shared/utils/toast-controller';
import { Bill, Table } from '../models/table.model';
import { TablesService } from './tables.service';
import User from '../auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { OrderAppViewPage } from '../modals/order-app-view/order-app-view.page';
import { AudioService } from '../shared/audio.service';
import { SpinnerPage } from '../modals/spinner/spinner.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tables.page.html',
  styleUrls: ['tables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SpinnerPage],
})

export class TablesPage implements OnInit, OnDestroy {

  tables: Table[] = []
  audio!: HTMLAudioElement
  order!: Bill
  onlineOrder: boolean = false
  dynamicColorChange = false
  colorToggleInterval: any

  isLoadding: boolean = true

  editMode: boolean = false
  user!: User
  tableSubs!: Subscription

  accesLevel: number = 1

  screenWidth!: number

  constructor(
    private router: Router,
    private tableServ: TablesService,
    private toastCtrl: ToastController,
    private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    ) {
      this.screenWidth = window.innerWidth
    }

ngOnInit(): void {
  console.log(this.isLoadding)
  this.getUser()
  this.audio = new Audio();
  this.audio.src = 'assets/audio/ding.mp3';
}




ngOnDestroy(): void {
  if(this.tableSubs){
    this.tableSubs.unsubscribe()
  }
  this.tableServ.stopSse()
}


userBills(tableBills: Bill[]){
  let userBill: number = 0
  tableBills.forEach(bill => {
    if(bill.employee &&(bill.employee.user === this.user._id))
      userBill += 1
  })
  return userBill
}

waiterBills(tableBills: Bill[]){
  let waiterBill: number = 0
  tableBills.forEach(bill => {
    if(bill.employee && (bill.employee.user !== this.user._id))
    waiterBill += 1
  })
  return waiterBill
}


getTables(){
  this.isLoadding = true
 this.tableSubs = this.tableServ.tableSend$.subscribe(response => {
   const tempTables = response
   tempTables.forEach(table =>{
    if(table.index > 48){
      this.tables.push(table)
    }
   })
    // this.tables = response
    if(this.tables.length > 1){
      this.isLoadding = false
    }
  })
}

getUser(){
  Preferences.get({key: 'authData'}).then(data  => {
    if(data.value) {
     this.user = JSON.parse(data.value)
      this.accesLevel = this.user.employee.access
    //  this.incommingOrders()
     this.getTables()
    } else{
      this.router.navigateByUrl('/auth')
    }
  })
}


  openTable(num: number){
    if (this.screenWidth < 500) {
      const table = this.tables.find((doc) => doc.index === num)
      if(table && table.bills.length){
        this.router.navigateByUrl(`table-content-mobile/${num}/tabs/bill`)
      }else {
        this.router.navigateByUrl(`table-content-mobile/${num}`)
      }
    } else {
      this.router.navigateByUrl(`table-content/${num}`)
    }
  }




  async addTable(){
    await this.actionSheet.addMainCat().then(response => {
       let name  = ''
       if(response){
       name = response[0]
       }
      this.tableServ.addTable(name, this.user.locatie).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 4000)
        }
      }, err => {
        showToast(this.toastCtrl, err, 4000)
      })
    })
  }




  incommingOrders(){
  this.tableServ.getOrderMessage(this.user.locatie, this.user._id).subscribe(response => {
    console.log(response)
    if(response){
      const data = JSON.parse(response.data)
      if(data.message === 'New Order'){
        this.order = data.doc
        this.onlineOrder = true
        this.colorToggleInterval = setInterval(() => {
          this.audio.play()
          this.dynamicColorChange = !this.dynamicColorChange;
        }, 500);
      }
    }
   })
  }

  stopDynamicHeader() {
    clearInterval(this.colorToggleInterval);
    this.dynamicColorChange = false;
  }

  async acceptOrder(){
    this.audio.pause()
    this.onlineOrder = false
    this.stopDynamicHeader()
    const result = await this.actionSheet.openPayment(OrderAppViewPage, this.order)
    if(result){
      const time = +result * 60 * 1000
      this.tableServ.setOrderTime(this.order._id, time).subscribe(response => {
        console.log(response)
      })
    }
  }


  activateEditMode(){
    this.editMode = !this.editMode
  }

   async editTable(tableIndex: number){
    await this.actionSheet.addMainCat().then(response => {
      console.log(response)
      if(response){
        this.tableServ.editTable(tableIndex, response[0]).subscribe(response => {
          if(response){
            console.log(response)
            showToast(this.toastCtrl, response.message, 4000)
          }
        }, err => {
          console.log(err)
          showToast(this.toastCtrl, err, 4000)
        })
      }
    })
  }

 async deleteTable(table: Table){
   const  message = table.name ? table.name : table.index
    const confirm = await this.actionSheet.deleteAlert(`Ești sigur ca vrei să ștergi masa ${message}`, "Sterge")
    if(confirm){
      this.tableServ.deleteTable(table._id, table.index).subscribe(response => {
        showToast(this.toastCtrl, response.message, 4000)
      })
    }
  }

  logout(){
    this.authSrv.logout()
    this.router.navigate(['/auth'])
  }

}
