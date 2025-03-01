import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Suplier } from '../../../models/suplier.model';
import { formatedDateToShow, round } from '../../../shared/utils/functions';
import { SupliersService } from '../supliers.service';
import { RecordModalPage } from './record-modal/record-modal.page';
import { ActionSheetService } from '../../../shared/action-sheet.service';
import { showToast } from 'src/app/shared/utils/toast-controller';


@Component({
  selector: 'app-suplier-records',
  templateUrl: './suplier-records.page.html',
  styleUrls: ['./suplier-records.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SuplierRecordsPage implements OnInit{

  @ViewChild('content') private content!: IonContent

  suplier!: Suplier
  in: number = 0
  out: number = 0
  suplierId!: string

  constructor(
  private suplierSrv: SupliersService,
  private navParams: NavParams,
  private modalCtrl: ModalController,
  private toastCtrl: ToastController,
  @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }



  ngOnInit() {
    this.getSuplier()
  }

  getSuplier(){
    const id = this.navParams.get('options');
    if(id){
      this.suplierId = id
      this.suplierSrv.getSuplier(this.suplierId).subscribe(suplier => {
        this.suplier = suplier
        this.suplier.records.sort((a,b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })
        setTimeout(() => {
          this.content.scrollToBottom(500)
        }, 300)
        this.calcTotals()
      })
    }

  }


  close(){
    this.modalCtrl.dismiss(null)
  }

  async addRecord(){
    const data = await this.actionSheet.openAdd(RecordModalPage, {suplier: this.suplier._id}, 'small')
    if(data){
      this.suplierSrv.getSuplier(this.suplierId).subscribe(suplier => {
        this.suplier = suplier
        this.calcTotals()
        setTimeout(() => {
          this.content.scrollToBottom(500)
        }, 300)
      })
    }

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
  }

  deleteRecord(docId: string | undefined, amount: number, index: number){
    if(docId){
      this.suplierSrv.deleteRecord(this.suplier._id, docId, amount).subscribe(response => {
        if(response) {
          showToast(this.toastCtrl, response.message, 2000)
          this.suplier.records.splice(index, 1)
          this.getSuplier()
        }
      })
    }
  }


  round(num: number){
    return round(num)
  }



  formateDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
