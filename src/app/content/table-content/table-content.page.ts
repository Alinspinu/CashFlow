import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../content.service';
import { Category, Product } from '../../models/category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { Bill, BillProduct, deletetBillProduct, Ing, Table, Topping } from 'src/app/models/table.model';
import { TablesService } from 'src/app/tables/tables.service';
import { Subscription } from 'rxjs';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { IonInput } from '@ionic/angular/standalone';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { DiscountPage } from 'src/app/modals/discount/discount.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';
import { emptyDeletetBillProduct, emptyTable } from 'src/app/shared/utils/empty-models';

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.page.html',
  styleUrls: ['./table-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, CapitalizePipe]
})
export class TableContentPage implements OnInit, OnDestroy {

  @ViewChild('addNameInput') nameInput!: IonInput;
  @ViewChild('billContent') content!: IonContent;



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

  table: Table = emptyTable();
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
  breakMode: boolean = false

  disableAction: boolean = true
  disableMerge: boolean = true
  disableDelete: boolean = true

  userSub!: Subscription;
  user!: User;

  comment: string = ''

  constructor(
    private route: ActivatedRoute,
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private tableSrv: TablesService,
    private toastCtrl: ToastController,
    private authSrv: AuthService
    ) { }


  ngOnInit() {
    this.getTableNumber();
    this.getData();
    this.getBill();
    this.getUser();
  }

  ngOnDestroy(): void {
    if(this.tabSub){
      this.tabSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }

  //***************************NG-ON-INIT************************** */

  getTableNumber(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.tableNumber = parseFloat(id);
      }
    })
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

  getBill(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
      const table = response.find(obj => obj.index === this.tableNumber)
      if(table){
        this.table = table;
        this.disableMergeButton()
        this.disableDeleteOrderButton()
      }
      this.billToshow = this.table.bills[this.billIndex]
      this.disableBrakeButton()
      if(this.billToshow && this.billToshow.clientInfo.name.length){
        this.client = this.billToshow.clientInfo
        this.clientMode = false
      }
     if(this.billToshow){
      this.hideAllBils(this.table)
      this.billToshow.show = true
       this.billProducts = [...this.billToshow.products]
     }
    }
    })
  }

  getUser(){
  this.userSub = this.authSrv.user$.subscribe(response => {
    if(response){
      response.subscribe(user => {
        if(user){
          this.user = user;
        }
      })
    }
  })
  }



  //*******************MENU NAVIGATION********************************* */

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


// ***********************ORDERS CONTROLS*********************

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
    this.client = this.billToshow.clientInfo.name.length ? this.billToshow.clientInfo : null
    this.billProducts = [...this.billToshow.products]
    this.billIndex = orderIndex
    // this.billToshow.masaRest.index = this.tableNumber
    this.billToshow.show = true
    this.disableBrakeButton()
  }

  newOrder(){
    this.tableSrv.addNewBill(this.tableNumber, 'COMANDĂ')
    this.disableMergeButton()
    this.showOrder(+this.table.bills.length-1)
  }

  hideAllBils(table: Table){
    table.bills.forEach(bill => {
      bill.show = false
    })
  }



//*********** BILL CONTROLS *******************************************/

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
    const cartProduct: BillProduct = {
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
      ings: ings,
      printer: product.printer,
      sentToPrint: true,
      imgUrl: product.image.path,
      comment: this.comment,
      tva: product.tva,
    };
    this.disableBrakeButton()
    this.disableDeleteOrderButton()
    this.tableSrv.addToBill(cartProduct, this.tableNumber, this.billIndex)
    if(this.billToshow.products.length > 5){
      setTimeout(()=>{
        this.content.scrollToBottom(300);
      }, 200)
    }
  }

  addProd(billProIndex: number){
    this.tableSrv.addOne(this.tableNumber, billProIndex, this.billIndex)
  }

  redProd(billProIndex: number){
    this.tableSrv.redOne(this.tableNumber, billProIndex, this.billIndex)
  }


  async openComments(productIndex: number, print: boolean){
    if(print) {
      const title = "Detalii"
      const message = "Adaugă extra detalii"
      const label = "Scriere comentariu"
      const result = await this.actionSheet.reasonAlert(title, message, label)
      if(result) {
        this.tableSrv.addComment(this.tableNumber, productIndex, this.billIndex, result)
      }
    }
    }


  async openDeleteAlert(qty: number, index: number, ings: any, product: BillProduct){
    let numberArr: string [] = []
    let delProd: deletetBillProduct = emptyDeletetBillProduct()
    for(let i=1; i<=qty; i++){
      numberArr.push(i.toString())
    }
    const result = await this.actionSheet.deleteBillProduct(numberArr)
    if(result){
      const buc = parseFloat(result.qty);
      const title = "MOTIVUL ȘTERRII"
      const message = "Scrie motivul pentru care vrei să stergi produsul!"
      const label = "Scrie motivul"
      const reason = await this.actionSheet.reasonAlert(title, message, label);
        if(reason) {
          for(let i=0; i<buc; i++){
            this.tableSrv.redOne(this.tableNumber, index, this.billIndex)
            this.disableBrakeButton()
          }
          delProd.billProduct = product
          delProd.reason = reason;
          delProd.employee = this.user.employee
          delProd.locatie = environment.LOCATIE
          delProd.billProduct.quantity = buc
          delProd.billProduct.total = buc * delProd.billProduct.price
          result.upload ? delProd.inv = 'in' : delProd.inv = 'out'
          this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
            if(result.upload){
              if(product.toppings.length){
                this.tableSrv.uploadIngs(product.toppings, buc).subscribe()
              }
              this.tableSrv.uploadIngs(ings, buc).subscribe(response => {
                if(response) {
                  showToast(this.toastCtrl, response.message, 4000)
                }
              })
            }
          })

      } else {
        showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
      }
      this.sendOrder()

    }
  }

