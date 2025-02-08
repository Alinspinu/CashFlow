import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/office/users/users.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddEmployeeDataPage } from 'src/app/modals/add-employee-data/add-employee-data.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { OrderAppViewPage } from 'src/app/modals/order-app-view/order-app-view.page';
import { AddClientDiscountPage } from 'src/app/modals/add-client-discount/add-client-discount.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.page.html',
  styleUrls: ['./user-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class UserContentPage implements OnInit {

  userId: string = ''
  user!: any

  constructor(
    private router: Router,
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
    const user = this.navParams.get('options')
    if(user) this.user = user
  }


  showOrder(order: any){
    this.actSrv.openPayment(OrderAppViewPage, order)
  }

  async addDiscount(){
  const data = await this.actSrv.openPayment(AddClientDiscountPage, {user: true, data: this.user})
    if(data){
      this.userSrv.setUserDiscount(this.userId, data).subscribe(response => {
        if(response) {
          showToast(this.toastCtrl, response.message, 2000)
        }
      })
      }
}


async editUser(){
  if(this.user){
    const data = await this.actSrv.openPayment(AddEmployeeDataPage, this.user.employee)
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

deleteUser(){
  this.userSrv.deleteUser(this.userId).subscribe(response => {
    if(response){
      showToast(this.toastCtrl, response.message, 3000)
      this.router.navigateByUrl('/office/users')
    }
  })
}

}
