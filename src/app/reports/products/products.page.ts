import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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



  productSearch!: string
  ingSearch!: string

  user!: User
  sel: boolean = false

  bills!: any[]

  allIngredients: any [] = []

  dbIngs: any [] = []
  dbProducts: any[] = []

  products: any[] = []
  productIngredients: any = []

  selected: number = -1
  productQty: number = 0

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
  nameColor: string = 'primary'

  totalProducts: number = 0;
  totalIngredients: number = 0;
  totalRecipe: number = 0;
  recipeSurplus: number = 0


  constructor(
   private reportsSrv: ReportsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getuser()
  }

  search(){
    this.getProducts()
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


hide(){
  this.showProductIngs = false
  this.showProducts = false
}


searchProduct(ev: any){
  const input = ev.detail.value
  const data = [...this.products]
  let filterData = data.filter((object) =>
  object.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
  this.products = filterData
  if(!input.length){
    this.products= [ ...this.dbProducts]
  }
}


searchIng(ev: any){
  const input = ev.detail.value
  let filterData = this.allIngredients.filter((object) =>
  object.ing.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
  this.allIngredients = filterData
  if(!input.length){
    this.allIngredients= [ ...this.dbIngs]
  }
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
      this.products.sort((a,b) => (b.price * b.quantity) - (a.price * a.quantity))
      this.totColor = 'primary';
      return;
    case 'cashIn':
      this.resetAllColors()
      this.products.sort((a,b) => (b.price * b.quantity - b.discount) - (a.price * a.quantity - a.discount))
      this.cashInColor = 'primary';
      return;
    case 'disc':
      this.resetAllColors()
      this.products.sort((a,b) => b.discount - a.discount)
      this.discColor = 'primary';
      return;
    case 'name':
      this.resetAllColors()
      this.products.sort((a,b) => a.name.localeCompare(b.name))
      this.nameColor = 'primary';
      return;
    case 'cons':
      this.resetAllColors()
      this.products.sort((a,b) => this.calcConsInHtml(b) - this.calcConsInHtml(a))
      this.consColor = 'primary';
      return;
    case 'surplus':
      this.resetAllColors()
      this.products.sort((a,b) => (((b.price*b.quantity - b.discount) - this.calcConsInHtml(b)) / this.calcConsInHtml(b) * 100) - (((a.price*a.quantity - a.discount) - this.calcConsInHtml(a)) / this.calcConsInHtml(a) * 100))
      this.surplusColor = 'primary';
      return;
    default:
      return;
}
}
filterIngs(option: string){
  switch (option) {
    case 'qty':
      this.resetAllColors()
      this.allIngredients.sort((a,b) => b.qty - a.qty)
      this.qtyColor = 'primary';
      return
    case 'price':
      this.resetAllColors()
      this.allIngredients.sort((a,b) => b.ing.price - a.ing.price)
      this.priceColor = 'primary';
      return
    case 'tot':
      this.resetAllColors()
      this.allIngredients.sort((a,b) => (b.ing.price * b.qty) - (a.ing.price * a.qty))
      this.totColor = 'primary';
      return;
    case 'name':
      this.resetAllColors()
      this.allIngredients.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
      this.nameColor = 'primary';
      return;
    case 'um':
      this.resetAllColors()
      this.allIngredients.sort((a,b) => a.ing.um.localeCompare(b.ing.um) )
      this.surplusColor = 'primary';
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
  this.resetAllColors()
  this.nameColor = 'primary'
  this.products = this.products.sort((a,b) => a.name.localeCompare(b.name))
  this.allIngredients.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
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
  this.productIngredients = prod.ingr
}




getProducts(){
  this.isLoading = true
 this.reportsSrv.getOrders(this.startDay, this.endDay, undefined, this.user.locatie).subscribe(response => {
   this.dbProducts = response.products
   this.dbIngs = response.ingredients
   this.allIngredients = this.dbIngs.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
   this.products = this.dbProducts.sort((a,b) => a.name.localeCompare(b.name))
   this.showProducts = true
   this.isLoading = false
  // this.getIngredients(this.products)
  this.calcProductsTotal()
  this.calcIngredientsTotal(this.allIngredients)
 })
}



// getBillProducts(){
//   this.products = []
//   this.bills.forEach(bill => {
//     if(this.isInreg){
//       if(!bill.dont){
//         bill.products.forEach((product:any) => {
//           if(this.isProduction){
//             if(product.dep === 'productie') {
//               this.pushProducts(product)
//             }
//           }
//           if(this.isGoods){
//             if(product.dep === 'marfa'){
//               this.pushProducts(product)
//             }
//           }
//         })
//       }
//     }
//     if(this.isUnreg){
//       if(bill.dont){
//           bill.products.forEach((product:any) => {
//             if(this.isProduction){
//               if(product.dep === 'productie') {
//                 this.pushProducts(product)
//               }
//             }
//             if(this.isGoods){
//               if(product.dep === 'marfa'){
//                 this.pushProducts(product)
//               }
//             }
//           })
//       }

//     }
//   })
//  this.products = this.dbProducts
//  this.products = this.products.sort((a,b) => a.name.localeCompare(b.name))
// }





// getIngredients(products: any[]){
//   this.dbIngs = []
//   products.forEach(product => {
//     const ingredients = [...product.ings]
//     ingredients.forEach((ing: any) => {
//         this.pushIngredients(ing, product.quantity)
//       })
//       if(product.toppings.length){
//         const toppings = [...product.toppings]
//         toppings.forEach((topping: any) => {
//           this.pushIngredients(topping, product.quantity)
//       })
//     }
//   })
//   this.allIngredients = this.dbIngs
//   this.allIngredients.sort((a,b) => a.ing.name.localeCompare(b.ing.name))

// }


calcComecialSurplus(product: any){
  const productValue = round(product.quantity * product.price - product.discount)
  this.recipeSurplus = (productValue - this.totalRecipe) / this.totalRecipe * 100
}


// getProductIngs(product: any){
//   this.productIngredients = []
//   product.ings.forEach((ing:any) => {
//     this.pushRecipeIngs(ing)
//   })
//   if(product.toppings.length){
//     const toppings = [...product.toppings]
//     toppings.forEach((topping: any) => {
//       this.pushRecipeIngs(topping)
//     })
//   }
// }

calcRecipeTotal(productQty: number){
  let totalRecipe = 0
  this.productIngredients.forEach((ing:any) => {
    if(ing.ing){
      const ingValue = round(ing.ing.price *ing.qty)
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
  this.totalIngredients = 0
  ingredients.forEach(ing => {
    if(ing.ing && ing.ing.price && ing.qty){
      const ingValue = round(ing.ing.price *ing.qty)
      this.totalIngredients += ingValue
    } else {
      // console.log('calcIngsTot',ing)
    }
  })
}



//  arraysAreEqual(arr1: any[], arr2: any[]): boolean {
//   if (arr1.length !== arr2.length) {
//       return false;
//   }
//   const sortedArr1 = arr1.slice().sort();
//   const sortedArr2 = arr2.slice().sort();

//   for (let i = 0; i < sortedArr1.length; i++) {
//       const obj1 = sortedArr1[i];
//       const obj2 = sortedArr2[i];

//       if (!this.objectsAreEqual(obj1, obj2)) {
//           return false;
//       }
//   }
//   return true;
// }

// objectsAreEqual(obj1: any, obj2: any): boolean {
//   return JSON.stringify(obj1) === JSON.stringify(obj2);
// }


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
  showToast(this.toastCtrl, 'DATA DE ÎNCEPUT TREBUIE SĂ FIE MAI MICĂ DECÂT CEA DE SFÂRȘIT!', 3000)
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


// pushProducts(product: any){
//   const existingProduct = this.dbProducts.find(p => p.name === product.name && this.arraysAreEqual(p.toppings, product.toppings))
//   if(existingProduct){
//     existingProduct.quantity += product.quantity
//     existingProduct.discount += product.discount
//   } else {
//     const prod = {...product}
//     this.dbProducts.push(prod)
//   }
//   if(product.toppings.length){
//     product.toppings.forEach((top: any) => {
//       if(top.name === 'Lapte Vegetal'){
//         const index = product.ings.findIndex((i: any) => i.ing.name === "Lapte")
//         if(index !== -1){
//           product.ings.splice(index, 1)
//         }
//       }
//     })
//   }
// }




// pushRecipeIngs(ing: any){
//     const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
//       if(existingIng){
//         existingIng.qty += (ing.qty * ing.qty)
//       } else {
//         ing.qty = ing.qty * ing.qty
//         const ig = {...ing}
//             this.productIngredients.push(ig)
//     }
// }




calcConsInHtml(product: any) {
  let totalRecipe = 0
  product.ingr.forEach((ing:any) => {
    if(ing.ing){
      const ingValue = round(ing.ing.price *ing.qty)
      totalRecipe += ingValue
    }
  })
  return round(totalRecipe)
}

}





  // if(ing.ing && ing.ing.productIngredient){
  //   if(ing.ing && ing.ing.ings.length){
  //     ing.ing.ings.forEach((ingg: any) => {
  //       if(ingg.ing){
  //         const existingIng = this.productIngredients.find((p:any) => p.ing._id === ingg.ing._id)
  //         if(existingIng){
  //           existingIng.qty += (ingg.qty * ing.qty)
  //         } else {
  //           ingg.qty = ingg.qty * ing.qty
  //           const ig = {...ingg}
  //           this.productIngredients.push(ig)
  //         }
  //       }
  //       })
  //     }
  // } else {
  //   if(ing.ing){
  //     const existingIng = this.productIngredients.find((p:any) => p.ing._id === ing.ing._id)
  //     if(existingIng){
  //       existingIng.qty += ing.qty
  //     } else {
  //       const ig = {...ing}
  //       this.productIngredients.push(ig)
  //     }
  //   }
  // }






  // product.ings.forEach((ing: any) => {
  //   if(ing.ing && ing.ing.productIngredient){
  //     if(ing.ing && ing.ing.ings.length){
  //       ing.ing.ings.forEach((ingg: any) => {
  //         if(ingg.ing){
  //           const existingIng = prodIngs.find((p:any) => p.ing._id === ingg.ing._id)
  //           if(existingIng){
  //             existingIng.qty += round(ing.qty * ingg.qty)
  //           } else {
  //             ingg.qty = round(ingg.qty*ing.qty)
  //             const ig = {...ingg}
  //             prodIngs.push(ig)
  //           }
  //         }
  //         })
  //       }
  //   } else {
  //     if(ing.ing){
  //       const existingIng = prodIngs.find((p:any) => p.ing._id === ing.ing._id)
  //       if(existingIng){
  //         existingIng.qty += ing.qty
  //       } else {
  //         const ig = {...ing}
  //         prodIngs.push(ig)
  //       }
  //     }
  //   }
  //   })
  // if(product.toppings.length){
  //   const toppings = [...product.toppings]
  //   toppings.forEach((topping: any) => {
  //     if(topping.ing && topping.ing.productIngredient){
  //       if(topping.ing && topping.ing.ings.length){
  //         topping.ing.ings.forEach((ingg: any) => {
  //           if(ingg.ing){
  //             const existingIng = prodIngs.find((p:any) => p.ing._id === ingg.ing._id)
  //             if(existingIng){
  //               existingIng.qty += round(ingg.qty * topping.qty)
  //             } else {
  //               ingg.qty = round(topping.qty * ingg.qty)
  //               const ig = {...ingg}
  //               prodIngs.push(ig)
  //             }
  //           }
  //           })
  //         }
  //     } else {
  //       if(topping.ing){
  //         const existingIng = prodIngs.find((p:any) => p.ing._id === topping.ing._id)
  //         if(existingIng){
  //           existingIng.qty += topping.qty
  //         } else {
  //           const ig = {...topping}
  //           prodIngs.push(ig)
  //         }
  //       }
  //     }
  //   })
  // }
