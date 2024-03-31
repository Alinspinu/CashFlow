import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Bill, BillProduct, Ing, Topping } from 'src/app/models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { Category, Product } from 'src/app/models/category.model';
import User from 'src/app/auth/user.model';
import { Subscription } from 'rxjs';
import { ContentService } from '../../content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AuthService } from 'src/app/auth/auth.service';
import { getSection, round } from 'src/app/shared/utils/functions';
import { TablesService } from 'src/app/tables/tables.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-content',
  templateUrl: './category-content.page.html',
  styleUrls: ['./category-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoryContentPage implements OnInit, OnDestroy {
  isSmall: boolean = false
  user!: User;
  backTab: string = 'food';
  cartSubscription!: Subscription;
  tabSubscription!: Subscription;
  tableSubscription!: Subscription;
  userSub!: Subscription;
  admin!:Subscription;
  authSub!: Subscription;
  cart!: Bill;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isDarkMode!: boolean;
  socialUrl!: string;
  currentTab!: string;
  products!: Product[];
  categories!: Category[];
  categoryName!: string
  hideProduct: boolean = false;
  blackList: string[] = [];
  blackListSub!: Subscription;

  preOrder: boolean = false

  billIndex: number = 0
  tableNumber: number = 0

  constructor(
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    private tableSrv: TablesService,
    private route: ActivatedRoute
  ) {}



  ngOnInit() {
    this.getTableNumber()
    this.fetchCategory();
    this.getBill();
    this.getUser();
    this.detectColorScheme();
  };

  getTableNumber(){
    const url = window.location.href;
    const tabs = url.split('/');
    const tab = tabs[4]
    return this.tableNumber = +tab
  }



  getBill(){
    this.tableSubscription = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
        const table = response.find(obj => obj.index === this.tableNumber)
        if(table && table.bills.length){
         const index = table.bills.findIndex(obj => obj.show === true)
          if(index === -1){
            this.billIndex = 0
          } else {
            this.billIndex = index
          }
        }

      }
    })
  };


  fetchCategory(){
  this.getCurrentTab();
   this.tabSubscription = this.contSrv.categorySend$.subscribe(res => {
    this.categories = res;
      const cat = res.find(cat => cat._id === this.currentTab );
      if(cat){
        this.categoryName = cat.name;
        const products = cat.product;
        const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name))
        this.products = [...sortedProducts]
        this.backTab = cat.mainCat;
        const ambIndex = this.products.findIndex(prod => prod.name == "Ambalaj")
        if(ambIndex != -1) {
          this.products.splice(ambIndex,1)
        }
      };
    });
  };

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentTab = tab;
  };


  async addToBill(product: Product){
    let price: number = product.price;
    let cartProdName: string = product.name;
    let ings: Ing[] = product.ings
    if(product.subProducts.length){
      const result = await this.actionSheet.openMobileModal(PickOptionPage, product.subProducts, true)
      if(result){
        ings = result.ings
        price  = result.price
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
          const extra = await this.actionSheet.openMobileModal(PickOptionPage, options, false)
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
        section: section,
        newEntry: true,
        discount: round(price *  product.discount / 100),
        ings: ings,
        dep: product.dep,
        printer: product.printer,
        sentToPrint: true,
        imgUrl: product.image.path,
        comment: comment,
        tva: product.tva,
        toppingsToSend: product.toppings,
        sentToPrintOnline: true,
        qty: product.qty,
        cantitate: product.qty,
        sgrTax: product.sgrTax,
      };
      if(product.sgrTax){
        let topping = product.toppings.find(p => p.name === "Taxa SGR")
        if(topping){
          cartProduct.toppings.push(topping)
          cartProduct.price += topping.price
          cartProduct.total = cartProduct.price * cartProduct.quantity
        }
      }

      this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex, this.user.name)
    }


getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.name === '' ? false : true;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };


  ngOnDestroy(): void {
    if(this.tabSubscription){
      this.tabSubscription.unsubscribe();
    }
    if(this.cartSubscription){
      this.cartSubscription.unsubscribe();
    }
  };

  redProd(index: number){

  }

  addProd(index: number){

  }


  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };



}
