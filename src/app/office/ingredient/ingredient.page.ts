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
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import User from 'src/app/auth/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.page.html',
  styleUrls: ['./ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage, CapitalizePipe]
})
export class IngredientPage implements OnInit {

  ingredients: any = [];

  ingPage: boolean = true

  topToEdit!: any;
  ingsToEdit!: any;
  user!: User

  toppings!: any;
  productIngredients!: any;
  gestiuni: string[] = ["bar", "bucatarie", "magazie"]
  ingTypes: string[] = ["simplu", "compus"]
  filter: {gestiune: string, type: string} = {gestiune: '', type: ''}


  constructor(
    private toastCtrl: ToastController,
    private ingSrv: IngredientService,
    private router: Router,
    @Inject(ActionSheetService) private actionSh: ActionSheetService
  ) { }

  ngOnInit() {
    this.getUser()
  }


  exportIngsList(){
    this.ingSrv.printIngredientsList(this.filter, this.user.locatie).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lista ingrediente.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
        this.getIngredients()
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }

  showIngs(index: number){
    const ingredient = this.ingredients[index]
    ingredient.showIngs = !ingredient.showIngs
  }

  onSelectGestiune(event: any){
    this.filter.gestiune = event.detail.value
    this.getIngredients()
  }

  onSelectType(event: any) {
    this.filter.type = event.detail.value
    this.getIngredients()
    console.log(this.ingredients[1])
  }

  getIngredients(){
    this.ingSrv.getIngredients('', this.filter, this.user.locatie).subscribe(response => {
      if(response){
        this.ingredients = response
      }
    })
  }

  onTopRecive(ev: any){

  }

updateProductIng(){
  this.ingSrv.uodateProductIngredientPrices(this.user.locatie).subscribe()
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
    this.ingSrv.getIngredients(searchQuery, this.filter, this.user.locatie).subscribe(response => {
      if(response){
        this.ingredients = response
      }
    })
  }

  onIngRecive(ev: any){
    this.productIngredients = ev
  }


  calcProductIngredientPrice(ings: any[]){
    let total = 0
    ings.forEach(ing=> {
      const ingCoppy = {...ing}
      total += ingCoppy.qty * (ingCoppy.ing.price + (ingCoppy.ing.price * ingCoppy.ing.tva / 100))
    })
    return round(total)
  }


  roundInHtml(number: number){
    return round(number)
  }

}
