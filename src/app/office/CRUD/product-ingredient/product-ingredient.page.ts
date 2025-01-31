import { Component, EventEmitter, inject, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickQtyPage } from 'src/app/modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { RecipeMakerService } from '../recipe-maker/recipe-maker.service';
import { Preferences } from '@capacitor/preferences';
import User from 'src/app/auth/user.model';
import { InvIngredient } from 'src/app/models/nir.model';
import { IngredientService } from '../../ingredient/ingredient.service';
import { Subscription, take } from 'rxjs';
import { RecipeMakerPage } from '../recipe-maker/recipe-maker.page';
import { emptyIng } from 'src/app/models/empty-models';


@Component({
  selector: 'app-product-ingredient',
  templateUrl: './product-ingredient.page.html',
  styleUrls: ['./product-ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage]
})
export class ProductIngredientPage implements OnInit {

  productIngredient: InvIngredient = emptyIng()

  ingredientsToSend: InvIngredient[] = []

  recipeTotal: number = 0;


  isLoading: boolean = true


  constructor(
    private navParams: NavParams,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.getProdIng()
  }

  out(ev: any){
    if(ev){
      this.close()
    }
  }

  close(){
     this.modalCtrl.dismiss(null)
  }

  async deleteIng(){
    const result = await this.actionSheetService.deleteAlert(`Ești sigur ca vrei să ștergi ingredinetul ${this.productIngredient.name}! Cand stergi un ingredient il stergi din toate rețetele în care a fost folosit!`, "Sterge")
    if(result){
      this.ingredientService.deleteIngredient(this.productIngredient._id).pipe(take(1)).subscribe(response => {
        if(response){
          this.close()
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }

  getProdIng(){
      const product = this.navParams.get('options')
      if(product){
        this.productIngredient = product
        console.log(this.productIngredient)
        this.ingredientsToSend = JSON.parse(JSON.stringify(product.ings))
      }


  }











}
