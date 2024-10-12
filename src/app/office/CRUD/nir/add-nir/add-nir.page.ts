import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonSearchbar, ToastController } from '@ionic/angular';
import { Nir, NirIngredient } from '../../../../models/nir.model';
import { NirService } from '../nir.service';
import User from '../../../../auth/user.model';
import { ActionSheetService } from '../../../../shared/action-sheet.service';
import { environment } from 'src/environments/environment';
import { SuplierPage } from '../../suplier/suplier.page';
import { DatePickerPage } from '../../../../modals/date-picker/date-picker.page';
import { IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { round, formatedDateToShow } from '../../../../shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { DiscountPage } from '../../../../modals/discount/discount.page';
import { identifierName } from '@angular/compiler';
import { SpinnerPage } from '../../../../modals/spinner/spinner.page';


@Component({
  selector: 'app-add-nir',
  templateUrl: './add-nir.page.html',
  styleUrls: ['./add-nir.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SpinnerPage]
})
export class AddNirPage implements OnInit {

  @ViewChild('docInput', { static: false }) docInput!: IonInput;
  @ViewChild('searchBarSuplier', {static: false}) searchBarSuplier!: IonSearchbar
  @ViewChild('dateButton', {static: false}) dateButton!: ElementRef


  supliers: any = [];
  suplier!: any
  nir: Nir = {suplier: '', nrDoc: 0, documentDate: '', ingredients: [], discount: [], document: '' , totalDoc: 0, receptionDate: ''}

  nirIngredients: NirIngredient[] = []

  furnizorSearch: string = '';
  docDate!: string
  receptionDate!: string

  nirForm!: FormGroup

  editMode: boolean = false

  user!: User

  isLoading: boolean = false

  val: number = 0;
  valTva: number = 0;
  valTotal: number = 0;
  valVanzare: number = 0;
  nirId!: string

  constructor(
    private nirSrv: NirService,
    @Inject(ActionSheetService) private actionSht: ActionSheetService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
  ) { }



  ngOnInit() {
    this.setupNirForm()
    setTimeout(() => {
      this.getNirToEdit()
      this.getNirIngs()
    }, 300);
  }


  getNirIngs(){
    this.nirSrv.nirIngSend$.subscribe(ings => {
      if(ings){
        if(!this.editMode){
          // const index = ings.findIndex(ing => ing.total === 0)
          // console.log(index)
          // if(index !== -1){
          //   this.nirIngredients = ings.splice(index+1, 1)
          // } else {
          // }
          this.nirIngredients = ings
          this.clacTotals(this.nirIngredients, -1)
        } else{
          this.nirIngredients = ings
          this.clacTotals(this.nirIngredients, -1)
        }
      }
    })
  }



 async addSuplier(){
  const suplier = await this.actionSht.openModal(SuplierPage, true, false)
if(suplier){
  this.selectSuplier(suplier)
}
}


setupNirForm(){
  this.nirForm = new FormGroup({
    nrDoc: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    docDate: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    receptionDate: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
    document: new FormControl(null,{
      updateOn:'change',
      validators: [Validators.required]
    }),
  })

  // this.nirForm.get('date')?.setValue(new Date(Date.now()).toISOString())
  setTimeout(()=> {
    if(this.editMode){
      this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
      this.nirForm.get('docDate')?.setValue(this.nir.documentDate)
      this.nirForm.get('receptionDate')?.setValue(this.nir.receptionDate)
      this.nirForm.get('document')?.setValue(this.nir.document)
    }
  }, 200)
}



getNirToEdit(){
  const id = this.route.snapshot.paramMap.get('id')
  if(id && id !== "new") {
    this.isLoading = true
    this.nirSrv.getNir(id).subscribe(response => {
      if(response) {
        this.nir = response.nir
        this.editMode = true
        this.isLoading = false
        this.nirSrv.setIngredients(this.nir.ingredients)
        this.nirId = id
        this.suplier = this.nir.suplier
        this.valTotal = this.nir.totalDoc
        this.calcTotalsAftDiscount(this.nirIngredients)
        this.nirForm.get('date')?.setValue(this.nir.documentDate)
        this.nirForm.get('document')?.setValue(this.nir.document)
        this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
        this.docDate = this.nir.documentDate
        this.receptionDate = this.nir.receptionDate
      }
    })
  }
}



calcTotalsAftDiscount(nirIngredients: NirIngredient[]){
  this.val = 0;
  this.valTva = 0;
  this.valTotal = 0;
  this.valVanzare = 0
  nirIngredients.forEach(el=> {
    this.val = round(this.val + el.value);
    this.valTva = round(this.valTva + el.tvaValue);
    this.valTotal = round(this.valTotal + el.total);
    this.valVanzare = round(this.valVanzare + (el.sellPrice *  el.qty))
  })
}



  searchSuplier(ev: any){
    const input = ev.detail.value
    this.nirSrv.getSuplier(input, environment.LOC ).subscribe(response => {
      this.supliers = response
      if(input === ''){
        this.supliers = []
      }
    })
  }

  async selectSuplier(suplier: any){
   this.suplier = suplier;
    this.supliers = []
    this.furnizorSearch = ''
    const doc = await this.actionSht.entryAlert(['factura', 'bonFiscal'], 'radio', 'Document ','Alege tipul de document', '', '')
      if(doc){
        this.nirForm.get('document')?.setValue(doc)
        const number = await this.actionSht.textAlert('Numar document', 'Introdu numarul și seria documentului', 'nr', '')
        if(number){
          this.nirForm.get('nrDoc')?.setValue(number)
          const date = await this.actionSht.openPayment(DatePickerPage, '- DATĂ DOCUMENT')
          if(date){
            this.nirForm.get('docDate')?.setValue(date)
            this.docDate = date
            const recDate = await this.actionSht.openPayment(DatePickerPage, '- DATĂ RECEPȚE')
            if(recDate){
              this.nirForm.get('receptionDate')?.setValue(recDate)
              this.receptionDate = recDate
            }
          }
        }
      }
  }

 async openDateModal(mode: boolean){
  let title = mode ? '- DATĂ DOCUMENT':'- DATĂ RECEPȚIE'
    const date = await this.actionSht.openPayment(DatePickerPage, title)
    if(date){
      if(mode){
        this.nirForm.get('docDate')?.setValue(date)
        this.docDate = date
      } else {
        this.nirForm.get('receptionDate')?.setValue(date)
        this.receptionDate = date
      }
    }
  }


  async openDiscount(){
    const result = await this.actionSht.openPayment(DiscountPage, {nir: true})
    if(result.tva === 19 || result.tva === 9 || result.tva === 5 || result.tva === 0) {
      if(result.type === 'val'){
        let totalOfIngsClassTva = 0
        this.nirIngredients.forEach(ing => {
         if(ing.tva === result.tva){
             totalOfIngsClassTva += ing.price * ing.qty
           }
         })
         let discountProcent = result.val / totalOfIngsClassTva
         this.nir.discount.push({tva: result.tva, value: result.val, procent: discountProcent})
         this.nirIngredients.forEach(ing => {
           if(ing.tva === result.tva) {
             ing.price = round(ing.price - ing.price * discountProcent);
             ing.value = round(ing.price * ing.qty);
             ing.tvaValue = round(ing.value * ing.tva / 100);
             ing.total = round(ing.value + ing.tvaValue);
           }

         })
       }
       if(result.type === 'proc') {
         let discountValue = 0
         this.nirIngredients.forEach(ing => {
           if(ing.tva === result.tva) {
             ing.price = round(ing.price - ing.price * result.val / 100)
             ing.value = round(ing.price * ing.qty)
             ing.tvaValue = round(ing.value * ing.tva / 100)
             ing.total = round(ing.value + ing.tvaValue)
             discountValue += (ing.price * result.val / 100) * ing.qty
           }
         })
         this.nir.discount.push({tva: result.tva, value: discountValue, procent: result.val})
       }
       this.calcTotalsAftDiscount(this.nirIngredients)
       console.log(this.nir)
    } else {
     showToast(this.toastCtrl, "Valoarea TVA trebuie sa fie 19, 9, 5 sau 0", 3000, '')
    }

   }


  deleteEntry(index: number){
    if(this.nirIngredients.length)
    this.nirSrv.redNirIng(index)
    setTimeout(() => {
      this.clacTotals(this.nirIngredients, index)
    }, 200)
  }



  saveNir(){
    if(this.nirForm.valid){
      if(this.editMode) {
        this.nirSrv.deleteNir(this.nirId).subscribe(response => {
          if(response && response.message){
            this.nir.documentDate = this.nirForm.value.docDate;
            this.nir.receptionDate = this.nirForm.value.receptionDate;
            this.nir.nrDoc = this.nirForm.value.nrDoc
            this.nir.suplier = this.suplier._id
            this.nir.document = this.nirForm.value.document
            const index = this.nirIngredients.findIndex(ing => ing.total === 0)
            if(index !== -1){
              this.nirIngredients.splice(index, 1)
              this.nir.ingredients = this.nirIngredients
            } else {
              this.nir.ingredients = this.nirIngredients
            }
            this.nir.totalDoc = this.valTotal
            this.nirSrv.saveNir(this.nir, environment.LOC).subscribe(response => {
              this.reserNirData()
              showToast(this.toastCtrl, "Nirul a fost editat cu success, stocul a fost actualizat!", 2000, '')
              this.router.navigateByUrl('/tabs/office/nirs')
            })
          }
        })
      } else {
        this.nir.documentDate = this.nirForm.value.docDate;
        this.nir.receptionDate = this.nirForm.value.receptionDate;
        this.nir.nrDoc = this.nirForm.value.nrDoc
        this.nir.suplier = this.suplier._id
        this.nir.document = this.nirForm.value.document
        const index = this.nirIngredients.findIndex(ing => ing.total === 0)
        if(index !== -1){
          this.nirIngredients.splice(index, 1)
          this.nir.ingredients = this.nirIngredients
        } else {
          this.nir.ingredients = this.nirIngredients
        }
        this.nir.totalDoc = this.valTotal
        this.nirSrv.saveNir(this.nir, environment.LOC).subscribe(response=> {
          this.reserNirData()
          this.router.navigateByUrl('/tabs/office/nirs')
          showToast(this.toastCtrl, response.message, 2000, '')
        })
      }
    } else {
      console.log(this.nirForm)
      showToast(this.toastCtrl, 'NU AI COMPLETAT TOATE CÂMPURILE!', 2000, 'error-toast')
    }
  }



  clacTotals(nirIngs: NirIngredient[], index: number){
    if(index !== -1 && nirIngs.length){
      let ing = nirIngs[index]
      this.val = round(this.val - ing.value)
      this.valTva = round(this.valTva - ing.tvaValue)
      this.valTotal = round(this.valTotal -  ing.total)
      this.valVanzare = round(this.valVanzare - (ing.sellPrice *  ing.qty))
    } else {
          if(nirIngs.length){
            let ing =  nirIngs[nirIngs.length -1]
            this.val = round(this.val + ing.value)
            this.valTva = round(this.valTva +  ing.tvaValue)
            this.valTotal = round(this.valTotal +  ing.total)
            this.valVanzare = round(this.valVanzare + (ing.sellPrice *  ing.qty))
          }
    }
  }


  reserNirData(){
    this.nir =  {suplier: '', nrDoc: 0, documentDate: '', ingredients: [], discount: [], document: '', totalDoc: 0, receptionDate: ''}
    this.nirSrv.resetProducts()
    this.val = 0
    this.suplier = undefined
    this.valTotal = 0
    this.valTva = 0
    this.valVanzare = 0
    this.nirForm.reset()
  }


roundFor(num: number){
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

formatDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}

}
