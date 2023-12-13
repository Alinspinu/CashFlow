import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonLabel } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../content.service';
import { Category, Product } from '../category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { Bill, BillProduct, Ing, Table, Topping } from 'src/app/tables/table.model';
import { TablesService } from 'src/app/tables/tables.service';
import { Subscription } from 'rxjs';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { IonInput } from '@ionic/angular/standalone';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { DiscountPage } from 'src/app/modals/discount/discount.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.page.html',
  styleUrls: ['./table-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, CapitalizePipe]
})
export class TableContentPage implements OnInit, OnDestroy {

  @ViewChild('addNameInput') nameInput!: IonInput;

  discountOffset: string = '6'

  discountValue: number = 0;
  discountMode: boolean = true

  tabSub!: Subscription;
  allCats: Category[] = [];
  mainCats: {[key: string]: Category[]} = {};
  categoriesToShow!: Category[];
  productsToShow!: Product[];
  showMainCats: boolean = true;
  showCats: boolean = false;
  showProd: boolean = false;

  orderName: string = ""

  table: Table = this.tableSrv.emptyTable();
  tableNumber: number = 0;

  billCashBack!: number | null
  cashBackMode: boolean = true

  billProducts: BillProduct[] = [];
  billTotal: number = 0;
  billId!: string;
  billIndex: number = 0;

  client!: any
  clientMode: boolean = true

  billToshow!: Bill

  billProd: BillProduct = {
   _id: '',
   name: '',
   price: 0,
   quantity: 0,
   total: 0,
   imgPath: '',
   category: '',
   mainCat: '',
   sub: false,
   toppings: [],
   payToGo: false,
   newEntry: true,
   ings: []
  }



  constructor(
    private route: ActivatedRoute,
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private tableSrv: TablesService,
    ) { }

  ngOnInit() {
    this.getTableNumber()
    this.getData()
    this.getBill()
    // console.log(this.billToshow)
  }

  ngOnDestroy(): void {
    if(this.tabSub){
      this.tabSub.unsubscribe()
    }
  }


  editOrderName(orderIndex: number){
    this.table.bills[orderIndex].setName = true
    this.orderName = ''
    setTimeout(() => {
      if(this.nameInput){
        this.nameInput.setFocus()
      }
    }, 200)
  }

  setName(orderIndex: number){
    const bill = this.table.bills[orderIndex]
      bill.setName = false;
      bill.name = this.orderName
  }

  showOrder(orderIndex: number){
    this.hideAllBils(this.table)
    this.billToshow = this.table.bills[orderIndex]
    this.billProducts = [...this.billToshow.products]
    this.billIndex = orderIndex
    this.billToshow.masaRest.index = this.tableNumber
    this.billToshow.show = true
  }

  newOrder(){
    this.tableSrv.addNewBill(this.tableNumber)
    this.showOrder(+this.table.bills.length-1)
  }


  sendOrder(){
    this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new'
    const tableIndex = this.billToshow.masaRest.index
    this.tableSrv.saveTablesLocal(tableIndex, this.billId, this.billIndex).subscribe()
  }

 async addCustomer(clientMode: boolean){
  if(clientMode){
    const clientInfo = await this.actionSheet.openPayment(CustomerCheckPage, '')
    this.client = clientInfo
    this.clientMode = false
    this.discountOffset = '0'
    this.billToshow.userName = this.client.name
    this.billToshow.userTel = this.client.telephone
    this.billToshow.user = this.client._id
  } else {
    if(this.billCashBack){
      this.billToshow.total = this.billToshow.total + this.billCashBack
      this.billCashBack = null
      this.cashBackMode = true
    }
    this.client = null
    this.clientMode = true;
    this.discountOffset = '6'
  }

  }

  async payment(){
    const paymentInfo = await this.actionSheet.openPayment(PaymentPage, this.billToshow.total)
      if(paymentInfo){
        this.billToshow.payment.card = paymentInfo.card;
        this.billToshow.payment.cash = paymentInfo.cash;
        this.billToshow.payment.voucher = paymentInfo.voucher;
        this.billToshow.payment.viva = paymentInfo.viva;
        this.billToshow.cif = paymentInfo.cif;
        console.log(this.billToshow)
      }
  }


