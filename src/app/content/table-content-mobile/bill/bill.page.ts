import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Bill, BillProduct, deletetBillProduct, Table, Topping } from 'src/app/models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import User from 'src/app/auth/user.model';
import { TablesService } from 'src/app/tables/tables.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { emptyBill, emptyDeletetBillProduct, emptyTable } from 'src/app/models/empty-models';
import { round } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HeaderContentPage } from '../header-content/header-content.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { Router } from '@angular/router';
import { AddProductDiscountPage } from 'src/app/modals/add-product-discount/add-product-discount.page';
import { ContentService } from '../../content.service';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { TipsPage } from 'src/app/modals/tips/tips.page';
import { MobileService } from '../table-content-service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderContentPage]
})
export class BillPage implements OnInit, OnDestroy {


  billProducts: BillProduct[] = [];
  billTotal: number = 0;
  billId!: string;
  billIndex: number = 0;

  table: Table = emptyTable();

  cashBackMode: boolean = true

  billToshow!: Bill
  tableNumber: number = 0
  discountValue: number = 0;

  disableOrderButton: boolean = false
  disableAction: boolean = true
  disableMerge: boolean = true
  disableDelete: boolean = true

  breakMode: boolean = false

  client!: any
  clientMode: boolean = true


  user!: User;

  tabSub!: Subscription
  userSub!: Subscription

  color: string = 'none'
  showButtons: boolean = false




  constructor(
    private tableSrv: TablesService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    @Inject(MobileService) private mobilSrv: MobileService,
    private toastCtrl: ToastController,
    private contSrv: ContentService,
    private authSrv: AuthService,
    private router: Router,

  ) { }

  ngOnInit() {

    this.getUser();
    this.getTableNumber();
    this.getBill();
  }

ngOnDestroy(): void {
  if(this.tabSub){
    this.tabSub.unsubscribe()
  }
  if(this.userSub){
    this.userSub.unsubscribe()
  }
}

  showSettings(){
    this.showButtons = !this.showButtons
    this.color === 'none' ? this.color = 'primary' : this.color ='none'
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
       this.userSub = response.subscribe(user => {
          if(user){
            this.user = user;
            // this.incommingOrders()
          }
        })
      }
    })
    }

    getTableNumber(){
      const url = window.location.href;
      const tabs = url.split('/');
      const tab = tabs[4]
      return this.tableNumber = +tab
    }


  sendOrder(out: boolean){
    if(this.billToshow){
      this.disableOrderButton = true
      this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new';
      const tableIndex = this.tableNumber
      this.billToshow.locatie = this.user.locatie
      this.calcBillDiscount(this.billToshow)
      this.tableSrv.saveOrder(tableIndex, this.billId, this.billIndex, this.user.employee, this.user.locatie).subscribe(res => {
        if(res){
          this.disableOrderButton = false
          // if(out){
          //   this.router.navigateByUrl('/tabs/tables')
          // }
        }
      }
      );
    }
  }

  newOrder(){
    this.tableSrv.addNewBill(this.tableNumber, 'COMANDĂ', true)
    this.disableMergeButton()
    this.showOrder(+this.table.bills.length-1)
  }


  newBillOrder(ev: any){
    if(ev === "new"){
      this.newOrder()
    }

  }


  hideAllBils(table: Table){
    table.bills.forEach(bill => {
      bill.show = false
    })
  }

  receiveData(data: string) {
    this.showOrder(+data)
  }

  showOrder(orderIndex: number){
    this.mobilSrv.sendData(orderIndex)
    this.hideAllBils(this.table)
    this.billToshow = this.table.bills[orderIndex]
    this.client = this.billToshow.clientInfo.name.length ? this.billToshow.clientInfo : null
    this.billProducts = [...this.billToshow.products]
    this.billIndex = orderIndex
    if(this.billToshow.payOnline){
      this.billToshow.payment.online = this.billToshow.total
      this.billToshow.total = 0
      this.billToshow.payOnline = false
    }
    // this.billToshow.masaRest.index = this.tableNumber
    this.billToshow.show = true
    this.disableBrakeButton()
    this.calcBillDiscount(this.billToshow)
  }


  addProd(billProIndex: number){
    this.tableSrv.addOne(this.tableNumber, billProIndex, this.billIndex)
  }

  redProd(billProIndex: number){
    this.tableSrv.redOne(this.tableNumber, billProIndex, this.billIndex)
  }


