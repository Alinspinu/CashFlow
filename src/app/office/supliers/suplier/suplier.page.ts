import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Suplier } from '../../../models/suplier.model';
import { formatedDateToShow, round } from '../../../shared/utils/functions';
import { SupliersService } from '../supliers.service';
import { ActivatedRoute } from '@angular/router';
import { RecordModalPage } from './record-modal/record-modal.page';
import { ActionSheetService } from '../../../shared/action-sheet.service';
import { showToast } from 'src/app/shared/utils/toast-controller';


@Component({
  selector: 'app-suplier',
  templateUrl: './suplier.page.html',
  styleUrls: ['./suplier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SuplierPage implements OnInit{

  suplier!: Suplier
  in: number = 0
  out: number = 0

  constructor(
  private suplierSrv: SupliersService,
  private route: ActivatedRoute,
  private toastCtrl: ToastController,
  @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }



  ngOnInit() {
    this.getSuplier()
  }

  getSuplier(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.suplierSrv.getSuplier(id).subscribe(suplier => {
        this.suplier = suplier
        this.suplier.records.sort((a,b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        console.log(this.suplier.records)
        this.calcTotals()
      })
    }

  }

  async addRecord(){
    const data = await this.actionSheet.openPayment(RecordModalPage, '')
    this.suplierSrv.addRecord(data, this.suplier._id).subscribe(response => {
      this.suplier.records.push(data)
      this.suplier.sold = this.suplier.sold - data.document.amount
    })
  }

  calcTotals(){
    let inCount = 0
    let outCount = 0
    this.suplier.records.forEach(record => {
      if(record.typeOf === 'intrare'){
        this.in += record.document.amount
        inCount += 1
      } else {
        this.out += record.document.amount
        outCount += 1
      }
    })
    console.log('in: ', inCount)
    console.log('out: ', outCount)
  }

  deleteRecord(docId: string, amount: number, index: number){
    this.suplierSrv.deleteRecord(this.suplier._id, docId, -amount).subscribe(response => {
      if(response) {
        showToast(this.toastCtrl, response.message, 2000, '')
        this.suplier.records.splice(index, 1)
        this.suplier.sold -= amount
      }
    })
  }


  round(num: number){
    return round(num)
  }



  formateDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
