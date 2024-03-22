import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import User from 'src/app/auth/user.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, SpinnerPage]
})
export class ProductsPage implements OnInit {

  startDay!: string | undefined
  endDay!: string | undefined
  day!: string | undefined


  isProduction: boolean = true
  isGoods: boolean = true
  isInreg: boolean = true
  isUnreg: boolean = true


  products: any[] = []

  productSearch!: string
  user!: User

  sel: boolean = false
  bills!: any[]
  allIngredients: any [] = []

  productIngredients: any = []
  productQty: number = 0
  selected: number = -1


  showProducts: boolean = false
  showProductIngs: boolean = false
  isLoading: boolean = false

  qtyColor: string = 'none'
  priceColor: string = 'none'
  totColor: string = 'none'
  discColor: string = 'none'
  cashInColor: string = 'none'
  consColor: string = 'none'
  surplusColor: string = 'none'
  nameColor: string = 'none'

  totalProducts: number = 0;
  totalIngredients: number = 0;
  totalRecipe: number = 0;
  recipeSurplus: number = 0


  constructor(
   private reportsSrv: ReportsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getuser()
  }

  search(){
    this.getBills()
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


filter(option: string){
  switch (option) {
    case 'qty':
      this.resetAllColors()
      this.products.sort((a,b) => b.quantity - a.quantity)
      this.qtyColor = 'primary';
      return
    case 'price':
      this.resetAllColors()
      this.products.sort((a,b) => b.price - a.price)
      this.priceColor = 'primary';
      return
    case 'total':
      this.resetAllColors()
      this.products.sort((a,b) => (b.price * b.quantity) - (a.price*b.quantity))
      this.totColor = 'primary';
      return;
    case 'disc':
      this.resetAllColors()
      this.products.sort((a,b) => (b.price * b.quantity) - (a.price*b.quantity))
      this.totColor = 'primary';
      return;
    case 'cashIn':
      this.resetAllColors()
      this.products.sort((a,b) => b.discount - a.discount)
      this.totColor = 'primary';
      return;
    case 'name':
      this.resetAllColors()
      this.products.sort((a,b) => (b.price * b.quantity) - (a.price*b.quantity))
      this.totColor = 'primary';
      return;
    case 'cons':
      this.resetAllColors()
      this.products.sort((a,b) => this.calcConsInHtml(b) - this.calcConsInHtml(a))
      this.totColor = 'primary';
      return;
    case 'surplus':
      this.resetAllColors()
      this.products.sort((a,b) => (((b.price*b.quantity - b.discount) - this.calcConsInHtml(b)) / this.calcConsInHtml(b) * 100) - (((a.price*a.quantity - a.discount) - this.calcConsInHtml(a)) / this.calcConsInHtml(a) * 100))
      this.totColor = 'primary';
      return;
    default:
      return;
}
}

resetAllColors(){
  this.qtyColor = 'none'
  this.priceColor = 'none'
  this.totColor = 'none'
  this.discColor = 'none'
  this.cashInColor = 'none'
  this.consColor = 'none'
  this.surplusColor = 'none'
  this.nameColor = 'none'
}

showConsumption(){
  this.selected = -1
  this.showProductIngs = !this.showProductIngs
}



showRecipe(index: number, prod: any){
  this.products.forEach(product => {
    product.showSub = false
  })
   const product = this.products[index]
   product.showSub = true
  if(this.selected === index){
    this.selected = -1
    product.showSub = false
  } else{
    this.selected = index
  }
  this.getProductIngs(prod)
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
  this.products = []
  this.bills.forEach(bill => {
    if(this.isInreg){
      if(!bill.dont){
        bill.products.forEach((product:any) => {
          if(this.isProduction){
            if(product.dep === 'productie') {
              this.pushProducts(product)
            }
          }
          if(this.isGoods){
            if(product.dep === 'marfa'){
              this.pushProducts(product)
            }
          }
        })
      }
    }
    if(this.isUnreg){
      if(bill.dont){
          bill.products.forEach((product:any) => {
            if(this.isProduction){
              if(product.dep === 'productie') {
                this.pushProducts(product)
              }
            }
            if(this.isGoods){
              if(product.dep === 'marfa'){
                this.pushProducts(product)
              }
            }
          })
      }

    }
  })

 this.products = this.products.sort((a,b) => a.name.localeCompare(b.name))
 this.getIngredients(this.products)
 this.calcProductsTotal()
}




getIngredients(products: any[]){
  this.allIngredients = []
  products.forEach(product => {
    const ingredients = [...product.ings]
    ingredients.forEach((ing: any) => {
        this.pushIngredients(ing, product.quantity)
      })
      if(product.toppings.length){
        const toppings = [...product.toppings]
        toppings.forEach((topping: any) => {
          this.pushIngredients(topping, product.quantity)
      })
    }
  })
  this.allIngredients.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
  this.calcIngredientsTotal(this.allIngredients)
}


calcComecialSurplus(product: any){
  const productValue = round(product.quantity * product.price - product.discount)
  this.recipeSurplus = (productValue - this.totalRecipe) / this.totalRecipe * 100
}


getProductIngs(product: any){
  this.productIngredients = []
  product.ings.forEach((ing:any) => {
    this.pushRecipeIngs(ing)
  })
  if(product.toppings.length){
    const toppings = [...product.toppings]
    toppings.forEach((topping: any) => {
      this.pushRecipeIngs(topping)
    })
  }
}

calcRecipeTotal(productQty: number){
  let totalRecipe = 0
  this.productIngredients.forEach((ing:any) => {
    if(ing.ing){
      const ingValue = round(ing.ing.price * productQty *ing.qty)
      totalRecipe += ingValue
    }
  })
    return round(totalRecipe)
}





calcProductsTotal(){
  this.totalProducts = 0
  this.products.forEach(product => {
    const productValue = round(product.quantity * product.price - product.discount)
    this.totalProducts += productValue
  })
}

calcIngredientsTotal(ingredients: any []){
  console.log(ingredients.length)
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



printProducts(){
  const products = JSON.stringify(this.products)
  this.reportsSrv.printProducts(products, this.startDay, this.endDay).subscribe(response => {
    const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Produse Vandute ${this.startDay}--${this.endDay}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  })
}


printConsuption(){
  const ings = JSON.stringify(this.allIngredients)
  this.reportsSrv.printConsumtion(ings, this.startDay, this.endDay).subscribe(response => {
    const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Consum materii prime ${this.startDay}--${this.endDay}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  })
}


printProduction(){
  const products = JSON.stringify(this.products)
  this.reportsSrv.printProduction(products, this.startDay, this.endDay).subscribe(response => {
    const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Raport productie detaliat ${this.startDay}--${this.endDay}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  })
}


pushProducts(product: any){
  const existingProduct = this.products.find(p => p.name === product.name && this.arraysAreEqual(p.toppings, product.toppings))
  if(existingProduct){
    existingProduct.quantity += product.quantity
    existingProduct.discount += product.discount
  } else {
    const prod = {...product}
    this.products.push(prod)
  }
  if(product.toppings.length){
    product.toppings.forEach((top: any) => {
      if(top.name === 'Lapte Vegetal'){
        const index = product.ings.findIndex((i: any) => i.ing.name === "Lapte")
        if(index !== -1){
          product.ings.splice(index, 1)
        }
      }
    })
  }
}

pushIngredients(ing: any, prodQty: number){
  if(ing.ing && ing.ing.ings.length){
    ing.ing.ings.forEach((ing:any) => {
      if(ing.ing){
        const existingIng = this.allIngredients.find(p => p.ing._id === ing.ing._id)
        if(existingIng){
          existingIng.qty += (ing.qty * prodQty)
        } else {
          const ig = {...ing}
          ig.qty = round(ig.qty * prodQty)
          this.allIngredients.push(ig)
        }
      }
    })
}
if(ing.ing){
  const existingIng = this.allIngredients.find(p => p.ing._id === ing.ing._id)
  if(existingIng){
    existingIng.qty += (ing.qty * prodQty)
  } else {
    const ig = {...ing}
    ig.qty = round(ig.qty * prodQty)
    this.allIngredients.push(ig)
  }
  }
}



pushRecipeIngs(ing: any){
  if(ing.ings && ing.ing.ings.length){
    ing.ing.ings.forEach((ing: any) => {
      if(ing.ing){
        const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
        if(existingIng){
          existingIng.qty += ing.qty
        } else {
          const ig = {...ing}
          this.productIngredients.push(ig)
        }
      }
      })
    }
    if(ing.ing){
      const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
      if(existingIng){
        existingIng.qty += ing.qty
      } else {
        const ig = {...ing}
        this.productIngredients.push(ig)
      }
    }
}

calcConsInHtml(product: any) {
  let prodIngs: any = []
  product.ings.forEach((ing: any) => {
    if(ing.ings && ing.ing.ings.length){
      ing.ing.ings.forEach((ing: any) => {
        if(ing.ing){
          const existingIng = prodIngs.find((p:any) => p.ing._id === ing.ing._id)
          if(existingIng){
            existingIng.qty += ing.qty
          } else {
            const ig = {...ing}
            prodIngs.push(ig)
          }
        }
        })
      }
      if(ing.ing){
        const existingIng = prodIngs.find((p:any) => p.ing._id === ing.ing._id)
        if(existingIng){
          existingIng.qty += ing.qty
        } else {
          const ig = {...ing}
          prodIngs.push(ig)
        }
      }
  })
  let totalRecipe = 0
  prodIngs.forEach((ing:any) => {
    if(ing.ing){
      const ingValue = round(ing.ing.price * product.quantity *ing.qty)
      totalRecipe += ingValue
    }
  })
  return round(totalRecipe)
}

}