calcProductTotal(products: BillProduct[]){
  let total = 0
  products.forEach(el => {
      total += +el.total
  })
  return total
}


  async openComments(product: BillProduct, index: number){
    if(product.sentToPrint){
    // if(product.toppings.length){
    //   let price: number = 0
    //   product.toppings.forEach(top => {
    //     price += top.price
    //   })
    //   product.price -= price
    //   product.total = product.price * product.quantity
    //   this.billToshow.total -= (price * product.quantity)
    //   product.toppings = []
    //   this.tableSrv.addComment(this.tableNumber, index, this.billIndex, '')
    // }
      let options: Topping[] = []
      let optionPrice: number = 0;
      let pickedToppings: Topping[] = [];
      if(product.toppingsToSend.length){
        const itemsToSort = [...product.toppingsToSend]
        options = itemsToSort.sort((a, b) => a.name.localeCompare(b.name))
      } else {
        const fakeTopping = {name: 'fake',price: 0, qty: 1, ingPrice: 0, um: 's',ing: 's'}
        options.push(fakeTopping)
      }
      if(options.length){
          const extra = await this.actionSheet.openMobileModal(PickOptionPage, options, false)
            if(extra && extra.toppings) {
               pickedToppings = extra.toppings
               pickedToppings.forEach(el => {
                optionPrice += el.price
               })
               const totalPrice = product.price + optionPrice
               product.price = totalPrice
               product.total = totalPrice * product.quantity
               product.discount = round(totalPrice * (product.discount * 100 / product.price) /100)
               product.toppings = [...product.toppings, ...pickedToppings]
               this.billToshow.total += (optionPrice * product.quantity)
            }
            if(extra && extra.comment){
              this.tableSrv.addComment(this.tableNumber, index, this.billIndex, extra.comment)
            }
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
          delProd.locatie = this.user.locatie
          delProd.billProduct.quantity = buc
          delProd.billProduct.total = buc * delProd.billProduct.price
          result.upload ? delProd.inv = 'in' : delProd.inv = 'out'
         this.tabSub = this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
            if(result.upload){
              if(product.toppings.length){
               this.tabSub = this.tableSrv.uploadIngs(product.toppings, buc, this.user.locatie).subscribe()
              }
              this.tabSub = this.tableSrv.uploadIngs(ings, buc, this.user.locatie).subscribe(response => {
                if(response) {
                  showToast(this.toastCtrl, response.message, 4000)
                }
              })
            }
          })

      } else {
        showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
      }
      this.sendOrder(false)

    }
  }


  getBill(){
   this.tabSub = this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
        const table = response.find(obj => obj.index === this.tableNumber)
        if(table){
        this.table = table;
        this.disableMergeButton()
        this.disableDeleteOrderButton()
      }
      this.billToshow = this.table.bills[this.billIndex]
      this.mobilSrv.sendData(this.billIndex)
      if(this.billToshow){
        this.calcBillDiscount(this.billToshow)
      }
      if(this.billToshow && this.billToshow.payOnline){
        this.billToshow.payment.online= this.billToshow.total
        this.billToshow.total = 0
        this.billToshow.payOnline = false
      }
      if(this.billToshow && this.billToshow.clientInfo.name.length) {
        this.billToshow.name = this.billToshow.clientInfo.name
      }

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


modifyImageURL(url: string): string {
  const parts = url.split('/v1');
  const baseURL = parts[0];
  const cropParameters = '/w_555,h_555,c_fill';
  const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
  return cropUrl;
}


async break(index: number){
  const product =  this.billToshow.products[index]
  let qty: number[] = []
  for(let i=1; i<=product.quantity; i++){
    qty.push(i)
  }
  const qtyChioise = await this.actionSheet.breakBillProduct(qty)
  if(qtyChioise){
    this.tableSrv.addNewBill(this.tableNumber, 'COMANDĂ NOUĂ', false)
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
      const cartProduct: BillProduct = {
        name: product.name,
        price: product.price,
        quantity: 1,
        _id: product._id,
        total: product.price,
        imgPath: product.imgPath,
        category: product.category,
        sub: false,
        toppings: [],
        mainCat: product.mainCat,
        payToGo: false,
        newEntry: true,
        discount: product.discount,
        ings: product.ings,
        dep: product.dep,
        printer: product.printer,
        sentToPrint: false,
        imgUrl: product.imgUrl,
        comment: product.comment,
        tva: product.tva,
        toppingsToSend: product.toppings,
        sentToPrintOnline: true,
        qty: product.qty,
        cantitate: product.qty,
        sgrTax: product.sgrTax,
      };
      if(newBillIndex){
        for(let i=0; i<qtyChioise; i++){
          this.tableSrv.addToBill(cartProduct,this.tableNumber, newBillIndex, this.user.name)
          this.tableSrv.redOne(this.tableNumber, index, this.billIndex)
        }
        this.showOrder(newBillIndex);
        this.disableOrderButton = true
        const response = await this.tableSrv.manageSplitBills(this.tableNumber, oldBillIndex, this.user.employee, this.user.locatie)
        if(response){
          this.disableOrderButton = false
        }
        this.disableOrderButton = true
       const resp = await this.tableSrv.manageSplitBills(this.tableNumber, newBillIndex, this.user.employee, this.user.locatie)
       if(response){
        this.disableOrderButton = false
       }
      } else {
        this.tableSrv.removeBill(this.tableNumber, -1)
      }
    }
  }
}

