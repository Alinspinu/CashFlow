import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { InvIngredient } from 'src/app/models/nir.model';
import { firstValueFrom, Subscription } from 'rxjs';
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
  ingID!: string
  ingName!: string

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

  async ngOnInit() {
    const data = this.navParams.get('options')
    if(data) {
      this.productName = data.name;
      this.suplierName = data.suplier;
      this.productUm = data.um;
      this.ingID = data.ingID
      this.ingName = data.ingName
      await this.removeEFacturaUpdate()
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


  async removeEFacturaUpdate(): Promise<boolean> {
    if (!this.ingID) return false;

    const accept = await this.actionSrv.deleteAlert(
      `Dacă alegi un ingredient nou pentru ${this.productName}, vei dezasocia ingredientul ${this.ingName}`,
      'Dezasociere',
    );

    if (!accept) return false;

    const ing = this.ingSrv.getIng(this.ingID);
    if (!ing) return false;

    const index = ing.eFactura.findIndex(u => u.name === this.productName);
    if (index === -1) return false;

    ing.eFactura.splice(index, 1);

    try {
      await firstValueFrom(this.ingSrv.editIngredient(ing._id, ing))
      showToast(this.toastCtrl, `Ingredientul ${this.ingName} a fost dezasociat`, 3000);
      return true;
    } catch (error: any) {
      console.log(error)
      showToast(this.toastCtrl, error.message, 4000);
      return false;
    }
  }


  async selectIngredient(ing: InvIngredient){
    const data = await this.actionSrv.numberAlert('Corecție de cantitate', `Adaugă corecție de cantitate (pune 1 dacă unitatea de masura de pe factura -${this.productUm}-  coincide cu unitatea de măsură a ingredientului)`, 'val', 'Corecție cantitate', '');
    if (data){
      const update = {
        suplier: this.suplierName,
        name: this.productName,
        qtyCorector: data
      }
      const existingUpdate = ing.eFactura.find(u => u.name === update.name)
      if(existingUpdate){
        existingUpdate.suplier = update.suplier
        existingUpdate.qtyCorector = update.qtyCorector
      } else{
        ing.eFactura.push(update)
      }
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
    const ing = await this.actionSrv.openAdd(AddIngredientPage, [], 'add-modal')
    if(ing){
       this.ingSrv.addIngredinet(ing).subscribe({
        next: (response) =>{
          showToast(this.toastCtrl, response.message, 4000)
        }
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
