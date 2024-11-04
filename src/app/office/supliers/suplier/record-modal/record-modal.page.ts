import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow } from '../../../../shared/utils/functions';
import { ActionSheetService } from '../../../../shared/action-sheet.service';
import { DatePickerPage } from '../../../../modals/date-picker/date-picker.page';

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
  } = {
    date: false,
    document: false,
    docNr: false,
    desc: false,
    amount: false,
  }




  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }

  ngOnInit() {
    const data = this.navParams.get('options')
    if(data){
      this.total = data.amount
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
        typeOf: 'iesire',
        date: this.date,
        description: this.form.value.description,
        document: {
          typeOf: this.form.value.document,
          docId: this.form.value.docNr,
          amount: this.form.value.price,
        },
      }

      this.modalCtrl.dismiss(record)
  }
  }






  async startEntryFlow(){
    const date = await this.actionSheet.openAuth(DatePickerPage)
    if(date){
      this.hide.date = true
      this.date = date
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
