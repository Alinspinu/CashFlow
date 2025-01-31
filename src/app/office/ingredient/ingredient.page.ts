import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { Dep, Gestiune, InvIngredient } from 'src/app/models/nir.model';
import { Subscription, take } from 'rxjs';
import { AddToInventaryPage } from 'src/app/modals/add-to-inventary/add-to-inventary.page';
import { IngredientContentPage } from './ingredient-content/ingredient-content.page';
import { environment } from 'src/environments/environment';
import { UploadLogPage } from 'src/app/reports/inventary/upload-log/upload-log.page';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.page.html',
  styleUrls: ['./ingredient.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RecipeMakerPage, CapitalizePipe]
})
export class IngredientPage implements OnInit, OnDestroy {

  ingredients: any = [];

  selectDate: boolean = true
  inventaryDate!: string
  ingPage: boolean = true

  deps: Dep[] = []
  gest: Gestiune[] = []

  topToEdit!: any;
  ingsToEdit!: any;
  user!: User

  screenWidth!: number;

  ingSub!: Subscription

  allIngs!: InvIngredient[]
  ind: number = 0

  dep: string = ""
  toppings!: any;
  productIngredients!: any;
  ingTypes: string[] = ["simplu", "compus"]
  isLoading: boolean = true

  filter: {gestiune: string, type: string, dep: string} = {gestiune: '', type: '', dep: ''}


  constructor(
    private toastCtrl: ToastController,
    private ingSrv: IngredientService,
    @Inject(ActionSheetService) private actionSh: ActionSheetService
  ) {
    this.screenWidth = window.innerWidth
  }


  ionViewWillEnter(){

  }

  ngOnInit() {
    this.getUser()
    this.getDeps()
    this.getGest()
  }

  ngOnDestroy(): void {
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }

  async uploadLog(id: string) {
      this.ingSrv.getUploadLog(id).subscribe({
        next: (ing) => {
          this.actionSh.openPayment(UploadLogPage, {logs: ing.uploadLog, ingName: ing.name, ingUm: ing.um, ingID: id} )
        },
        error: (error) => {
          console.log(error)
        }
      })
  }

  async showContent(ing: InvIngredient){
    await this.actionSh.openPayment(IngredientContentPage, ing)
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
      }
    })
  }

  async calcConsum(){
    const startDate = await this.actionSh.openAuth(DatePickerPage)
    if(startDate){
      const endDate = await this.actionSh.openAuth(DatePickerPage)
      if(endDate){
        this.ingSrv.printConsum(this.dep, this.user.locatie, startDate, endDate, true).subscribe(response => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Consum materii prime.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
      }
    }
  }

  createInv(){
     this.ingSrv.saveInventary().subscribe({
      next: (response) => {
        showToast(this.toastCtrl, response.message, 3000)
      },
      error: (error) => {
        showToast(this.toastCtrl, error.message, 5000)
        console.log(error)
      }
     })
  }

  showIngs(index: number){
    const ingredient = this.ingredients[index]
    ingredient.showIngs = !ingredient.showIngs
  }



  onSelectGestiune(event: any){
    this.filter.gestiune = event.detail.value
    this.ingredients = [...this.allIngs]
    this.filterIngredients()
  }


  onSelectType(event: any) {
    this.filter.type = event.detail.value
    this.ingredients = [...this.allIngs]
    this.filterIngredients()
  }


  onSelectDep(event: any){
    this.filter.dep = event.detail.value
    this.dep = event.detail.value
    this.ingredients = [...this.allIngs]
    this.filterIngredients()
  }


  filterIngredients(){
    if(this.filter.dep !== ''){
      const ings = this.ingredients.filter((ing: any) => {
        if(ing.dept){
         return ing.dept._id === this.filter.dep
        } else{
          console.log('NO DEP INGREDIENT******', ing.name)
          return ing
        }
      })
      this.ingredients = [...ings]
    }
    if(this.filter.gestiune !== ''){
      const ings = this.ingredients.filter((ing: any) => ing.gest._id === this.filter.gestiune)
      this.ingredients = [...ings]
    }
    if(this.filter.type === 'compus'){
      const ings = this.ingredients.filter((ing: any) => ing.ings.length >= 1)
      this.ingredients = [...ings]
    }
    if(this.filter.type === "simplu"){
      const ings = this.ingredients.filter((ing: any) => !ing.ings.length)
      this.ingredients = [...ings]
    }
  }

  getIngredients(){
   this.ingSub = this.ingSrv.ingredientsSend$.subscribe(response => {
    if(response){
      this.allIngs = response
      this.ingredients = [...this.allIngs]
      this.filterIngredients()
      if(this.allIngs.length > 1){
        this.isLoading = false
      }
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
    const message = await this.actionSh.openAdd(ProductIngredientPage, ing, 'add-modal')
    if(message === 'done'){
      // this.getIngredients()
    }
  } else {
    const ingToEdit = await this.actionSh.openAdd(AddIngredientPage, ing, 'add-modal')
    if(ingToEdit){
      this.ingSrv.editIngredient(ing._id, ingToEdit).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }
  }

  async inventary(index: number){
    this.ind = index
    if(this.selectDate){
      this.inventaryDate = await this.actionSh.openAuth(DatePickerPage)
      if(this.inventaryDate){
        this.selectDate = false
      }
    }
    if(!this.selectDate){
      let data = {date: this.inventaryDate, ing: this.ingredients[this.ind]}
      console.log(data)
      const ingToUpdate = this.screenWidth > 500 ?
                          await this.actionSh.openModal(AddToInventaryPage, data, false) :
                          await this.actionSh.openMobileModal(AddToInventaryPage, data, false)
      if(ingToUpdate){
        this.ingSrv.updateIngredientInventary(ingToUpdate).subscribe(async response => {
          this.ind += 1
          // await this.inventary(this.ind)
          showToast(this.toastCtrl, response.message, 3000)
        })
      }
    }
  }

  async deleteIng(id: string, name: string){
    const result = await this.actionSh.deleteAlert(`Ești sigur ca vrei să ștergi ingredinetul ${name}! Cand stergi un ingredient il stergi din toate rețetele în care a fost folosit!`, "Sterge")
    if(result){
      this.ingSrv.deleteIngredient(id).pipe(take(1)).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
        }
      })
    }
  }

  searchRecive(searchQuery: string){
      this.ingredients = this.allIngs.filter((ing: InvIngredient) => {
        if(ing.name){
          return ing.name.toLowerCase().includes(searchQuery)
        } else {
          return console.log(ing)
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


  roundInHtml(number: number){
    return round(number)
  }




  printIngsInv(){
    this.ingSrv.printIngredientsList(this.filter, environment.LOC).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lista inventar.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
