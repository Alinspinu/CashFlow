import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Bill } from '../../../models/table.model';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { OrderViewPage } from '../order-view/order-view.page';
import { round } from '../../../shared/utils/functions';

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.page.html',
  styleUrls: ['./orders-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrdersViewPage implements OnInit {

  orders: Bill[] = []
  screenWidth!: number

  constructor(
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.orders = this.navPar.get('options')
    this.screenWidth = window.innerWidth
console.log(this.orders)
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  showOrder(order: Bill){
    this.actSrv.openPayment(OrderViewPage, order)
  }

  formatDate(date:any) {
    const strings = formatedDateToShow(date).split('-2024 ora').join('')
    return strings
  }

  roundInHtml(num: number){
    return round(num)
  }

}
