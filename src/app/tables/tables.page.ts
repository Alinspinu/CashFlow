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


@Component({
  selector: 'app-tab1',
  templateUrl: 'tables.page.html',
  styleUrls: ['tables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class TablesPage implements OnInit, OnDestroy {

  tables!: Table[]
  audio!: HTMLAudioElement
  order!: Bill
  onlineOrder: boolean = false
  dynamicColorChange = false
  colorToggleInterval: any

  editMode: boolean = false
  user!: User
  tableSubs!: Subscription

  constructor(
    private router: Router,
    private tableServ: TablesService,
    private toastCtrl: ToastController,
    private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    ) {}

ngOnInit(): void {
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





getTables(){
 this.tableSubs = this.tableServ.tableSend$.subscribe(response => {
    this.tables = response
  })
}

getUser(){
  Preferences.get({key: 'authData'}).then(data  => {
    if(data.value) {
     this.user = JSON.parse(data.value)
     this.incommingOrders()
     this.getTables()
    } else{
      this.router.navigateByUrl('/auth')
    }
  })
}


  openTable(num: number){
    this.router.navigateByUrl(`table-content/${num}`)
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
    console.log('hit incomming orders')
  this.tableServ.getOrderMessage(this.user.locatie, this.user._id).subscribe(response => {
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
