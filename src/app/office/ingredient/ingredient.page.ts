import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RecipeMakerPage } from '../CRUD/recipe-maker/recipe-maker.page';
import { IngredientService } from './ingredient.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AddIngredientPage } from '../CRUD/add-ingredient/add-ingredient.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ProductIngredientPage } from '../CRUD/product-ingredient/product-ingredient.page';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.page.html',
  styleUrls: ['./ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage]
})
export class IngredientPage implements OnInit {

  ingredients: any = [];

  ingPage: boolean = true

  topToEdit!: any;
  ingsToEdit!: any;

  toppings!: any;
  productIngredients!: any;


  constructor(
    private toastCtrl: ToastController,
    private ingSrv: IngredientService,
    @Inject(ActionSheetService) private actionSh: ActionSheetService
  ) { }

  ngOnInit() {
    this.getIngredients()
  }

  getIngredients(){
    this.ingSrv.getIngredients('').subscribe(response => {
      if(response){
        this.ingredients = response
      }
    })
  }

  onTopRecive(ev: any){

  }

 async ingEdit(ing: any){
  if(ing.ings.length){
    const message = await this.actionSh.openModal(ProductIngredientPage, ing, false)
    if(message === 'done'){
      this.getIngredients()
    }
  } else {
    const ingToEdit = await this.actionSh.openModal(AddIngredientPage, ing, false)
    if(ingToEdit){
      this.ingSrv.editIngredient(ing._id, ingToEdit).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }
  }

  async deleteIng(id: string, name: string){
    const result = await this.actionSh.deleteAlert(`Ești sigur ca vrei să ștergi ingredinetul ${name}! Cand stergi un ingredient il stergi din toate rețetele în care a fost folosit!`, "Sterge")
    if(result){
      this.ingSrv.deleteIngredient(id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.getIngredients()
        }
      })
    }
  }

  searchRecive(searchQuery: string){
    this.ingSrv.getIngredients(searchQuery).subscribe(response => {
      if(response){
        this.ingredients = response
      }
    })
  }

  onIngRecive(ev: any){
    this.productIngredients = ev
  }

}
