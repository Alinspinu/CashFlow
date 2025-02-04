import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { IonSearchbar } from '@ionic/angular/standalone';
import User from 'src/app/auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { Dep, Gestiune, InvIngredient } from 'src/app/models/nir.model';
import { IngredientService } from '../../ingredient/ingredient.service';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { emptyIng } from 'src/app/models/empty-models';


@Component({
  selector: 'app-recipe-maker',
  templateUrl: './recipe-maker.page.html',
  styleUrls: ['./recipe-maker.page.scss'],
  standalone: true,
  providers: [NavParams],
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class RecipeMakerPage implements OnInit, OnChanges {

  @Input() top: any
  @Input() ings: any
  @Input() ingPage!: boolean
  @Input() impPage: boolean = false
  @Input() hideIng: boolean = false
  @Input() hideTop: boolean = false
  @Input() product: InvIngredient = emptyIng()
  @Input() nir: boolean = false

  @Output() ingsSend = new EventEmitter();
  @Output() toppSend = new EventEmitter();
  @Output() search = new EventEmitter()
  @Output() out = new EventEmitter()

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  form!: FormGroup
  ingredients: any[]  = [];
  ingredientSearch!:any ;

  productIngredientMode: boolean = false;
  editMode: boolean = false;
  toppings: any = [];
  departament: string | undefined = ''
  gestiune: string | undefined = ''

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

  gest: Gestiune[] = []
  deps: Dep[] = []


  constructor(
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
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
        this.ingsSend.emit(this.displayIngs)
        this.calcrRecipeTotal(this.displayIngs)
      }
    }
  }

  ngOnInit() {
    this.getUser()
    this.getDeps()
    this.getGest()
    if(this.product._id.length){
      this.productIngredientMode = true
      if(this.product.dept) this.departament = this.product.dept._id
      if(this.product.gest) this.gestiune = this.product.gest._id
      this.editMode = true
    }
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
      this.ingredientsToSend = []
      this.displayIngs.forEach(el => {
        el.qty = this.round(el.qty / this.product.qty)
        const ing = {
          qty: el.qty,
          ing: el.ing._id
        }
        this.ingredientsToSend.push(ing)
      })
      this.product.price = this.round(this.recipeTotal / this.product.qty)
      this.product.qty = 1
      this.recipeTotal = this.product.price
      this.product.ings = this.ingredientsToSend
      const gest = this.gest.find(g=> g._id === this.gestiune)
      if(gest){
        this.product.gest = gest
      }
      const dep = this.deps.find(d=> d._id === this.departament)
      if(dep) {
        this.product.dept = dep
      }
      if(this.editMode){
        this.ingSrv.editIngredient(this.product._id, this.product).subscribe(response => {
          if(response){
            this.out.emit(true)
            showToast(this.toastCtrl, response.message, 3000)
          }
        })
      } else {
        this.ingSrv.addIngredinet(this.product).subscribe(response => {
          if(response){
            showToast(this.toastCtrl, response.message, 3000)
            this.displayIngs = [];
            this.ingredientsToSend = [];
            this.productIngredientMode = false;
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
    this.calcrRecipeTotal(this.displayIngs)
    this.ingsSend.emit(this.displayIngs)
  }


  setIng(){
    if(this.nir){
      this.selctNirIngredient(this.ingredients[0])
    } else {
      this.selectIngredient(this.ingredients[0])
    }
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


  async addIngredient(ing: any){
    if(this.nir){
      this.selctNirIngredient(ing)
    } else {
      this.selectIngredient(ing)
    }
  }

  selctNirIngredient(ing: any){
    this.ingsSend.emit(ing)
    this.ingredientSearch = '';
    this.ingredients = [];
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
        const ingToShow = {qty: +data.qty, ing: ing}
        this.displayIngs.push(ingToShow);
        this.ingsSend.emit(this.displayIngs)
        this.calcrRecipeTotal(this.displayIngs);
        this.ingredients = [];
        this.ingredientSearch = '';
      }
    }
  }

  async addIng(){
   const ing = await this.actionSrv.openAdd(AddIngredientPage, [], 'add-modal')
   if(ing){
    this.ingSrv.addIngredinet(ing).subscribe({
      next: (response) => {
        showToast(this.toastCtrl, response.message, 4000)
      }
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



getDeps(){
  this.ingSrv.getDep().subscribe({
    next: (response) => {
      this.deps = response
    },
    error: (error) => {
      console.log(error)
    }
  })

}


getGest(){
  this.ingSrv.getGestiune().subscribe({
    next: (response) => {
      this.gest = response
    },
    error: (error) => {
      console.log(error)
    }
  })
}

}