//***********************************BUTTONS LOGIC************************** */


sendOrder(){
  this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new';
  const tableIndex = this.tableNumber
  this.tableSrv.saveTablesLocal(tableIndex, this.billId, this.billIndex, this.user.employee).subscribe(res => {
  }
  );
}


async payment(){
  this.sendOrder()
  const paymentInfo = await this.actionSheet.openPayment(PaymentPage, this.billToshow)
    if(paymentInfo){
      this.billToshow.payment.card = paymentInfo.card;
      this.billToshow.payment.cash = paymentInfo.cash;
      this.billToshow.payment.voucher = paymentInfo.voucher;
      this.billToshow.payment.viva = paymentInfo.viva;
      this.billToshow.cif = paymentInfo.cif;
      this.billToshow.payment.online  = paymentInfo.online
      this.tableSrv.sendBillToPrint(this.billToshow).subscribe(response => {
        if(response){
          this.tableSrv.removeBill(this.tableNumber, this.billIndex)
          this.billToshow.discount = 0
          this.billProducts = []
          this.home()
        }
      })
    }
}



async addCustomer(clientMode: boolean){
if(clientMode){
  const clientInfo = await this.actionSheet.openPayment(CustomerCheckPage, '')
  if(clientInfo){
    this.client = clientInfo
    this.clientMode = false
    this.billToshow.clientInfo = this.client
    this.billToshow.name = this.client.name
    this.tableSrv.addCustomer(this.client, this.tableNumber, this.billIndex)
    this.sendOrder()
  }
} else {
  if(this.billCashBack){
    this.billToshow.total = this.billToshow.total + this.billCashBack
    this.billCashBack = null
    this.cashBackMode = true
  }
  this.client = null
  this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new';
  this.tableSrv.redCustomer(this.tableNumber, this.billIndex, this.billId, this.user.employee)
  this.clientMode = true;
}

}


