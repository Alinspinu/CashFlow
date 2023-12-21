import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {Preferences} from "@capacitor/preferences"
import { Nir, NirIngredient } from '../../../models/nir.model';
import { NirService } from './nir.service';
import { round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { SuplierPage } from '../suplier/suplier.page';

@Component({
  selector: 'app-nir',
  templateUrl: './nir.page.html',
  styleUrls: ['./nir.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class NirPage implements OnInit {

nirIngredients: NirIngredient[] = []
ingredients: any = [];
ingredient!: any;
supliers: any = [];
suplier!: any
nir: Nir = {suplier: '', nrDoc: 0, date: '', ingredients: [] }

furnizorSearch: string = '';
ingredientSearch: string = '';
ingredientForm!: FormGroup;
nirForm!: FormGroup;

val: number = 0;
valTva: number = 0;
valTotal: number = 0;
valVanzare: number = 0;

isTva: boolean = true


  constructor(
    @Inject(NirService) private nirSrv: NirService,
    @Inject(ActionSheetService) private actionSht: ActionSheetService
  ) { }

  ngOnInit() {
    this.setupIngForm()
    this.setupNirForm()
    this.getIngs()
    this.setTvaValidators()
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
    const suplier = await this.actionSht.openModal(SuplierPage, '', false)
    this.suplier = suplier
    console.log(suplier)
  }


  setupNirForm(){
    this.nirForm = new FormGroup({
      nrDoc: new FormControl(null,{
        updateOn:'change',
        validators: [Validators.required]
      }),
      date: new FormControl(null,{
        updateOn:'change',
        validators: [Validators.required]
      }),
    })
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

    this.ingredientForm.get('qty')?.valueChanges.subscribe(this.updateValueField);
    this.ingredientForm.get('price')?.valueChanges.subscribe(this.updateValueField);
    this.ingredientForm.get('value')?.valueChanges.subscribe(this.updateValueField);
    this.ingredientForm.get('tva')?.valueChanges.subscribe(this.updateValueField);
  };


  private updateValueField = () => {
    const qtyControl = this.ingredientForm.get('qty');
    const priceControl = this.ingredientForm.get('price')
    const valueControl = this.ingredientForm.get('value');
    const tvaControl = this.ingredientForm.get('tva');
    const tvaValueControl = this.ingredientForm.get('tvaValue');
    const totalControl = this.ingredientForm.get('total');
    if (qtyControl && priceControl && valueControl && tvaValueControl && tvaControl && totalControl) {
      const qty = qtyControl.value || 0;
      const price = priceControl.value || 0;
      const tva = +tvaControl.value || 0;
      const value = qty * price;
      const tvaValue = value * (tva/100)
      valueControl.setValue(value, { emitEvent: false });
      tvaValueControl.setValue(round(tvaValue), { emitEvent: false })
      totalControl.setValue(tvaValue+value, { emitEvent: false })
    }
  };


  addToNir(){
    const ingredient: NirIngredient = {
      name: this.ingredientForm.value.name,
      price: this.ingredientForm.value.price,
      um: this.ingredientForm.value.um,
      qty: this.ingredientForm.value.qty,
      value: this.ingredientForm.value.value,
      tva: +this.ingredientForm.value.tva,
      tvaValue: this.ingredientForm.value.tvaValue,
      total: this.ingredientForm.value.total,
      dep: this.ingredientForm.value.dep,
      gestiune: this.ingredientForm.value.gestiune,
      sellPrice: this.ingredientForm.value.sellPrice ? this.ingredientForm.value.sellPrice : 0
    }
    if(this.ingredientForm.valid){
      this.nirIngredients.push(ingredient)
      this.ingredientForm.reset()
      this.clacTotals(this.nirIngredients)
    }
  }


  clacTotals(nirIngs: NirIngredient[]){
    nirIngs.forEach(el => {
      this.val = round(this.val + el.value)
      this.valTva = round(this.valTva + el.tvaValue)
      this.valTotal = round(this.valTotal + el.total)
      this.valVanzare = round(this.valVanzare + (el.sellPrice * el.qty))
   })
  }


  saveNir(){
    if(this.nirForm.valid){
      this.nir.date = this.nirForm.value.date;
      this.nir.nrDoc = this.nirForm.value.nrDoc
      this.nir.suplier = this.suplier._id
      this.nir.ingredients = this.nirIngredients
      this.nirSrv.saveNir(this.nir).subscribe()
    }

  }

  getIngs(){
    Preferences.get({key: 'ings'}).then(result => {
      if(result && result.value){
        this.nirIngredients = JSON.parse(result.value)
      }
    })
  }


  searchIngredient(ev: any){
    const input = ev.detail.value;
    this.nirSrv.getIngredients(input).subscribe(response => {
      this.ingredients = response
      console.log(response)
      if(input === ''){
        this.ingredients = []
      }
    })
  }

  selectIngredient(ingredient: any){
    this.ingredient = ingredient;
    this.ingredientForm.get('name')?.setValue(this.ingredient.name)
    this.ingredientForm.get('um')?.setValue(this.ingredient.um)
    this.ingredientForm.get('dep')?.setValue(this.ingredient.dep)
    this.ingredientForm.get('gestiune')?.setValue(this.ingredient.gestiune)
    this.ingredientForm.get('price')?.setValue(this.ingredient.price)
    this.ingredientForm.get('tva')?.setValue(this.ingredient.tva.toString())
    this.ingredients = []
  }

  searchSuplier(ev: any){
    const input = ev.detail.value
    this.nirSrv.getSuplier(input).subscribe(response => {
      this.supliers = response
      if(input === ''){
        this.supliers = []
      }
    })
  }

  selectSuplier(suplier: any){
   this.suplier = suplier;
    this.supliers = []
    this.furnizorSearch = ''
  }


}
