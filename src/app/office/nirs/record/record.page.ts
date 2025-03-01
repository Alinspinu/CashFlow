import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round, sortByDate } from 'src/app/shared/utils/functions';
import { Record } from 'src/app/models/suplier.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { RecordModalPage } from '../../supliers/suplier-records/record-modal/record-modal.page';
import { environment } from 'src/environments/environment';
import { CashRegisterService } from '../../cash-register/cash-register.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { emptyNir } from 'src/app/models/empty-models';
import { Nir } from 'src/app/models/nir.model';
import { calcTotalDocs } from '../nirs.engine';


@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecordPage implements OnInit {


  records: Record[] = []
  allRecords: Record[] = []
  record!: Record

  nir: Nir[] = []
  sold: number = 0

  type: string = ''
  title: string = ''

  userId: string = ''
  suplierId!: string

  paymentMessage: string = ''

  message: string = 'Din păcate nu sunt inregistrări in registrul de casă pentru acest furnizor. Inregistrează documentul de plată!'


  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    @Inject(ActionSheetService) private actService: ActionSheetService,
    private cashRegService: CashRegisterService
  ) { }

  ngOnInit() {
    this.user()
    this.getData()
  }

  user(){
    getUserFromLocalStorage().then(user => {
      if(user){
        this.userId = user._id
      }
    })
  }

getData(){
  const data = this.navParams.get('options')
  this.sold = data.sold
  this.suplierId = data.supId
  this.allRecords = JSON.parse(JSON.stringify(data.records))
  this.nir = data.nir
  this.paymentMessage = data.message
  const total = calcTotalDocs(this.nir).total
  this.records = data.records.filter((r:any) => r.typeOf === 'iesire' && r.document.amount < total + 2 && r.document.amount > total -2).reverse()
  this.title = this.records.length ? data.title : `Nu sunt inregistrări!`
}


onSubmit(){
  this.modalCtrl.dismiss({record: this.record, type: this.type, nir: calcTotalDocs(this.nir).nirsId})
}

selectRecord(record: Record, ind: number){
  let selected = record.document.asociat
  if(selected){
    record.document.asociat  = false
  } else {
    record.document.asociat  = true
    this.type = `Platită cu ${record.document.typeOf} nr. ${record.document.docId}`
  }
  this.records[ind] = record
  const index = this.allRecords.findIndex(r => r.document.docId === record.document.docId)
  this.allRecords[index] = record
}


async online(){
  const data = {amount: calcTotalDocs(this.nir).total, suplier: this.suplierId}
  const record = await this.actService.openAdd(RecordModalPage, data, 'small-two')
  if(record){
    record.document.asociat = false
    record.document.docRecords = []
    record.nir = calcTotalDocs(this.nir).nirsId
    record.sold = round(this.sold - record.document.amount)
    this.record = record
    this.records.push(record)
    this.allRecords.push(record)
    for(let rec of this.allRecords){
      if(rec.document.amount === record.document.amount){
        console.log(rec)
      }
    }
    if(record.document.typeOf !== 'banca'){
      const entry = {
        tip: 'expense',
        date: record.date,
        description: `Plata furnizor ${this.nir[0].suplier.name} ${record.document.typeOf} ${record.document.docId}`,
        amount: record.document.amount,
        locatie: environment.LOC,
        typeOf: 'Plata furnizor',
        suplier: this.nir[0].suplier._id,
        user: [this.userId],
        document: {
          tip: record.document.typeOf,
          number: record.document.docId
        },
        asociat: true
      }
      this.cashRegService.addEntry(entry).subscribe({
        next: (response) => {
          if(response){
            showToast(this.toastCtrl, 'Intrarea a fost adaugată cu succes in registrul de casă!', 2000)
          }
        },
        error: (error) => {
          showToast(this.toastCtrl, error.message, 3000)
          console.log(error)
        }
      })
    }
  }
}


  close(){
    this.modalCtrl.dismiss(null)
  }


  formatDate(date: string){
    return formatedDateToShow(date)
  }
}
