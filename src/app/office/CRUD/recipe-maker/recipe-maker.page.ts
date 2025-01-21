import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { RecipeMakerService } from './recipe-maker.service';
import { IonSearchbar } from '@ionic/angular/standalone';
import User from 'src/app/auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { InvIngredient } from 'src/app/models/nir.model';
import { IngredientService } from '../../ingredient/ingredient.service';


@Component({
  selector: 'app-recipe-maker',
  templateUrl: './recipe-maker.page.html',
  styleUrls: ['./recipe-maker.page.scss'],
  standalone: true,
  providers: [NavParams],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeMakerPage implements OnInit, OnChanges {

  @Input() top: any
  @Input() ings: any
  @Input() ingPage!: boolean
  @Input() impPage!: boolean
  @Input() hideIng: boolean = false
  @Input() hideTop: boolean = false

  @Output() ingsSend = new EventEmitter();
  @Output() toppSend = new EventEmitter();
  @Output() search = new EventEmitter()

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  form!: FormGroup
  ingredients: any[]  = [];
  ingredientSearch!:any ;

  productIngredientMode: boolean = false;
  toppings: any = [];

  displayIngs: any[] = [];
  ingredientsToSend: any[] = []

  productIngName: string = '';
  productIngUm: string = '';
  productIngQty: string = '';
  productIngGest: string = 'magazie'
  color: string = "transparent"

  recipeTotal: number = 0;

  user!: User
  dbIngs!: any

  isLoading: boolean = true


  constructor(
    private navParams: NavParams,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private recipeService: RecipeMakerService,
    private ingSrv: IngredientService,
    private toastCtrl: ToastController
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['top']) {
      if(changes['top'].currentValue !== undefined){
        this.toppings = changes['top'].currentValue
        this.toppSend.emit(this.toppings)
      }
    }
    if (changes['ings']) {
      if(changes['ings'].currentValue !== undefined) {
        this.displayIngs = changes['ings'].currentValue
        this.ingredientsToSend = []
        this.displayIngs.forEach(el => {
          const ing = {
            qty: el.qty,
            ing: el.ing._id
          }
          this.ingredientsToSend.push(ing)
          this.ingsSend.emit(this.ingredientsToSend)
        })
        this.calcrRecipeTotal(this.displayIngs)
      }
    }
  }

  ngOnInit() {
    this.getUser()
    // setTimeout(()=>{
    //   this.setDataToEdit()
    // }, 1100)
  }

  getUser(){
    Preferences.get({key: 'authData'}).then(data => {
      if(data.value){
        this.user = JSON.parse(data.value)
        this.getIngredients()
      }
    })
  }


  switchMode(){
    this.productIngredientMode = !this.productIngredientMode
  }



  saveProdIng(){
    if(this.productIngredientMode){
      this.displayIngs.forEach(el => {
        el.qty = this.round(el.qty / +this.productIngQty)
      })
      this.ingredientsToSend.forEach(el => {
        el.qty = this.round(el.qty / +this.productIngQty)
      })
      const prodIng: any = {
        name: this.productIngName,
        um: this.productIngUm,
        qty: 1,
        ings: this.ingredientsToSend,
        locatie: this.user.locatie,
        price: this.round(this.recipeTotal / +this.productIngQty),
        productIngredient: true,
        gestiune: this.productIngGest
      }
      this.productIngQty = '1'
      this.recipeTotal = +prodIng.price
      this.recipeService.saveIng(prodIng).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.displayIngs = [];
          this.ingredientsToSend = [];
          this.productIngredientMode = false,
          this.productIngName = '';
          this.productIngQty = '';
          this.productIngUm = '';
        }
      })
    }
  }

  deleteTop(index: number){
    this.toppings.splice(index, 1)
    this.toppSend.emit(this.toppings)
  }


  deleteIng(index: number){
    this.displayIngs.splice(index, 1)
    this.ingredientsToSend.splice(index, 1)
    this.calcrRecipeTotal(this.displayIngs)
    this.ingsSend.emit(this.ingredientsToSend)
  }

  // setDataToEdit(){
  //   if(this.top && this.top.length){
  //     this.toppings = this.top
  //     this.toppSend.emit(this.toppings)
  //   }
  //   if(this.ings && this.ings.length){
  //     this.displayIngs = this.ings
  //     this.displayIngs.forEach(el => {
  //       const ing = {
  //         qty: el.qty,
  //         ing: el.ing._id
  //       }
  //       this.ingredientsToSend.push(ing)
  //       this.ingsSend.emit(this.ingredientsToSend)
  //     })
  //     this.calcrRecipeTotal(this.displayIngs)
  //   }
  // }

  setIng(){
    this.selectIngredient(this.ingredients[0])
  }


  getIngredients(){
    this.ingSrv.ingredientsSend$.subscribe(response => {
      if(response){
        this.dbIngs = response
        this.isLoading = false
      }
    })
  }

  searchIngredient(ev: any){
    const searchQuery = ev.detail.value.toLowerCase()
    if(!this.ingPage){
    this.ingredients = this.dbIngs.filter((obj: InvIngredient) =>{
      if(obj.name){
        return obj.name.toLowerCase().includes(searchQuery)
      } else {
       return console.log(obj)
      }
    })

    if(searchQuery === ''){
      this.ingredients = []
    }
    } else {
      this.search.emit(searchQuery)
    }
  }



  async selectIngredient(ing: any){
    const data = await this.actionSrv.pickQty(PickQtyPage, {um: ing.um, name: ing.name, hideTop: this.hideTop, hideIng: this.hideIng, imp: this.impPage });
    if(data){
      this.searchbar.setFocus()
      if(data.mode === 'topping'){
        const topping = {
          name: ing.name,
          qty: data.qty,
          um: ing.um,
          price: data.price,
          ingPrice: ing.price * data.qty,
          ing: ing._id,
        }
        this.toppings.push(topping)
        this.toppSend.emit(this.toppings)
        this.ingredients = [];
        this.ingredientSearch = '';
      } else if(data.mode === 'ingredient'){
        const ingToSend = {qty: +data.qty, ing: ing._id}
        const ingToShow = {qty: +data.qty, ing: ing}
        this.displayIngs.push(ingToShow);
        this.ingredientsToSend.push(ingToSend)
        this.ingsSend.emit(this.ingredientsToSend)
        this.calcrRecipeTotal(this.displayIngs);
        this.ingredients = [];
        this.ingredientSearch = '';
      }
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openPayment(AddIngredientPage, [])
   if(ing){
     this.recipeService.saveIng(ing).subscribe(response => {
      this.ingSrv.addIngredinet(response.ing)
      showToast(this.toastCtrl, response.message, 4000)
     })
   }
  }


  round(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

calcrRecipeTotal(ings: any){
  this.recipeTotal = 0
  ings.forEach((ing: any) => {
    const price = ing.ing.price
    const tva = ing.ing.tva / 100
    const priceWithTva = price + price * tva
    this.recipeTotal = this.recipeTotal + (priceWithTva * ing.qty)
  })
}





}
