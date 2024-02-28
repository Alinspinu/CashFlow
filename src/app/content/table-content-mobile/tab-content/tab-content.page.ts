import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContentService } from '../../content.service';
import { Category, Product } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import User from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { round } from 'src/app/shared/utils/functions';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { BillProduct, Ing } from 'src/app/models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { TablesService } from 'src/app/tables/tables.service';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.page.html',
  styleUrls: ['./tab-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class TabContentPage implements OnInit {

  isLoadding: boolean = true;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  socialUrl!: string;
  categories!: Category[];
  isDarkMode!: boolean;
  currentCategory!: string;
  tabSubscription!: Subscription;
  tableSubscription!: Subscription;
  userSub!: Subscription;
  user!: User;
  tableNumber!: number

  productSearch!: string
  billIndex: number = 0

  allCats: Category[] = []
  products: Product[] = []

  productsToShow: Product [] = []

  showProducts: boolean = false


  constructor(
    private contSrv: ContentService,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private tableSrv: TablesService
  ) { }

  ngOnInit() {
    this.getTableNumber()
    this.getBill()
    this.getCurrentTab()
    this.getUser()
    this.fetchCategory()
  }

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


  searchProduct(ev: any){
    const input = ev.detail.value
    if(input !== ''){
      this.showProducts = true
    } else{
      this.showProducts = false
    }
    this.productsToShow = []
    const products = [...this.products]
    this.productsToShow = products.filter((object) =>
    object.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
    );
    console.log(this.productsToShow)
  }

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
      const cartProduct: BillProduct = {
        name: cartProdName,
        price: price,
        quantity: 1,
        _id: product._id,
        total: price,
        imgPath: product.image.path,
        category: product.category._id,
        sub: false,
        toppings: [],
        mainCat: product.mainCat,
        payToGo: false,
        newEntry: true,
        discount: round(price *  product.discount / 100),
        ings: ings,
        dep: product.dep,
        printer: product.printer,
        sentToPrint: true,
        imgUrl: product.image.path,
        comment: '',
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

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentCategory = tab;
  };

  fetchCategory(){
    this.isLoadding = true;
    this.tabSubscription = this.contSrv.categorySend$.subscribe(res => {
      this.categories = [];
      this.allCats = res
      if(res) {
        for(let category of res){
          if(category.mainCat === this.currentCategory){
            this.categories.push(category);
          }
        };
        this.isLoadding = false;
        this.allProducts()
      }
    });
  };

allProducts(){
  this.allCats.forEach(cat => {
      cat.product.forEach(product => {
        this.products.push(product)
      })
  })
}




  getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };

  ngOnDestroy(): void {
    this.tabSubscription.unsubscribe();
  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    console.log("is dark mode",this.isDarkMode);
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };


}
