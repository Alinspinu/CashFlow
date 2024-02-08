import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, getPaymentMethod } from 'src/app/shared/utils/functions';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PaymentPage } from '../payment/payment.page';
import { SuplierPage } from 'src/app/office/CRUD/suplier/suplier.page';

@Component({
  selector: 'app-order-app-view',
  templateUrl: './order-app-view.page.html',
  styleUrls: ['./order-app-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class OrderAppViewPage implements OnInit {

  order!: any
  paymentMethod: any[] = []
  onlineOrder: boolean = false

  constructor(
    private navPar: NavParams,
    private actionSheet: ActionSheetService,
    private modalCtrl: ModalController
  ) { }

  close(){
    this.modalCtrl.dismiss(null)
  }

  formatDate(date:any) {
    return formatedDateToShow(date)
  }

  sendTime(time: string){
    this.modalCtrl.dismiss(time)
  }

  ngOnInit() {
    this.order = this.navPar.get('options');
    console.log(this.order.dont)
    const result = getPaymentMethod(this.order.payment)
    this.paymentMethod = result
  }

  async reprint(){
    const result = await this.actionSheet.deleteAlert('Bonul va fi retipărit pe casa de marcat. Esti sigur că vrei sa faci asta?', 'REPĂRIRE')
    if(result){
      this.modalCtrl.dismiss({order: this.order, message: 'reprint'})
    }
  }

  async createBill(){
    const result = await this.actionSheet.openModal(SuplierPage, '', false)
    if(result){
      console.log(result)
      this.modalCtrl.dismiss({orderId: this.order._id, clientId: result._id, message: 'bill'})
    }
  }

  async changePaymentMethod(){
      const paymentInfo = await this.actionSheet.openPayment(PaymentPage, this.order)
        if(paymentInfo){
          if(paymentInfo.card > 0){
            this.order.payment.card = paymentInfo.card;
          }
          if(paymentInfo.card2 > 0){
            this.order.payment.card = paymentInfo.card2;
          }
          this.order.payment.cash = paymentInfo.cash;
          this.order.cif = paymentInfo.cif;
          this.order.payment.online  = paymentInfo.online
          this.modalCtrl.dismiss({order: this.order, message: 'changePayment'})
        }
  }

}
