import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonSearchbar, NavParams, ToastController } from '@ionic/angular';
import {Preferences} from "@capacitor/preferences"
import { InvIngredient, Nir, NirIngredient } from '../../../models/nir.model';
import { NirService } from './nir.service';
import { getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { SuplierPage } from '../suplier/suplier.page';
import { IonDatetimeButton, IonInput } from '@ionic/angular/standalone';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { DiscountPage } from 'src/app/modals/discount/discount.page';
import { ActivatedRoute, Router } from '@angular/router';
import { NirsService } from '../../nirs/nirs.service';
import User from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { IngredientService } from '../../ingredient/ingredient.service';
import { formatedDateToShow } from '../../../shared/utils/functions';
import { DatePickerPage } from '../../../modals/date-picker/date-picker.page';


@Component({
  selector: 'app-nir',
  templateUrl: './nir.page.html',
  styleUrls: ['./nir.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NirPage implements OnInit, OnDestroy {

  @ViewChild('qtyInput', { static: false }) qtyInput!: IonInput;
  @ViewChild('docInput', { static: false }) docInput!: IonInput;
  @ViewChild('searchBar', {static: false}) searchBar!: IonSearchbar
  @ViewChild('searchBarSuplier', {static: false}) searchBarSuplier!: IonSearchbar
  @ViewChild('dateButton', {static: false}) dateButton!: ElementRef

nirIngredients: NirIngredient[] = []
ingredients: any = [];
ingredient!: any;
supliers: any = [];
suplier!: any
nir: Nir = {suplier: '', nrDoc: 0, documentDate: '', ingredients: [], discount: [], document: '' , totalDoc: 0}

date!: string

totalDoc: number = 0

allIngs!: InvIngredient[]
ingSub!: Subscription

furnizorSearch: string = '';
ingredientSearch: string = '';
ingredientForm!: FormGroup;
nirForm!: FormGroup;
editMode: boolean = false

val: number = 0;
valTva: number = 0;
valTotal: number = 0;
valVanzare: number = 0;
nirId!: string

disableIngredientSearch: boolean = true

isTva: boolean = true
user!: User;
qtyCalcColor!: string
valCalcColor!: string
totalCalcColor!: string
qtyInputType: string = 'number'
valInputType: string = 'number'
inputType: string = 'number'
totalInputType: string = 'number'

  constructor(
    @Inject(NirService) private nirSrv: NirService,
    // @Inject(NirsService) private nirsSrv: NirsService,
    private ingSrv: IngredientService,
    @Inject(ActionSheetService) private actionSht: ActionSheetService,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.searchBarSuplier.setFocus()
    }, 500)
  }


  ngOnInit() {
    this.getUser()
    this.setupNirForm()
    this.setupIngForm()
    this.getNirToEdit()
    // this.getIngs()
    this.setTvaValidators()
  }

  getIngredients(){
    this.ingSub = this.ingSrv.ingredientsSend$.subscribe(response => {
      this.allIngs = response
      if(response.length > 1){

        this.disableIngredientSearch = false
      }
    })
  }

  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user){
        this.user = user
        this.getIngredients()
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }

  getNirToEdit(){
    const id = this.route.snapshot.paramMap.get('id')
    if(id && id !== "new") {
      this.nirSrv.getNir(id).subscribe(response => {
        if(response) {
          this.nirId = id
          this.nir = response.nir
          this.nirIngredients = this.nir.ingredients
          this.suplier = this.nir.suplier
          this.totalDoc = this.nir.totalDoc
          this.calcTotalsAftDiscount(this.nirIngredients)
          this.editMode = true
          this.nirForm.get('date')?.setValue(this.nir.documentDate)
          this.nirForm.get('document')?.setValue(this.nir.document)
          this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
          this.date = this.nir.documentDate
          // console.log(this.nir)
        }
      })
    }
  }

  setTvaValidators(){
    const tvaControl = this.ingredientForm.get('tva')
    const tvaValueControl = this.ingredientForm.get('tvaValue')
    const ValueControl = this.ingredientForm.get('value')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
    this.isTva ? tvaValueControl?.setValidators([Validators.required]) : tvaValueControl?.clearValidators()
    this.isTva ? ValueControl?.setValidators([Validators.required]) : ValueControl?.clearValidators()
  }


 async addSuplier(){
    const suplier = await this.actionSht.openModal(SuplierPage, true, false)
    this.suplier = suplier
  }


  setupNirForm(){
    this.nirForm = new FormGroup({
      nrDoc: new FormControl(null,{
        updateOn:'change',
      }),
      date: new FormControl(null,{
        updateOn:'change',
      }),
      document: new FormControl(null,{
        updateOn:'change',
      }),
    })

    // this.nirForm.get('date')?.setValue(new Date(Date.now()).toISOString())
    setTimeout(()=> {
      if(this.editMode){
        this.nirForm.get('nrDoc')?.setValue(this.nir.nrDoc)
        this.nirForm.get('date')?.setValue(this.nir.documentDate)
        this.nirForm.get('documen')?.setValue(this.nir.document)
      }
    }, 200)
  }

  switchCalcMode(id: string){
    if(id === 'value'){
      if(this.valCalcColor === 'primary'){
        this.evalValue()
      } else {
        this.valCalcColor = 'primary';
        this.valInputType = 'text'
      }
    }
    if(id === 'qty'){
      if(this.qtyCalcColor === 'primary'){
        this.evalQty()
      } else {
        this.qtyCalcColor = 'primary';
        this.qtyInputType = 'text'
      }
    }
    if(id === 'total'){
      if(this.totalCalcColor === 'primary'){
        this.evalTotal()
      } else {
        this.totalCalcColor = 'primary';
        this.totalInputType = 'text'
      }
    }


  }
  evalValue(){
    let input = this.ingredientForm.get('value')
    if(input){
      this.evalExpresssion(input)
      this.valCalcColor = ''
      this.valInputType = 'number'
    }
  }

  evalQty(){
    let input = this.ingredientForm.get('qty')
    if(input){
      this.evalExpresssion(input)
      this.qtyCalcColor = ''
      this.qtyInputType = 'number'
    }
  }
  evalTotal(){
    let input = this.ingredientForm.get('total')
    if(input){
      this.evalExpresssion(input)
      this.totalCalcColor = ''
      this.totalInputType = 'number'
    }
  }


  evalExpresssion(input: AbstractControl){
      const inputValue = input.value
      try{
        const result = eval(inputValue)
        input.setValue(round(+result))
      } catch(err){
        console.log(err)
        showToast(this.toastCtrl, 'Eroare la calcul', 2000)
      }
  }

  setupIngForm() {
    this.ingredientForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      um: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        qty: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      value: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tvaValue: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      total: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dep: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      gestiune: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      sellPrice: new FormControl(null, {
        updateOn: 'change',
      }),


    });
  };


  onQtyTab(ev: KeyboardEvent){
    if (ev.key === 'Tab') {
      const qtyControl = this.ingredientForm.get('qty');
      const priceControl = this.ingredientForm.get('price')
      const valueControl = this.ingredientForm.get('value');
      if(qtyControl && priceControl && valueControl){
          const qty = +qtyControl.value
          const price = priceControl.value
          valueControl.setValue(round(qty*price))
      }
    }
    if( ev.key === 'c'){
      this.switchCalcMode('qty')
    }
  }

  onValTab(ev: KeyboardEvent){
    if (ev.key === 'Tab') {
      const qtyControl = this.ingredientForm.get('qty');
      const priceControl = this.ingredientForm.get('price')
      const valueControl = this.ingredientForm.get('value');
      const tvaControl = this.ingredientForm.get('tva');
      const tvaValueControl = this.ingredientForm.get('tvaValue');
      const totalControl = this.ingredientForm.get('total');
      if(qtyControl && priceControl && valueControl && tvaControl){
          const qty = +qtyControl.value
          const value = +valueControl.value
          const tva = +tvaControl.value
          priceControl.setValue(round(value/qty))
          tvaValueControl?.setValue(round(value * tva / 100))
          totalControl?.setValue(round(value + (value * tva / 100)))
      }
    }
    if( ev.key === 'c'){
      this.switchCalcMode('value')
    }
  }


  calc(ev: KeyboardEvent){
    if( ev.key === 'c'){
      this.switchCalcMode('total')
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
    showToast(this.toastCtrl, "Valoarea TVA trebuie sa fie 19, 9, 5 sau 0", 3000)
   }

  }


  addToNir(){
    const ingredient: NirIngredient = {
      name: this.ingredientForm.value.name,
      price: this.ingredientForm.value.price,
      um: this.ingredientForm.value.um,
      qty: this.ingredientForm.value.qty,
      value: round(+this.ingredientForm.value.value),
      tva: +this.ingredientForm.value.tva,
      tvaValue: this.ingredientForm.value.tvaValue,
      total: round(this.ingredientForm.value.total),
      dep: this.ingredientForm.value.dep,
      gestiune: this.ingredientForm.value.gestiune,
      sellPrice: this.ingredientForm.value.sellPrice ? this.ingredientForm.value.sellPrice : 0
    }
    if(this.ingredientForm.valid){
      this.totalDoc += ingredient.total
      this.nirIngredients.push(ingredient)
      this.ingredientForm.reset()
      this.searchBar.setFocus()
      this.clacTotals(this.nirIngredients, -1)
    }
  }

  deleteEntry(index: number){
    if(this.nirIngredients.length)
    this.clacTotals(this.nirIngredients, index)
    setTimeout(()=>{
      this.nirIngredients.splice(index, 1)
    }, 100)
  }


  clacTotals(nirIngs: NirIngredient[], index: number){
    if(index !== -1){
      let ing = nirIngs[index]
      this.val = round(this.val - ing.value)
      this.valTva = round(this.valTva - ing.tvaValue)
      this.valTotal = round(this.valTotal -  ing.total)
      this.valVanzare = round(this.valVanzare - (ing.sellPrice *  ing.qty))
    } else {
          let ing =  nirIngs[nirIngs.length -1]
          this.val = round(this.val + ing.value)
          this.valTva = round(this.valTva +  ing.tvaValue)
          this.valTotal = round(this.valTotal +  ing.total)
          this.valVanzare = round(this.valVanzare + (ing.sellPrice *  ing.qty))
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


  saveNir(){
    if(this.nirForm.valid){
      if(this.editMode) {
        this.nirSrv.deleteNir(this.nirId).subscribe(response => {
          if(response && response.message){
            this.nir.documentDate = this.nirForm.value.date;
            this.nir.nrDoc = this.nirForm.value.nrDoc
            this.nir.suplier = this.suplier._id
            this.nir.document = this.nirForm.value.document
            this.nir.ingredients = this.nirIngredients
            this.nir.totalDoc = this.totalDoc
            console.log(this.nir)
            this.nirSrv.saveNir(this.nir, this.user.locatie).subscribe(response => {
              this.reserNirData()
              showToast(this.toastCtrl, "Nirul a fost editat cu success, stocul a fost actualizat!", 2000)
              this.router.navigateByUrl('/tabs/office/nirs')
            })
          }
        })
      } else {
        this.nir.documentDate = this.nirForm.value.date;
        this.nir.nrDoc = this.nirForm.value.nrDoc
        this.nir.suplier = this.suplier._id
        this.nir.document = this.nirForm.value.document
        this.nir.ingredients = this.nirIngredients
        this.nir.totalDoc = this.totalDoc
        this.nirSrv.saveNir(this.nir, this.user.locatie).subscribe(response=> {
          this.reserNirData()
          this.router.navigateByUrl('/tabs/office/nirs')
          showToast(this.toastCtrl, response.message, 2000)
        })
      }
    }
  }

  reserNirData(){
    this.nir =  {suplier: '', nrDoc: 0, documentDate: '', ingredients: [], discount: [], document: '', totalDoc: 0}
    this.nirIngredients = []
    this.val = 0
    this.suplier = undefined
    this.valTotal = 0
    this.valTva = 0
    this.valVanzare = 0
    this.totalDoc = 0
    this.nirForm.reset()
  }



  searchIngredient(ev: any){
    const input = ev.detail.value;
    this.ingredients = this.allIngs.filter(obj => obj.name.toLowerCase().includes(input))
    if(input === '') {
      this.ingredients = []
    }
  }

  setIng(ev: any){
    this.ingredientSearch = ''
    this.selectIngredient(this.ingredients[0])
  }

  selectIngredient(ingredient: any){
    this.ingredient = ingredient;
    if(this.ingredient){
      this.ingredientForm.get('name')?.setValue(this.ingredient.name)
      this.ingredientForm.get('um')?.setValue(this.ingredient.um)
      this.ingredientForm.get('dep')?.setValue(this.ingredient.dep)
      this.ingredientForm.get('gestiune')?.setValue(this.ingredient.gestiune)
      this.ingredientForm.get('price')?.setValue(this.ingredient.price)
      this.ingredientForm.get('tva')?.setValue(this.ingredient.tva.toString())
      this.ingredientForm.get('sellPrice')?.setValue(this.ingredient.sellPrice)
      this.ingredients = []
      this.qtyInput.setFocus()
      this.ingredientSearch = ''
    }
  }

  searchSuplier(ev: any){
    const input = ev.detail.value
    this.nirSrv.getSuplier(input, this.user.locatie).subscribe(response => {
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
          this.openDateModal()
        }
      }
  }

 async openDateModal(){
    const date = await this.actionSht.openAuth(DatePickerPage)
    if(date){
     this.nirForm.get('date')?.setValue(date)
     this.date = date
    }
  }

roundFor(num: number){
  return Math.round((num + Number.EPSILON) * 10000) / 10000;
}

formatDate(date: string){
  return formatedDateToShow(date).split('ora')[0]
}

}
