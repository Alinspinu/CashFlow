import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Form, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonSearchbar, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IngredientService } from '../../../ingredient/ingredient.service';
import { InvIngredient, NirIngredient } from '../../../../models/nir.model';
import User from '../../../../auth/user.model';
import { getUserFromLocalStorage, round } from '../../../../shared/utils/functions';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular/standalone';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { NirService } from '../nir.service';

@Component({
  selector: 'app-add-ing',
  templateUrl: './add-ing.page.html',
  styleUrls: ['./add-ing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddIngPage implements OnInit, OnDestroy {


  @ViewChild('qtyInput', { static: false }) qtyInput!: IonInput;
  @ViewChild('searchBar', {static: false}) searchBar!: IonSearchbar


  ingredientSearch: string = '';
  ingredientForm!: FormGroup

  allIngs: InvIngredient[] = []
  ingredients: InvIngredient [] = [];
  ingredient!: NirIngredient

  user!: User;

  ingSub!: Subscription

  disableIngredientSearch: boolean = true
  isTva: boolean = true

  totalDoc: number = 0

  qtyCalcColor!: string
  valCalcColor!: string
  totalCalcColor!: string
  qtyInputType: string = 'number'
  valInputType: string = 'number'
  inputType: string = 'number'
  totalInputType: string = 'number'

  constructor(
    private ingSrv: IngredientService,
    private router: Router,
    private toastCtrl: ToastController,
    private nirSrv: NirService,
  ) { }


  ngOnDestroy(): void {
      if(this.ingSub){
        this.ingSub.unsubscribe()
      }
  }


  ngOnInit() {
    this.getIngredients()
    this.setupIngForm()
    this.setTvaValidators()
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
      this.nirSrv.addNirIngs(ingredient)
      this.ingredientForm.reset()
      this.searchBar.setFocus()
      // this.clacTotals(this.nirIngredients, -1)
    }
  }




  getIngredients(){
    this.ingSub = this.ingSrv.ingredientsSend$.subscribe(response => {
      this.allIngs = response
      if(response.length > 1){
        this.disableIngredientSearch = false
      }
    })
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


  setTvaValidators(){
    const tvaControl = this.ingredientForm.get('tva')
    const tvaValueControl = this.ingredientForm.get('tvaValue')
    const ValueControl = this.ingredientForm.get('value')
    this.isTva ? tvaControl?.setValidators([Validators.required]) : tvaControl?.clearValidators()
    this.isTva ? tvaValueControl?.setValidators([Validators.required]) : tvaValueControl?.clearValidators()
    this.isTva ? ValueControl?.setValidators([Validators.required]) : ValueControl?.clearValidators()
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



  calc(ev: KeyboardEvent){
    if( ev.key === 'c'){
      this.switchCalcMode('total')
    }
  }

}
