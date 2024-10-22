import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { MonetarPage } from '../monetar/monetar.page';
import { CashControlService } from '../cash-control.service';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

interface Monetary{
  fiveH: number,
  twoH: number,
  oneH: number,
  fiveT: number,
  ten: number,
  five: number,
  one: number,
  oneByTwo: number,
  total: number
}

@Component({
  selector: 'app-close-day',
  templateUrl: './close-day.page.html',
  styleUrls: ['./close-day.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CloseDayPage implements OnInit {

data!: any

monetary!: Monetary

  constructor(
    private navPar: NavParams,
    private cashSrv: CashControlService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private modalCtrl: ModalController,
  ) { }


  ngOnInit() {
    this.getData()
  }

  getData(){
    this.data = this.navPar.get('options')
  }


  async addMonetary(){
    const total = this.data.cashTotal - this.data.payTotal
    const monetary: Monetary = await this.actionSheet.openPayment(MonetarPage, {total: total})
    this.monetary = monetary
  }


  closeDay(){
    const date =  formatedDateToShow(new Date().toISOString())
    const report = {
      date: date,
      name: this.data.name,
      payments: this.data.pay,
      totalPayments: this.data.payTotal,
      totalCash: this.data.cashTotal,
      monetary: this.monetary
    }
    this.cashSrv.printReport(report).subscribe({
      next: (response) => {
        this.modalCtrl.dismiss(response.message)
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  close(){
    this.modalCtrl.dismiss(null)
  }
}
