import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow, getPaymentMethod } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { SuplierPage } from 'src/app/office/CRUD/suplier/suplier.page';

import { CashControlService } from 'src/app/cash-control/cash-control.service';



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
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private cashSrv: CashControlService,
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


  async printBill(){
    const result = await this.actionSheet.openModal(SuplierPage, '', false)
    console.log(result)
    if(result){
      this.cashSrv.createInvoice(this.order._id, this.order.employee.user, result._id, this.order.locatie).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
      })
    }
  }

}