  async useCashBack(mode: boolean){
    if(mode){
      const data = { cashBack: this.client.cashBack, total: this.billToshow.total}
      const cashBackValue = await this.actionSheet.openPayment(CashbackPage, data)
      if(cashBackValue){
        this.billToshow.cashBack = cashBackValue;
        this.billCashBack = cashBackValue;
        this.billToshow.total  = this.billToshow.total - cashBackValue
        this.cashBackMode = false
      }
    }else {
      this.billToshow.total = this.billToshow.cashBack + this.billToshow.total
      this.cashBackMode = true
      this.billCashBack = null
    }
  }

  async addDiscount(mode: boolean){
    if(mode){
      const discountValue = await this.actionSheet.openPayment(DiscountPage, this.billToshow.total)
      if(discountValue){
        this.billToshow.total = this.billToshow.total - discountValue;
        this.discountValue = discountValue;
        this.discountMode = false;
      }
    } else {
      this.billToshow.total = this.billToshow.total + this.discountValue
      this.discountValue = 0
      this.discountMode = true
    }
  }


  addProd(billProIndex: number){
    this.tableSrv.addOne(this.tableNumber, billProIndex)
  }

  redProd(billProIndex: number){
    this.tableSrv.redOne(this.tableNumber, billProIndex)
  }

  getBill(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
      const table = response.find(obj => obj.index === this.tableNumber)
      if(table){
        this.table = table;
      }
      this.billToshow = this.table.bills[this.billIndex]
     if(this.billToshow){
      this.hideAllBils(this.table)
      this.billToshow.show = true
       this.billProducts = [...this.billToshow.products]
     }
    }
    })
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
    if(product.toppings.length){
      const itemsToSort = [...product.toppings]
      options = itemsToSort.sort((a, b) => a.price - b.price)
    }
    if(options.length){
      const extra = await this.actionSheet.openModal(PickOptionPage, options, false)
        if(extra) {
           pickedToppings = extra
           pickedToppings.forEach(el => {
            optionPrice += el.price
           })
        }
      }
      const totalPrice = price + optionPrice
      const cartProduct = {
        name: cartProdName,
        price: totalPrice,
        quantity: 1,
        _id: product._id,
        total: totalPrice,
        imgPath: product.image.path,
        category: product.category._id,
        sub: false,
        toppings: pickedToppings,
        mainCat: '',
        payToGo: false,
        newEntry: true,
        ings: ings
      };
      this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex )
  }



  getData(){
    this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.allCats = [...response]
        let tempMainCats: any = []
        for (const document of this.allCats) {
          const category = document.mainCat;
          if (!tempMainCats[category]) {
            tempMainCats[category] = [];
            tempMainCats[category].push(document);
          } else{
            tempMainCats[category].push(document);
          }
        }
        this.mainCats = tempMainCats
      }
    })
  }

  showCategories(mainCat: string){
    this.categoriesToShow = [...this.mainCats[mainCat]]
    this.showMainCats = false;
    this.showCats = true;
    this.showProd = false;
  }

  showProducts(index: number, mainCat: string){
    this.productsToShow = this.mainCats[mainCat][index].product
    this.showMainCats = false;
    this.showCats = false;
    this.showProd = true;
  }

  goBack(){
    if(this.showCats){
      this.showCats = false;
      this.showMainCats = true;
      this.showProd = false;
    } else if(this.showProd){
      this.showProd = false;
      this.showCats = true;
      this.showMainCats = false;
    }
  }

  home(){
    this.showCats = false;
    this.showMainCats = true;
    this.showProd = false
  }

  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }


  getTableNumber(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.tableNumber = parseFloat(id);
      }
    })
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  arraysAreEqual = (arr1: {}[], arr2: {}[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);


  hideAllBils(table: Table){
    table.bills.forEach(bill => {
      bill.show = false
    })
  }

}


