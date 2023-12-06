import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonLabel } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../content.service';
import { Category, Product } from '../category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { Bill, BillProduct, Table } from 'src/app/tables/table.model';
import { TablesService } from 'src/app/tables/tables.service';
import { Subscription } from 'rxjs';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { IonInput } from '@ionic/angular/standalone';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { DiscountPage } from 'src/app/modals/discount/discount.page';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.page.html',
  styleUrls: ['./table-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class TableContentPage implements OnInit, OnDestroy {

  @ViewChild('addNameInput') nameInput!: IonInput;

  discountOffset: string = '0'

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

  billProducts: BillProduct[] = [];
  billTotal: number = 0;
  billId!: string;
  billIndex: number = 0;


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
   newEntry: true
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
    // console.log(this.mainCats)
    // console.log()
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
    console.log(this.billToshow)
    this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new'
    const tableIndex = this.billToshow.masaRest.index
    this.tableSrv.saveTablesLocal(tableIndex, this.billId, this.billIndex).subscribe()
  }

 async addCustomer(){
    const clientInfo = await this.actionSheet.openPayment(CustomerCheckPage, '')
  }

  async payment(){
    const paymentInfo = await this.actionSheet.openPayment(PaymentPage, {total: 23.66})
    console.log(paymentInfo)
  }


  async useCashBack(){
    const cashBackValue = await this.actionSheet.openPayment(CashbackPage, 12)
  }

  async addDiscount(){
    const discountValue = await this.actionSheet.openPayment(DiscountPage, '')
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
    let subProducts: string[] = []
    if(product.subProducts.length){
      product.subProducts.forEach(el => {
        if(el.available){
          subProducts.push(`${el.name} - ${el.price} Lei`)
        }
      })
    }
    if(subProducts.length){
      const result = await this.actionSheet.openModal(PickOptionPage, subProducts, true)
      if(result){
        const subProd = result.split('-')
        const subProdName = subProd[0];
        price  = parseFloat(subProd[1].slice(0, -2))
        cartProdName = product.name + '-' + subProdName;
      } else {
       return triggerEscapeKeyPress()
      }
    }
    let options: string[] = []
    let optionPrice: number = 0;
    let extraNames: string[] = [];
    if(product.toppings.length){
      const itemsToSort = [...product.toppings]
      const sortedTopings = itemsToSort.sort((a, b) => a.price - b.price)
      sortedTopings.forEach(el => {
        let price: string = 'Lei'
        el.price === 1 ? price = 'Leu' : price = 'Lei'
        options.push(`${el.name} +${el.price} ${price}`)
      })
    }
    if(options.length){
      const extra = await this.actionSheet.openModal(PickOptionPage, options, false)
        if(extra) {
          extra.forEach((el: string) => {
            const extraName = el.split('+')
            extraNames.push(extraName[0])
            optionPrice += parseFloat(extraName[1].slice(0,-2))
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
        toppings: extraNames,
        mainCat: '',
        payToGo: false,
        newEntry: true
      };
      this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex )
  }



  getData(){
    this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        console.log(response)
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
      console.log(this.tableNumber)
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


