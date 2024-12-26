import { Component, OnInit, ViewChildren, QueryList, Inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonSearchbar } from '@ionic/angular';
import { ContentService } from '../../content.service';
import { take, tap, Subscription } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';
import { Product } from 'src/app/models/category.model';
import { BillProduct, Topping } from 'src/app/models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import {  round } from 'src/app/shared/utils/functions';
import { TablesService } from 'src/app/tables/tables.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order-content.service';


@Component({
  selector: 'app-meniu',
  templateUrl: './meniu.page.html',
  styleUrls: ['./meniu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class MeniuPage implements OnInit, OnDestroy {

  @ViewChild('searchbar', {static: false}) searchBar!: IonSearchbar

  @ViewChildren('myCard') myCards!: QueryList<any>;
  @ViewChildren('categoryChip') myCats!: QueryList<any>;

  userSub!: Subscription
  tabSub!: Subscription
  orderSub!: Subscription

  catName: string = 'Cafea'
  catId!: string

  mainCategoryToShowName!: string;
  categoryToShowId!: string;

  productsToShow: any [] = []

  productSearch: string = '';
  allProducts: any[] = []


  user!: User

  enableScrollChange: boolean = true
  categories!: any[];
  mainCats!: any
  selectedMainCat!: any
  products!: any


  tableNumber!: number
  billIndex: number = 0

  constructor(
    private contentService: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    private tableSrv: TablesService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if(this.searchBar){
        this.searchBar.setFocus()
      }
    }, 400)
    this.getUser()
    this.getTableNumber()
    this.getCategories()
    this.selectMainCat('Cafea')
    this.getOrderIndex()
  }

  ngOnDestroy(): void {
      if(this.userSub){
        this.userSub.unsubscribe()
      }
      if(this.tabSub){
        this.tabSub.unsubscribe()
      }
      if(this.orderSub){
        this.orderSub.unsubscribe()
      }
  }

  searchProduct(ev: any){
    const input = ev.detail.value.toLowerCase()
    this.productsToShow = this.allProducts.filter((obj: any) => obj.name.toLowerCase().includes(input))
    if(this.productSearch === ''){
      this.selectMainCat(this.catName)
    }

  }

  setProduct(){

  }

  setProducts(cats: any[]){
    cats.forEach(cat => {
      cat.product.forEach((product: any) => {
        this.allProducts.push(product)
      })
    })
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.user = response
      }
    })
    }


    getOrderIndex(){
      this.orderSub = this.orderService.orderIndexSend$.subscribe(response => {
        if(response || response === 0){
          this.billIndex = response
        }
      })
    }

    getTableNumber(){
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if(id){
          this.tableNumber = parseFloat(id);
        }
      })
    }






  selectCategory(cat: string){
    this.categoryToShowId = cat
    this.enableScrollChange = false
    const catIndex = this.categories.findIndex(category => category._id === cat)
    this.productsToShow = this.categories[catIndex].product
  }



  scrollToCard(cardId: string) {
    const cardElement = this.myCards.find(card => card.nativeElement.id === cardId);
    if (cardElement) {
      cardElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      setTimeout(()=> {
        this.enableScrollChange = true
      }, 1000)
    }
  }

  selectMainCat(name: string){
    if(this.mainCats){
      this.catName = name
      this.selectedMainCat = this.mainCats[name]
      this.productsToShow = []
      this.selectedMainCat.show = true
      this.mainCategoryToShowName = name
      this.productsToShow = this.selectedMainCat[0].product
      this.categoryToShowId = this.selectedMainCat[0]._id
    }
  }


  getCategories(){
    this.contentService.categorySend$
    .pipe(
      take(1),
      tap(response => {
        if(response.length > 1){
          this.categories = [...response]
          console.log(this.categories)
          this.setProducts(this.categories)
          let tempMainCats: any = []
          for (const document of this.categories) {
            const category = document.mainCat;
            if (!tempMainCats[category]) {
              tempMainCats[category] = [];
              tempMainCats[category].push(document);
            } else{
              tempMainCats[category].push(document);
            }
          }
          let sortedData: {[category: string]: any[]} = {};
          ['Cafea', 'Ceai & Infuzii', 'Racoritoare', 'Magazin'].forEach(key => {
            if (tempMainCats.hasOwnProperty(key)) {
              sortedData[key] = tempMainCats[key];
            }
          });
          this.mainCats = sortedData
        }
      })
    ).subscribe()
  }



  async addToBill(product: Product){
    let price: number = product.price;
    let cartProdName: string = product.name;
    let ings: any[] = product.ings
    if(product.subProducts.length){
      const result = await this.actionSheet.openModal(PickOptionPage, product.subProducts, true)
      if(result){
        ings = result.ings
        price  = result.price
        cartProdName = product.name + '-' + result.name;
      } else {
       return triggerEscapeKeyPress()
      }
    }
    const categoryIds = ['65bb594b04258e1abf216a1e', '65bb589304258e1abf216a11', '65bb58dd04258e1abf216a18','65bb5b4904258e1abf216a21']
    let combo: Topping[] = []
    if(categoryIds.includes(product.category._id)){
        const toppings: Topping[] = [
          {
            ing: '67163d115eeeefa4ddfdf1fb',
            ingPrice: 4.62,
            price: 15 - price,
            qty: 1,
            um: 'buc',
            name: 'Combo Ciocolata Neagra'
          },
          {
            ing: '67163d115eeeefa4ddfdf1fa',
            ingPrice: 4.62,
            price: 15 - price,
            qty: 1,
            um: 'buc',
            name: 'Combo Cioclata Alba'
          }
        ]
        const result = await this.actionSheet.openModal(PickOptionPage, toppings, false)
        if(result){
          combo = result.toppings
          price += result.toppings[0].price
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
        toppings: combo,
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
        sgrTax: product.sgrTax,
        cantitate: product.qty,
        description: product.description
      };
      console.log(product.sgrTax)
      if(product.sgrTax){
        let topping = product.toppings.find(p => p.name === "Taxa SGR")
        if(topping){
          cartProduct.toppings.push(topping)
          cartProduct.price += topping.price
          cartProduct.total = cartProduct.price * cartProduct.quantity
        }
      }
      // this.disableBrakeButton()
      // this.disableDeleteOrderButton()
      this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex)

    }

    goBack(){
      this.router.navigateByUrl('/tabs/tables')
    }





  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_333,h_333,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