breakOrder(){
  this.breakMode = !this.breakMode

}



disableBrakeButton(){
  if(this.billToshow && this.billToshow.products){
    if(this.billToshow.products.length){
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



  calcBillDiscount(bill: Bill){
    console.log('hit the orders')
    const discountGeneralProcent = bill.clientInfo.discount.general / 100
    const categoryDiscounts = bill.clientInfo.discount.category
    bill.products.forEach(product => {
      categoryDiscounts.forEach(disc => {
      if(product.discount === 0 ){
          if(product.category === disc.cat){
            const productDiscountProcent = disc.precent / 100
            if(discountGeneralProcent < productDiscountProcent){
              product.discount = round(product.quantity * product.price * productDiscountProcent)
            } else if(disc.precent === 0){
              product.discount = 0
            }else{
              product.discount = round(product.quantity * product.price * discountGeneralProcent)
            }
          }
        }
      })
      const index = categoryDiscounts.findIndex(el => el.cat === product.category)
      if(index === -1 && discountGeneralProcent > 0) {
      product.discount = round(product.quantity * product.price * discountGeneralProcent)
      }
    })

    this.discountValue = this.calcDiscountTotal(bill.products)
    if(this.discountValue !== this.billToshow.discount) {
      if(this.discountValue > this.billToshow.discount){
        const dif = this.discountValue - this.billToshow.discount
        this.billToshow.total = round(this.billToshow.total - dif)
        this.billToshow.discount = this.discountValue
      } else {
        const dif = this.billToshow.discount - this.discountValue
        this.billToshow.total = round(this.billToshow.total + dif)
        this.billToshow.discount = this.discountValue
      }
    } else {

    }
  }


  calcDiscountTotal(products: BillProduct[]){
    let discount = 0
    products.forEach(el => {
        discount += el.discount
    })
    return discount
  }

  async addTips(){
    const tipsValue = await this.actionSheet.openAuth(TipsPage)
    if(tipsValue){
      if(this.billToshow.tips > 0){
        this.billToshow.total =   this.billToshow.total - this.billToshow.tips
        this.billToshow.tips = tipsValue
        this.billToshow.total  =   this.billToshow.total  + tipsValue
      } else {
        this.billToshow.tips = tipsValue
        this.billToshow.total =   this.billToshow.total  + tipsValue
    }
  }
  }

  async payment(){
    this.sendOrder(false)
      const paymentInfo = await this.actionSheet.openMobileModal(PaymentPage, this.billToshow, false)
        if(paymentInfo){
          this.billToshow.payment.card = paymentInfo.card;
          this.billToshow.payment.cash = paymentInfo.cash;
          this.billToshow.payment.voucher = paymentInfo.voucher;
          this.billToshow.payment.viva = paymentInfo.viva;
          this.billToshow.cif = paymentInfo.cif;
          this.billToshow.payment.online  = paymentInfo.online
         this.tabSub = this.tableSrv.sendBillToPrint(this.billToshow).subscribe(response => {
            if(response){
              this.billToshow.discount = 0
              this.tableSrv.removeBill(this.tableNumber, this.billIndex)
              this.billProducts = []
              this.billToshow = emptyBill()
              this.billToshow.cashBack = 0
              this.client = null
              this.router.navigateByUrl("/tabs/tables")
            }
          })
    }
  }

  async addCustomer(clientMode: boolean){
  if(clientMode){
    const clientInfo = await this.actionSheet.openMobileModal(CustomerCheckPage, '', false)
    if(clientInfo.message === "client"){
      this.client = clientInfo.data
      this.clientMode = false
      this.billToshow.clientInfo = this.client
      this.billToshow.name = this.client.name
      this.tableSrv.addCustomer(this.client, this.tableNumber, this.billIndex)
      this.sendOrder(false)
    }
    if(clientInfo.message === "voucher"){
      this.billToshow.voucher = clientInfo.data
      if(this.billToshow.total < this.billToshow.voucher){
        this.billToshow.voucher = this.billToshow.total
      }
      this.billToshow.total = this.billToshow.total - this.billToshow.voucher
      this.clientMode = false
    }
  } else {
    if(this.billToshow.cashBack > 0){
      this.billToshow.total = this.billToshow.total + this.billToshow.cashBack
      this.billToshow.cashBack = 0
      this.cashBackMode = true
    }
    if(this.billToshow){
      this.billToshow.products.forEach(el => {
        el.discount = 0
      })
      this.billToshow.total = round(this.billToshow.total + this.billToshow.discount);
      this.billToshow.discount = 0
      this.billToshow._id.length ? this.billId = this.billToshow._id : this.billId = 'new';
    }
    // this.discountValue = 0
    this.client = null
    this.disableOrderButton = true
    const response = await this.tableSrv.redCustomer(this.tableNumber, this.billIndex, this.billId, this.user.employee, this.user.locatie)
    if(response) {
      this.disableOrderButton = false
      this.clientMode = true;
    }
  }

  }




  async useCashBack(mode: boolean){
    if(mode){
      const data = { cashBack: this.client.cashBack, total: this.billToshow.total}
      const cashBackValue = await this.actionSheet.openPayment(CashbackPage, data)
      if(cashBackValue){
        this.billToshow.cashBack = cashBackValue;
        this.billToshow.total  = this.billToshow.total - cashBackValue
        this.cashBackMode = false
      }
    }else {
      this.billToshow.total = this.billToshow.cashBack + this.billToshow.total
      this.cashBackMode = true
      this.billToshow.cashBack = 0
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
            delProd.locatie = this.user.locatie
            delProd.billProduct.quantity = buc
            delProd.billProduct.total = buc * delProd.billProduct.price
            choise.upload ? delProd.inv = 'in' : delProd.inv = 'out'
            this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
              if(choise.upload){
                if(el.toppings.length){
                  this.tableSrv.uploadIngs(el.toppings, buc, this.user.locatie).subscribe()
                }
                this.tableSrv.uploadIngs(el.ings, buc, this.user.locatie).subscribe(response => {
                  if(response) {
                    showToast(this.toastCtrl, response.message, 3000)
                  }
                })
              }
            })
          })
          } else {
            showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
            return
          }

            data.push({id: this.billToshow._id})
            this.tableSrv.removeBill(this.tableNumber, this.billIndex)
            this.tableSrv.deleteOrders(data).subscribe()
            this.billProducts = []
            this.client = null
            this.clientMode = true
            this.billToshow = emptyBill()
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
        if(orders){
          this.disableOrderButton = true
          const response = await this.tableSrv.mergeBills(this.tableNumber, orders, this.user.employee, this.user.locatie)
          if(response) {
           this.tabSub = this.tableSrv.deleteOrders(orders).subscribe()
            let index = bills.findIndex(obj => obj.name === 'UNITE')
            this.showOrder(index)
            this.disableOrderButton = false
          }
        }
      }
    }


roundInHtml(num: number){
  return round(num)
}


}
