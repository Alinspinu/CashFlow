import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/office/users/users.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { OrderAppViewPage } from 'src/app/modals/order-app-view/order-app-view.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import User from 'src/app/auth/user.model';
import { editOrders } from './user-content.engine';
import { AddEmployeeDataPage } from './add-employee-data/add-employee-data.page';
import { AddClientDiscountPage } from './add-client-discount/add-client-discount.page';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.page.html',
  styleUrls: ['./user-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class UserContentPage implements OnInit {

  user!: User

  total: number = 0;
  cashBack: number = 0;
  discount: number = 0

  constructor(
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private userSrv: UsersService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getUser()

  }


  formatDate(date:any) {
    return formatedDateToShow(date)
  }

  goBack(){
    this.modalCtrl.dismiss(null)
  }

  getUser(){
    const userId = this.navParams.get('options')
    console.log(userId)
    if(userId){
      this.userSrv.getUser(userId).subscribe({
        next: (response) => {
          console.log(response)
          let userr = response
          const data = editOrders(response.orders)
          this.total = data.total;
          this.discount = data.discount;
          this.cashBack = data.cashBack;
          userr.orders = data.sortedOrders;
          this.user = userr
          console.log(this.user)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }


  showOrder(order: any){
    this.actSrv.openPayment(OrderAppViewPage, order)
  }

  async addDiscount(){
  const data = await this.actSrv.openAdd(AddClientDiscountPage, {user: true, data: this.user}, 'add-modal')
    if(data){
      this.userSrv.setUserDiscount(this.user._id, data).subscribe(response => {
        if(response) {
          showToast(this.toastCtrl, response.message, 2000)
        }
      })
      }
}


async editUser(){
  if(this.user){
    const data = await this.actSrv.openAdd(AddEmployeeDataPage, this.user.employee, 'add-modal')
    if(data){
      this.userSrv.editUser(data, this.user._id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.user.employee = data
        }
      })
    }

  }
}

async deleteUser(){
 const response = await this.actSrv.deleteAlert(`Ești sigur ca vrei să ștergi utilizatorul ${this.user.name}?`, 'Șterge Utilizatorul!')
 if(response) {
   this.userSrv.deleteUser(this.user._id).subscribe(response => {
     if(response){
       showToast(this.toastCtrl, response.message, 3000)
       this.modalCtrl.dismiss(null)
     }
   })
 }
}

}
