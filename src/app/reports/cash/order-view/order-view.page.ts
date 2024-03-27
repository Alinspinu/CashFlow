import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, getPaymentMethod } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';



@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.page.html',
  styleUrls: ['./order-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class OrderViewPage implements OnInit {

  order!: any
  paymentMethod: any[] = []

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }

  close(){
    this.modalCtrl.dismiss(null)
  }

  formatDate(date:any) {
    return formatedDateToShow(date)
  }

  ngOnInit() {
    this.order = this.navPar.get('options');
    console.log(this.order)
    const result = getPaymentMethod(this.order.payment)
    this.paymentMethod = result
  }

}
