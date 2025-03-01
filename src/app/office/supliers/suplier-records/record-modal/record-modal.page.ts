import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { formatedDateToShow } from '../../../../shared/utils/functions';
import { ActionSheetService } from '../../../../shared/action-sheet.service';
import { DatePickerPage } from '../../../../modals/date-picker/date-picker.page';
import { SupliersService } from '../../supliers.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-record-modal',
  templateUrl: './record-modal.page.html',
  styleUrls: ['./record-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RecordModalPage implements OnInit {

  form!: FormGroup;
  date!:any
  total: number = 0

  suplierId!: string

  documents: string[] = [
    'bon fiscal',
    'chitanta',
    'banca',
  ]

  hide: {
    date: boolean,
    document: boolean,
    docNr: boolean,
    desc: boolean,
    amount: boolean,
    typeOf: boolean
  } = {
    date: false,
    document: false,
    docNr: false,
    desc: false,
    amount: false,
    typeOf: false
  }




  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private supliersService: SupliersService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const data = this.navParams.get('options')
    if(data){
      this.total = data.amount ? data.amount : 0
      this.suplierId = data.suplier
    }
    this.setForm()
    this.startEntryFlow()
    this.form.get('description')?.setValue('-')
  }


  setForm(){
    this.form = new FormGroup({
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      document: new FormControl(null, {
        updateOn: 'change',
      }),
      docNr: new FormControl(null, {
        updateOn: 'change',
      }),
      description: new FormControl(null, {
        updateOn: 'change',
      }),
      typeOf: new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'change',
      }),

    });
  }

  async openDateModal(){
    const response = await this.actionSheet.openAuth(DatePickerPage)
    if(response){
      this.date = response
    }
  }


  confirm(){
    if(this.form.valid && this.date){
      const record = {
        typeOf: this.form.value.typeOf,
        date: this.date,
        description: this.form.value.description,
        document: {
          typeOf: this.form.value.document,
          docId: this.form.value.docNr,
          amount: +this.form.value.price,
        },
      }
      this.supliersService.addRecord(record, this.suplierId).subscribe({
        next: (response) => {
          showToast(this.toastCtrl, response.message, 2000)
          this.modalCtrl.dismiss(record)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }






  async startEntryFlow(){
    const date = await this.actionSheet.openAuth(DatePickerPage)
    if(date){
      this.hide.date = true
      this.date = date
      if(this.total > 0){
        this.form.get('typeOf')?.setValue('iesire')
        this.hide.typeOf = true
      } else{
        const tip = await this.actionSheet.entryAlert(['Credit', 'Debit'], 'radio', 'Tip de corecție', 'Alege o opțiune', '', '')
        if(tip){
          let value = tip === 'Credit' ? 'intrare' : 'iesire'
          this.hide.typeOf = true
          this.form.get('typeOf')?.setValue(value)
        }
      }
      const document = await this.actionSheet.entryAlert(this.documents, 'radio', 'Tip de Document', 'Alege o opțiune', '', '')
      if(document) {
        this.hide.document = true
        this.form.get('document')?.setValue(document)
          const docNumber = await this.actionSheet.textAlert('Numar Document', 'Introdu numarul documentului', 'nr', 'Numad document')
          if(docNumber){
            this.hide.docNr = true
            this.form.get('docNr')?.setValue(docNumber)
            if(this.total > 0){
              this.hide.amount = true
              this.form.get('price')?.setValue(this.total)
            } else {
              const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                if(sum){
                  this.hide.amount = true
                  this.form.get('price')?.setValue(sum)
                  const description = await this.actionSheet.textAlert('Detalii', 'Adaugă detalii suplimentare', 'nr', 'Detalii plată')
                  if(description){
                    this.hide.desc = true
                    this.form.get('description')?.setValue(description)
                  }

                }
              }
            }
        }
      }
    }

  cancel(){
    this.modalCtrl.dismiss(null)
  }

  formatDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