async addDiscount(mode: boolean){
  if(mode){
    const discountValue = await this.actionSheet.openPayment(DiscountPage, this.billToshow.total)
    if(discountValue){
      this.billToshow.discount = discountValue
      this.billToshow.total = this.billToshow.total - discountValue;
      this.discountValue = discountValue;
      this.discountMode = false;
    }
  } else {
    this.billToshow.discount = 0
    this.billToshow.total = this.billToshow.total + this.discountValue
    this.discountValue = 0
    this.discountMode = true
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


  async deleteOrder(){
    let data = []
    if(this.billProducts && this.billProducts.length && !this.billProducts[0].sentToPrint){
      const choise = await this.actionSheet.deleteBill()
      if(choise){
        const title = "MOTIVUL ȘTERRII"
        const message = "Scrie motivul pentru care vrei să stergi comanda!"
        const label = "Scrie motivul"
        const reason = await this.actionSheet.reasonAlert(title, message, label);
        if(reason) {
          this.billProducts.forEach((el: BillProduct) => {
          let delProd: deletetBillProduct = emptyDeletetBillProduct()
          const buc = el.quantity;
          delProd.billProduct = el
          delProd.reason = reason;
          delProd.employee = this.user.employee
          delProd.locatie = environment.LOCATIE
          delProd.billProduct.quantity = buc
          delProd.billProduct.total = buc * delProd.billProduct.price
          choise.upload ? delProd.inv = 'in' : delProd.inv = 'out'
          this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
            if(choise.upload){
              if(el.toppings.length){
                this.tableSrv.uploadIngs(el.toppings, buc).subscribe()
              }
              this.tableSrv.uploadIngs(el.ings, buc).subscribe(response => {
                if(response) {
                  showToast(this.toastCtrl, response.message, 3000)
                }
              })
            }
          })
        })
        } else {
          showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
        }

          data.push({id: this.billToshow._id})
          this.tableSrv.removeBill(this.tableNumber, this.billIndex)
          this.tableSrv.deleteOrders(data).subscribe()
          this.billProducts = []
        }
    } else {
      this.tableSrv.removeBill(this.tableNumber, this.billIndex)
      this.billProducts = []
      if(this.table.bills.length){
      this.showOrder(0)
      }
    }
  }

  async mergeOrders(){
    const bills = this.table.bills;
    if(bills.length > 1){
      let name: string[] = [];
      let id: any[] = [];
      let billIndex: number[] = [];
      bills.forEach((el, i) => {
       el.name === "COMANDA" ? name.push(el.name + ` ${i+1}`) : name.push(el.name)
       id.push(el._id)
       billIndex.push(i)
      })
      let options = name.map((val, index) =>({name: val, data: {id: id[index], billIndex: billIndex[index]}}))
      const orders = await this.actionSheet.mergeOreders(options)
      this.tableSrv.mergeBills(this.tableNumber, orders, this.user.employee)
      this.tableSrv.deleteOrders(orders).subscribe()
      let index = bills.findIndex(obj => obj.name === 'UNITE')
      this.showOrder(index)
    }
  }



  breakOrder(){
    this.breakMode = !this.breakMode
  }

 async break(index: number){
    const product =  this.billToshow.products[index]
    let qty: number[] = []
    for(let i=1; i<=product.quantity; i++){
      qty.push(i)
    }
    const qtyChioise = await this.actionSheet.breakBillProduct(qty)
    if(qtyChioise){
      this.tableSrv.addNewBill(this.tableNumber, 'COMANDĂ NOUĂ')
      const oldBillIndex = this.tableSrv.getBillIndex(this.tableNumber-1, this.billToshow._id)
      const bills = this.table.bills;
      if(bills.length > 1){
        let name: string[] = [];
        let billIndex: number[] = [];
        bills.forEach((el, i) => {
         el.name === "COMANDA" ? name.push(el.name + ` ${i+1}`) : name.push(el.name)
         billIndex.push(i)
        })
        let options = name.map((val, index) =>({name: val, billIndex: billIndex[index]}))
        const newBillIndex = await this.actionSheet.mergeOredersProducts(options)
        if(newBillIndex){
          for(let i=0; i<qtyChioise; i++){
            this.tableSrv.addToBill(product, this.tableNumber, newBillIndex)
            this.tableSrv.redOne(this.tableNumber, index, this.billIndex)
          }
          this.showOrder(newBillIndex);
          this.tableSrv.manageSplitBills(this.tableNumber, oldBillIndex, this.user.employee)
          this.tableSrv.manageSplitBills(this.tableNumber, newBillIndex, this.user.employee)
        } else {
          this.tableSrv.removeBill(this.tableNumber, -1)
        }
      }
    }
  }

  //**********************************DISABLE// ENAMEBLE BUTTONS************************ */
  disableBrakeButton(){
    if(this.billToshow && this.billToshow.products){
      if(this.billToshow.products.length){
        console.log('something')
        this.billToshow.products.forEach((el,i) => {
          if(el.quantity > 1 && !el.sentToPrint || i > 0 && !el.sentToPrint) {
            this.disableAction = false
          } else {
            this.disableAction = true
          }
        })
      } else {
        this.disableAction = true
      }
    }
    }

  disableMergeButton(){
    this.table.bills.length > 1 ? this.disableMerge = false : this.disableMerge = true
  }

  disableDeleteOrderButton(){
    this.table.bills.length ? this.disableDelete = false : this.disableDelete = true
  }


//******************FUNCTIONS***************************** */

getObjectKeys(obj: any): string[] {
  return Object.keys(obj);
}

modifyImageURL(url: string): string {
  const parts = url.split('/v1');
  const baseURL = parts[0];
  const cropParameters = '/w_555,h_555,c_fill';
  const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
  return cropUrl;
}

arraysAreEqual = (arr1: {}[], arr2: {}[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);



}




