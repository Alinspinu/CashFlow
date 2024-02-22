import { Component, EventEmitter, inject, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ProductService } from '../product/product.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { environment } from 'src/environments/environment';
import { RecipeMakerService } from '../recipe-maker/recipe-maker.service';
import { Preferences } from '@capacitor/preferences';
import User from 'src/app/auth/user.model';
import { InvIngredient } from 'src/app/models/nir.model';


@Component({
  selector: 'app-product-ingredient',
  templateUrl: './product-ingredient.page.html',
  styleUrls: ['./product-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductIngredientPage implements OnInit {


  form!: FormGroup
  ingredients: any[]  = [];
  ingredientSearch!:any ;

  productIngredientMode: boolean = false;
  toppings: any = [];

  dbIngs!: any

  displayIngs: any[] = [];
  ingredientsToSend: any[] = []

  productIngName: string = '';
  productIngUm: string = '';
  productIngQty: string = '';
  productIngGest: string = 'magazie'
  productIngDep!: string

  recipeTotal: number = 0;

  user!: User
  productId!: string


  constructor(
    private navParams: NavParams,
    @Inject(RecipeMakerService) private recipeService: RecipeMakerService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getUser()
    setTimeout(()=>{
      this.getProdIng()
    }, 100)
  }

  getUser(){
    Preferences.get({key: 'authData'}).then(data => {
      if(data.value){
        this.user = JSON.parse(data.value)
      }
    })
  }

  getProdIng(){
      const product = this.navParams.get('options')
      console.log(product)
      if(product){
        this.productIngredientMode = true;
        this.productIngName = product.name;
        this.productIngUm = product.um;
        this.productIngQty = product.qty.toString();
        this.productIngGest = product.gestiune;
        this.displayIngs = product.ings
        this.productId = product._id
        this.productIngDep = product.dep
        this.displayIngs.forEach(el => {
          const ing = {
            qty: el.qty,
            ing: el.ing._id
          }
          this.ingredientsToSend.push(ing)
          this.recipeTotal += (el.qty * el.ing.price)
        })
      }


  }

  switchMode(){
    this.productIngredientMode = !this.productIngredientMode
  }



  saveProdIng(){
    if(this.productIngredientMode){
      this.displayIngs.forEach(el => {
        el.qty = el.qty / +this.productIngQty
      })
      this.ingredientsToSend.forEach(el => {
        el.qty = el.qty / +this.productIngQty
      })
      const prodIng: any = {
        name: this.productIngName,
        um: this.productIngUm,
        qty: 1,
        ings: this.ingredientsToSend,
        locatie: this.user.locatie,
        gestiune: this.productIngGest,
        dep: this.productIngDep,
        price: this.round(this.recipeTotal / +this.productIngQty),
        productIngredient: true,
      }
      this.productIngQty = '1'
      this.recipeTotal = +prodIng.price
      this.recipeService.editIng(prodIng, this.productId).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.modalCtrl.dismiss("done")
        }
      })
    }
  }

  deleteTop(index: number){
    this.toppings.splice(index, 1)
  }


  deleteIng(index: number){
    this.displayIngs.splice(index, 1)
    this.ingredientsToSend.splice(index, 1)
  }

  getIngredients(){
    this.recipeService.getIngredients(this.user.locatie).subscribe(response => {
      if(response){
        this.dbIngs = response
      }
    })
  }

  searchIngredient(ev: any){
    const searchQuery = ev.detail.value
    this.ingredients = this.dbIngs.filter((obj: InvIngredient) => obj.name.toLowerCase().includes(searchQuery))
    if(searchQuery === ''){
      this.ingredients = []
    }

  }



  async selectIngredient(ing: any){
    const data = await this.actionSrv.pickQty(PickQtyPage, {um: ing.um, name: ing.name, hideTop: true, hideIng: false });
    if(data){
        const ingToSend = {qty: +data.qty, ing: ing._id}
        const ingToShow = {qty: +data.qty, ing: ing}
        this.displayIngs.push(ingToShow);
        this.ingredientsToSend.push(ingToSend)
        this.calcrRecipeTotal(ingToShow);
        this.ingredients = [];
        this.ingredientSearch = '';
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openModal(AddIngredientPage, [], false)
   if(ing){
     this.recipeService.saveIng(ing, this.user.locatie).subscribe(response => {
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
