import { Component, OnInit, ViewChildren, QueryList, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContentService } from '../../content.service';
import { take, tap, Subscription } from 'rxjs';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';
import { Product } from 'src/app/models/category.model';
import { BillProduct, Ing, Topping } from 'src/app/models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { getSection, round } from 'src/app/shared/utils/functions';
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

  @ViewChildren('myCard') myCards!: QueryList<any>;
  @ViewChildren('categoryChip') myCats!: QueryList<any>;

  userSub!: Subscription
  tabSub!: Subscription
  orderSub!: Subscription

  mainCategoryToShowName!: string;
  categoryToShowId!: string;

  productsToShow: any [] = []

  user!: User

  enableScrollChange: boolean = true
  categories!: any[];
  mainCats!: any
  selectedMainCat!: any
  products!: any
  sortMain: string[] = ['food', 'coffee', 'bar', 'shop']


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
    this.getUser()
    this.getTableNumber()
    this.getCategories()
    this.selectMainCat('food')
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


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.userSub = response.subscribe(user => {
          if(user){
            this.user = user;
          }
        })
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
    console.log(cat)
    this.enableScrollChange = false
    console.log(this.categories)
    const catIndex = this.categories.findIndex(category => category._id === cat)
    this.productsToShow = this.categories[catIndex].product
    this.categoryToShowId = cat
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
    this.selectedMainCat = this.mainCats[name]
    console.log(this.selectedMainCat)
    this.productsToShow = []
    this.selectedMainCat.show = true
    this.mainCategoryToShowName = name
    this.productsToShow = this.selectedMainCat[0].product
    this.categoryToShowId = this.selectedMainCat[0]._id
  }


  getCategories(){
    this.contentService.categorySend$
    .pipe(
      take(1),
      tap(response => {
        if(response.length > 1){
          this.categories = [...response]
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
          ['food', 'coffee', 'bar', 'shop'].forEach(key => {
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
    let ings: Ing[] = product.ings
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
    let options: Topping[] = []
    let optionPrice: number = 0;
    let pickedToppings: Topping[] = [];
    let comment: string = ''
    if(product.category._id === '65d78af381e86f3feded7300' || product._id === "654e909215fb4c734b9689b8"){
      const itemsToSort = [...product.toppings]
      options = itemsToSort.sort((a, b) => a.name.localeCompare(b.name))
      if(options.length){
          const extra = await this.actionSheet.openModal(PickOptionPage, options, false)
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
      };
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
      this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex, this.user.name)

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
