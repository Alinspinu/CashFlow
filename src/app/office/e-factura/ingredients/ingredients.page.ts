import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { InvIngredient } from 'src/app/models/nir.model';
import { Subscription } from 'rxjs';
import { IngredientService } from '../../ingredient/ingredient.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddIngredientPage } from '../../CRUD/add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { RecipeMakerService } from '../../CRUD/recipe-maker/recipe-maker.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngredientsPage implements OnInit, OnDestroy {


  ingredients: InvIngredient[]  = [];
  dbIngs: InvIngredient[] = []

  ingredientSearch!:any ;
  isLoading: boolean = true
  ingSub!: Subscription

  productName: string = '';
  suplierName: string = '';
  productUm: string = '';

  ing!: InvIngredient


  constructor(
    private ingSrv: IngredientService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private toastCtrl: ToastController,
    private recipeService: RecipeMakerService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    const data = this.navParams.get('options')
    if(data) {
      this.productName = data.name;
      this.suplierName = data.suplier;
      this.productUm = data.um;
      this.getIngredients()
    }
  }

  ngOnDestroy(): void {
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }


  getIngredients(){
    this.ingSub = this.ingSrv.ingredientsSend$.subscribe(response => {
      if(response){
        this.dbIngs = response
        this.isLoading = false
      }
    })
  }




  async selectIngredient(ing: InvIngredient){
    const data = await this.actionSrv.numberAlert('Corecție de cantitate', `Adaugă corecție de cantitate (pune 1 dacă unitatea de masura de pe factura -${this.productUm}-  coincide cu unitatea de măsură a ingredientului)`, 'val', 'Corecție cantitate');
    if (data){
      const update = {
        suplier: this.suplierName,
        name: this.productName,
        qtyCorector: data
      }
      ing.eFactura.push(update)
      this.ing = ing
      this.ingSrv.editIngredient(ing._id, ing).subscribe({
        next: (response) => {
          this.modalCtrl.dismiss(this.ing)
          showToast(this.toastCtrl, response.message, 2000)
        }, 
        error: (error) => {
          showToast(this.toastCtrl, error.message, 4000)
          console.log(error)
        }
      })
    } else {
      this.modalCtrl.dismiss(null)
    }

  }

  setIng(){
    this.selectIngredient(this.ingredients[0])
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


   searchIngredient(ev: any){
    const searchQuery = ev.detail.value.toLowerCase()
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
 
  }

  close(){
    this.modalCtrl.dismiss(null)
  }


}
