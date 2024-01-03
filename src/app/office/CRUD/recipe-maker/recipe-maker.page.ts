import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ToastController } from '@ionic/angular';
import { ProductService } from '../product/product.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { RecipeMakerService } from './recipe-maker.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IonSearchbar } from '@ionic/angular/standalone';


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

  recipeTotal: number = 0;


  constructor(
    private navParams: NavParams,
    @Inject(ProductService) private prodSrv: ProductService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private recipeService: RecipeMakerService,
    private toastCtrl: ToastController
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['top']) {
      if(changes['top'].currentValue !== undefined){
        this.toppings = changes['top'].currentValue
      }
    } else if (changes['ings']) {
      if(changes['ings'].currentValue !== undefined) {
        this.displayIngs = changes['ings'].currentValue
      }
    }
  }

  ngOnInit() {
    setTimeout(()=>{
      this.setDataToEdit()
    }, 1100)
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
        locatie: environment.LOCATIE,
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
    this.ingsSend.emit(this.ingredientsToSend)
  }

  setDataToEdit(){
    if(this.top && this.top.length){
      this.toppings = this.top
      this.toppSend.emit(this.toppings)
    }
    if(this.ings && this.ings.length){
      this.displayIngs = this.ings
      this.displayIngs.forEach(el => {
        const ing = {
          qty: el.qty,
          ing: el.ing._id
        }
        this.ingredientsToSend.push(ing)
        this.ingsSend.emit(this.ingredientsToSend)
        this.calcrRecipeTotal(el)
      })
    }
  }

  setIng(){
    this.selectIngredient(this.ingredients[0])
  }

  searchIngredient(ev: any){
    const input = ev.detail.value;
    if(!this.ingPage){
      this.recipeService.getIngredients(input).subscribe(response => {
        this.ingredients = response
        if(input === ''){
          this.ingredients = []
        }
      })
    } else {
      this.search.emit(input)
    }
  }



  async selectIngredient(ing: any){
    const data = await this.actionSrv.pickQty(PickQtyPage, {um: ing.um, name: ing.name, hideTop: this.hideTop, hideIng: this.hideIng });
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
        this.calcrRecipeTotal(ingToShow);
        this.ingredients = [];
        this.ingredientSearch = '';
      }
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openModal(AddIngredientPage, [], false)
   if(ing){
     this.recipeService.saveIng(ing).subscribe(response => {
      showToast(this.toastCtrl, response.message, 4000)
     })
   }
  }


  round(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

calcrRecipeTotal(ing: any){
    this.recipeTotal = this.recipeTotal + (ing.ing.price * ing.qty)
}



}
