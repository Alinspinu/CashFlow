import { Component, Inject, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpinnerPage } from '../../../modals/spinner/spinner.page';
import { Subscription } from 'rxjs';
import { Category, Product } from '../../../models/category.model';
import { BillProduct, Ing, Topping, Bill, Table } from '../../../models/table.model';
import { TablesService } from '../../../tables/tables.service';
import { ActionSheetService } from '../../../shared/action-sheet.service';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { triggerEscapeKeyPress } from '../../../shared/utils/toast-controller';
import { round, getSection } from '../../../shared/utils/functions';
import User from '../../../auth/user.model';
import { AuthService } from '../../../auth/auth.service';

interface data{
  mainCats: any, billIndex: number, tableNumber: number, showMainCats: boolean, showCats: boolean, showProd: boolean
}

@Component({
  selector: 'app-meniu',
  templateUrl: './meniu.page.html',
  styleUrls: ['./meniu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage]
})
export class MeniuPage implements OnInit, OnDestroy {


  @Input() data!: data
  @Output() dataChange: EventEmitter<data> = new EventEmitter<data>()


  tabSub!: Subscription;
  userSub!: Subscription;

  allCats: Category[] = [];
  mainCats: {[key: string]: Category[]} = {};
  categoriesToShow!: Category[];
  productsToShow!: Product[];


  billToshow!: Bill
  table!: Table

  tableNumber!: number
  billIndex!: number

  user!: User

  constructor(
    private tableSrv: TablesService,
    private authSrv: AuthService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }



  ngOnInit() {
    this.getUser()
  }

  ngOnDestroy(): void {
    if(this.tabSub){
      this.tabSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }



  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.user = response
      }
    })
    }


    getBill(){
      this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
        if(response){
        const table = response.find(obj => obj.index === this.tableNumber)
        if(table){
          this.table = table;
        }
        this.billToshow = this.table.bills[this.billIndex]
        console.log(this.billIndex)
      }
      })
    }



  async addToBill(product: Product){
    let price: number = product.price;
    let printOut = product.printOut;
    let cartProdName: string = product.name;
    let ings: Ing[] = product.ings
    if(product.subProducts.length){
      const result = await this.actionSheet.openModal(PickOptionPage, product.subProducts, true)
      if(result){
        ings = result.ings
        price  = result.price
        printOut = result.printOut
        cartProdName = product.name + '-' + result.name;
      } else {
       return triggerEscapeKeyPress()
      }
    }
    let options: Topping[] = []
    let optionPrice: number = 0;
    let pickedToppings: Topping[] = [];
    let comment: string = ''
    if(product.category._id === '65d78af381e86f3feded7300' || product._id === "654e909215fb4c734b9689b8"){
      const itemsToSort = [...product.toppings]
      options = itemsToSort.sort((a, b) => a.name.localeCompare(b.name))
      if(options.length){
          const extra = await this.actionSheet.openModal(PickOptionPage, options, false)
          console.log(extra)
            if(extra && extra.toppings) {
               pickedToppings = extra.toppings
               pickedToppings.forEach(el => {
                optionPrice += el.price
               })
               price += optionPrice
            }
            if(extra && extra.comment){
              comment = extra.comment
            }
        }
    }
    const section = getSection(product)
      const cartProduct: BillProduct = {
        name: cartProdName,
        price: price,
        quantity: 1,
        _id: product._id,
        total: price,
        imgPath: product.image.path,
        category: product.category._id,
        sub: false,
        toppings: pickedToppings,
        mainCat: product.mainCat,
        payToGo: false,
        newEntry: true,
        discount: round(price *  product.discount / 100),
        ings: ings,
        dep: product.dep,
        printer: product.printer,
        sentToPrint: true,
        section: section,
        imgUrl: product.image.path,
        comment: comment,
        tva: product.tva,
        toppingsToSend: product.toppings,
        sentToPrintOnline: true,
        qty: product.qty,
        cantitate: product.qty,
        sgrTax: product.sgrTax,
        description: product.description,
        printOut: printOut,
      };
      if(product.sgrTax){
        let topping = product.toppings.find(p => p.name === "Taxa SGR")
        if(topping){
          cartProduct.toppings.push(topping)
          cartProduct.price += topping.price
          cartProduct.total = cartProduct.price * cartProduct.quantity
        }
      }
      this.tableSrv.addToBill(cartProduct, this.data.tableNumber, this.data.billIndex, this.user.name)
    }







  showCategories(mainCat: string){
    this.categoriesToShow = [...this.data.mainCats[mainCat]]
    this.data.showMainCats = false;
    this.data.showCats = true;
    this.data.showProd = false;
    this.dataChange.emit(this.data)
  }

  showProducts(index: number, mainCat: string){
    this.productsToShow = this.data.mainCats[mainCat][index].product
    this.data.showMainCats = false;
    this.data.showCats = false;
    this.data.showProd = true;
    this.dataChange.emit(this.data)
  }


  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }


  getObjectKeys(obj: any): any[] {
    let cats: any = []
    const name = Object.keys(obj);
     name.map(name => {
       switch(name){
         case 'bar':
           const bar = {
             name: 'bar',
             img: this.detectDarkMode() ? '../../../assets/icon/bar-w.svg' : '../../../assets/icon/bar.svg'
           }
           cats.push(bar)
           return
         case 'coffee':
           const coffee = {
             name: 'coffee',
             img: this.detectDarkMode() ? '../../../assets/icon/coffee-w.svg' : '../../../assets/icon/coffee.svg'
           }
           cats.push(coffee)
           return
         case 'food':
           const food = {
             name: 'food',
             img: this.detectDarkMode() ?  '../../../assets/icon/food-w.svg' :'../../../assets/icon/food.svg'
           }
           cats.push(food)
           return
         case 'shop':
           const shop = {
             name: 'shop',
             img: this.detectDarkMode() ? '../../../assets/icon/shop-w.svg' :'../../../assets/icon/shop.svg'
           }
           cats.push(shop)
           return
       }
     })
     return cats
   }

   detectDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

}
