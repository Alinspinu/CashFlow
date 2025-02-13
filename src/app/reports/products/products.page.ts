import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import User from 'src/app/auth/user.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { ReportsService } from '../reports.service';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';
import { convertToDateISOString } from '../../shared/utils/functions';


;
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe, SpinnerPage]
})
export class ProductsPage implements OnInit {

  startDay: string | undefined = formatedDateToShow(new Date()).split('ora')[0]
  endDay: string | undefined = formatedDateToShow(new Date()).split('ora')[0]
  day!: string | undefined


  isProduction: boolean = true
  isGoods: boolean = true
  isInreg: boolean = true
  isUnreg: boolean = true

  colSize: Record<string, any> = {
    buc: 1.4,
    pat: 1.4,
    shop: 1.4,
    bar: 1.4,
    coffee: 1.4,
    tea: 1.4,
    default: 1.4,
    total: 2.2,
  }


  productSearch!: string
  ingSearch!: string

  user!: User
  sel: boolean = false

  bills!: any[]

  allIngredients: any [] = []

  sections!: any

  dbIngs: any [] = []
  dbProducts: any[] = []

  products: any[] = []

  productIngredients: any = []

  selected: number = -1
  productQty: number = 0

  showProducts: boolean = true
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

  menuOpen: boolean = true

  constructor(
   private reportsSrv: ReportsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    @Inject(MenuController) private menuCtrl: MenuController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getuser()
  }

  search(){
    this.getProducts()
  }


  getuser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
        this.getProducts()
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}

private async menuChange(){
  const menu = await this.menuCtrl.get('start');
  if (menu) {
    menu.addEventListener('ionDidClose', () => {
      this.menuOpen = false
    });
    menu.addEventListener('ionDidOpen', () => {
         this.menuOpen = true
    });
  }
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
  const filter = {
    inreg: this.isInreg,
    unreg: this.isUnreg,
    goods: this.isGoods,
    prod: this.isProduction
  }
  this.reportsSrv.getHavyOrders(
      convertToDateISOString(this.startDay),
      convertToDateISOString(this.endDay),
      undefined,
      this.user.locatie,
      filter,
      ''
  ).subscribe(response => {
   this.sections = response.result.sections
   this.dbProducts = response.result.allProd
   this.dbIngs = response.ingredients
   this.allIngredients = this.dbIngs.sort((a,b) => a.ing.name.localeCompare(b.ing.name))
   this.products = this.dbProducts.sort((a,b) => a.name.localeCompare(b.name))
   this.showProducts = true
   this.isLoading = false
 })
}

calcProcents(total: number, value: number){
  return round(value*100/total)
}




calcComecialSurplus(product: any){
  const productValue = round(product.quantity * product.price - product.discount)
  this.recipeSurplus = (productValue - this.totalRecipe) / this.totalRecipe * 100
}


calcRecipeTotal(){
  let totalRecipe = 0
  this.productIngredients.forEach((ing:any) => {
    if(ing.ing){
      const ingValue = round(ing.ing.tvaPrice *ing.qty)
      totalRecipe += ingValue
    }
  })
    return round(totalRecipe)
}


calcProductsTotal(products: any[]){
  let totalProducts = 0
  products.forEach(product => {
    const productValue = round(product.quantity * product.price - product.discount)
    totalProducts += productValue
  })
  return round(totalProducts)
}

calcIngredientsTotal(ingredients: any []){
  let totalIngredients = 0
  ingredients.forEach(ing => {
    if(ing.ing && ing.ing.tvaPrice && ing.qty){
      const ingValue = round(ing.ing.tvaPrice *ing.qty)
      totalIngredients += ingValue
    } else {
    }
  })
  return round(totalIngredients)
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
  // console.log(this.startDay, this.endDay)
  // this.checkDtes(this.startDay, this.endDay) ? 'ss' : this.dateErr()
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
      this.allIngredients.sort((a,b) => (b.ing.tvaPrice * b.qty) - (a.ing.tvaPrice * a.qty))
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


showMain(option: string){
  switch(option){
    case 'buc':
      this.products = this.sections.buc.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.buc.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('buc')
      return
    case 'pat':
      this.products = this.sections.pat.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.pat.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('pat')
      return
    case 'shop':
      this.products = this.sections.shop.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.shop.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('shop')
      return
    case 'total':
      this.products = this.dbProducts.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.dbIngs.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('total')
      return
    case 'bar':
      this.products = this.sections.bar.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.bar.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('bar')
      return
    case 'coffee':
      this.products = this.sections.coffee.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.coffee.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('coffee')
        return
    case 'tea':
      this.products = this.sections.tea.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.tea.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('tea')
      return
    case 'default':
      this.products = this.sections.default.products.sort(( a:any, b: any) => a.name.localeCompare(b.name))
      this.allIngredients = this.sections.default.ings.sort(( a:any, b: any) => a.ing.name.localeCompare(b.ing.name))
      this.changeColSize('default')
      return
    default:
      return
  }
}

changeColSize(option: string){
  Object['entries'](this.colSize).forEach(([key, value]: [string, number]) => {
    console.log(option)
    if(option === key){
      this.colSize[`${key}`] = 2.2
    } else {
      this.colSize[`${key}`] = 1.4
    }
});
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

}
