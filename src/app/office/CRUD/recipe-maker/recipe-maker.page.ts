import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ProductService } from '../product/product.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { IngredientPage } from '../ingredient/ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { InvIngredient } from 'src/app/models/nir.model';


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

  @Output() ingsSend = new EventEmitter();
  @Output() toppSend = new EventEmitter();

  form!: FormGroup
  ingredients: InvIngredient[] = [];
  ingredientSearch!:any ;

  toppings: any = [];
  productIngredients: InvIngredient[] = [];

  recipeTotal: number = 0;

  constructor(
    @Inject(ProductService) private prodSrv: ProductService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private toastCtrl: ToastController
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['top']) {
      if(changes['top'].currentValue !== undefined){
        this.toppings = changes['top'].currentValue
      }
    } else if (changes['ings']) {
      if(changes['ings'].currentValue !== undefined) {
        this.productIngredients = changes['ings'].currentValue
      }
    }
  }

  ngOnInit() {
    setTimeout(()=>{
      this.setDataToEdit()
    }, 200)
  }

  deleteTop(index: number){
    this.toppings.splice(index, 1)
  }

  deleteIng(index: number){
    this.productIngredients.splice(index, 1)
  }

  setDataToEdit(){
    if(this.top){
      this.toppings = this.top
      console.log(this.top)
    }
    if(this.ings){
      this.productIngredients = this.ings
      console.log(this.ings)
    }
  }

  searchIngredient(ev: any){
    const input = ev.detail.value;
    this.prodSrv.getIngredients(input).subscribe(response => {
      this.ingredients = response
      if(input === ''){
        this.ingredients = []
      }
    })
  }



  async selectIngredient(ing: InvIngredient){
    const data = await this.actionSrv.pickQty(PickQtyPage, {um: ing.um, name: ing.name});
    if(data){
      if(data.mode === 'topping'){
        const topping = {
          name: ing.name,
          qty: data.qty,
          um: ing.um,
          price: data.price,
          ingPrice: ing.price
        }
        this.toppings.push(topping)
        this.toppSend.emit(this.toppings)
        this.ingredients = [];
        this.ingredientSearch = '';
      } else if(data.mode === 'ingredient'){
        ing.qty = +data.qty;
        this.productIngredients.push(ing);
        this.ingsSend.emit(this.productIngredients)
        this.calcrRecipeTotal(ing);
        this.ingredients = [];
        this.ingredientSearch = '';
      }
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openModal(IngredientPage, [], false)
   if(ing){
     this.prodSrv.saveIng(ing).subscribe(response => {
      showToast(this.toastCtrl, response.message, 4000)
     })
   }
  }


  round(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

calcrRecipeTotal(ing: any){
    this.recipeTotal = this.recipeTotal+ (ing.price * ing.qty)
}

}
