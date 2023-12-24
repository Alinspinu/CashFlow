import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProductService } from '../product/product.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { IngredientPage } from '../ingredient/ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { RecipeMakerService } from './recipe-maker.service';
import { ProductIngredient } from 'src/app/models/table.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-recipe-maker',
  templateUrl: './recipe-maker.page.html',
  styleUrls: ['./recipe-maker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeMakerPage implements OnInit, OnChanges {

  @Input() top: any
  @Input() ings: any
  @Input() hideIng: boolean = false
  @Input() hideTop: boolean = false

  @Output() ingsSend = new EventEmitter();
  @Output() toppSend = new EventEmitter();

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

  recipeTotal: number = 0;


  constructor(
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
    console.log('ings', this.hideIng)
    console.log('topping', this.hideTop)
    setTimeout(()=>{
      this.setDataToEdit()
    }, 900)
  }


  switchMode(){
    this.productIngredientMode = !this.productIngredientMode
  }



  saveProdIng(){
    if(this.productIngredientMode){
      this.displayIngs.forEach(el => {
        el.qty = el.qty / +this.productIngQty
      })
      const prodIng: ProductIngredient = {
        name: this.productIngName,
        um: this.productIngUm,
        qty: 1,
        ings: this.displayIngs,
        locatie: environment.LOCATIE,
        price: this.round(this.recipeTotal / +this.productIngQty)
      }
      this.productIngQty = '1'
      this.recipeTotal = +prodIng.price
      this.recipeService.saveProductIngredient(prodIng).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.displayIngs = []
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
  }

  deleteIng(index: number){
    this.displayIngs.splice(index, 1)
  }

  setDataToEdit(){
    if(this.top){
      this.toppings = this.top
    }
    if(this.ings){
      this.displayIngs = this.ings
    }
  }

  searchIngredient(ev: any){
    const input = ev.detail.value;
    this.recipeService.getIngredients(input).subscribe(response => {
      this.ingredients = response
      if(input === ''){
        this.ingredients = []
      }
    })
  }



  async selectIngredient(ing: any){
    const data = await this.actionSrv.pickQty(PickQtyPage, {um: ing.um, name: ing.name, hideTop: this.hideTop, hideIng: this.hideIng });
    if(data){
      if(data.mode === 'topping'){
        let ings = []
        if(ing.ings){
          ings = ing.ings
        }
        const topping = {
          name: ing.name,
          qty: data.qty,
          um: ing.um,
          price: data.price,
          ingPrice: ing.price,
          ings: ings,
        }
        this.toppings.push(topping)
        this.toppSend.emit(this.toppings)
        this.ingredients = [];
        this.ingredientSearch = '';
      } else if(data.mode === 'ingredient'){
        ing.qty = +data.qty;
        this.displayIngs.push(ing);
        this.ingsSend.emit(this.displayIngs)
        this.calcrRecipeTotal(ing);
        this.ingredients = [];
        this.ingredientSearch = '';
      }
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openModal(IngredientPage, [], false)
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
    this.recipeTotal = this.recipeTotal + (ing.price * ing.qty)
}



}
