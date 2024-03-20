import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { ProductsService } from 'src/app/office/products/products.service';
import { ContentService } from 'src/app/content/content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import { Ingredient, Product } from 'src/app/models/category.model';
import User from 'src/app/auth/user.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { Bill, BillProduct, Ing } from 'src/app/models/table.model';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class ProductsPage implements OnInit {

  startDay!: string | undefined
  endDay!: string | undefined
  day!: string | undefined


  products: any[] = []

  productSearch!: string
  user!: User

  sel: boolean = false

  bills!: Bill[]

  allIngredients: any [] = []

  productIngredients: any = []
  productQty: number = 0
  selected: number = -1


  showProducts: boolean = false
  showProductIngs: boolean = false
  isLoading: boolean = false

  totalProducts: number = 0;
  totalIngredients: number = 0;


  constructor(
   private reportsSrv: ReportsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getuser()
  }


getuser(){
  getUserFromLocalStorage().then(user => {
    if(user) {
      this.user = user
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}

showConsumption(){
  this.selected = -1
  this.showProductIngs = false
}


showProduction(product: any, index: number){
  console.log(product)
  this.productIngredients = []
  this.showProductIngs = true
  this.productQty = product.quantity
  this.selected = index
  this.sel = true
  product.ings.forEach((ing:any) => {
    if(ing.ings && ing.ing.ings.length){
      ing.ing.ings.forEach((ing: any) => {
          const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
          if(existingIng){
            existingIng.qty += ing.qty
          } else {
            this.productIngredients.push(ing)
          }
        })
      }
      const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
      if(existingIng){
        existingIng.qty += ing.qty
      } else {
        this.productIngredients.push(ing)
      }
  })
  if(product.toppings.length){
    product.toppings.forEach((topping: any) => {
      if(topping.ing){
        if(topping.ing.ings.length){
          topping.ing.ings.forEach((ing:any) => {
            const existingIng = this.productIngredients.find((p: any) => p.ing._id === ing.ing._id)
            if(existingIng){
              existingIng.qty += ing.qty
            } else {
              this.productIngredients.push(ing)
            }
          })
        }
        const existingIng = this.productIngredients.find((p: any) => p.ing._id === topping.ing._id)
        if(existingIng){
          existingIng.qty += topping.qty
        } else {
          this.productIngredients.push({qty: topping.qty, ing: topping.ing})
        }
      }
    })
  }
  console.log(this.productIngredients)
  // this.calcIngredientsTotal(this.productIngredients)

}

roundInHtml(num: number){
  return round(num)
}

async pickStartDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.startDay = formatedDateToShow(result).split('ora')[0]
  }
}

async pickEndDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.endDay = formatedDateToShow(result).split('ora')[0]
  }
  this.checkDtes(this.startDay, this.endDay) ? 'ss' : this.dateErr()
}

checkDtes(start: string | undefined, end: string | undefined){
  if(start && end) {
    const startDate = new Date(start).getTime()
    const endDate = new Date(end).getTime()
    return startDate <= endDate ? true : false
  }
  return
}

dateErr(){
  showToast(this.toastCtrl, 'DATA DE ÎNCEPUT TREBUIE SĂ FIE MAI MICĂ DECÂT CEA DE SFÂRȘIT!', 3000, 'error-toast')
  this.startDay  = ''
  this.endDay = ''
}

search(){
this.getBills()
}



getBills(){
  this.isLoading = true
 this.reportsSrv.getOrders(this.startDay, this.endDay, undefined, this.user.locatie).subscribe((response: any) => {
  if(response){
    this.bills = response.orders
    this.getBillProducts()
    this.showProducts = true
    this.isLoading = false
  }
 })
}


getBillProducts(){
  this.bills.forEach(bill => {
    bill.products.forEach(product => {
      if(product.name === "Americano-Brazilia Agua Lipa"){
        console.log(bill)
      }
      const existingProduct = this.products.find(p => p.name === product.name && this.arraysAreEqual(p.toppings, product.toppings))
      if(existingProduct){
        existingProduct.quantity += product.quantity
        existingProduct.discount += product.discount
      } else {
        this.products.push(product)
      }
    })
  })
  this.products = this.products.sort((a,b) => a.name.localeCompare(b.name))
 this.getIngredients()
 this.calcProductsTotal()
}

calcProductsTotal(){
  this.totalProducts = 0
  this.products.forEach(product => {
    const productValue = round(product.quantity * product.price - product.discount)
    this.totalProducts += productValue
  })
}



getIngredients(){
  this.products.forEach(product => {
    product.ings.forEach((ing: any) => {
      if(ing.ing && ing.ing.ings.length){
          ing.ing.ings.forEach((ing:any) => {
            if(ing.ing){
              const existingIng = this.allIngredients.find(p => p.ing._id === ing.ing._id)
              if(existingIng){
                existingIng.qty += ing.qty
              } else {
                this.allIngredients.push(ing)
              }
            }
          })
      }
      if(ing.ing){
        const existingIng = this.allIngredients.find(p => p.ing._id === ing.ing._id)
        if(existingIng){
          existingIng.qty += ing.qty
        } else {
          this.allIngredients.push(ing)
        }
      }
    })
    if(product.toppings.length){
      product.toppings.forEach((topping: any) => {
        if(topping.ing){
          if(topping.ing.ings.length){
            topping.ing.ings.forEach((ing:any) => {
              const existingIng = this.allIngredients.find(p => p.ing._id === ing.ing._id)
              if(existingIng){
                existingIng.qty += ing.qty
              } else {
                this.allIngredients.push(ing)
              }
            })
          }
          const existingIng = this.allIngredients.find(p => p.ing._id === topping.ing._id)
          if(existingIng){
            existingIng.qty += topping.qty
          } else {
            this.allIngredients.push({qty: topping.qty, ing: topping.ing})
          }
        }
      })
    }
  })
  this.allIngredients.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
  // this.calcIngredientsTotal(this.allIngredients)
}

calcIngredientsTotal(ingredients: any []){
  this.totalIngredients = 0
  ingredients.forEach(ing => {
    const ingValue = round(ing.ing.price *ing.qty)
    this.totalIngredients += ingValue
  })
}






 arraysAreEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
      return false;
  }
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
      const obj1 = sortedArr1[i];
      const obj2 = sortedArr2[i];

      if (!this.objectsAreEqual(obj1, obj2)) {
          return false;
      }
  }
  return true;
}

objectsAreEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}





}
