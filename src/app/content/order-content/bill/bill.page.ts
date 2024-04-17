import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent, ToastController, BooleanValueAccessor } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, map, switchMap, of } from 'rxjs';
import { Bill, BillProduct, deletetBillProduct, Ing, Table, Topping } from 'src/app/models/table.model';
import { emptyBill, emptyBillProduct, emptyDeletetBillProduct, emptyTable } from 'src/app/models/empty-models';
import { TablesService } from 'src/app/tables/tables.service';
import { WebRTCService } from '../../webRTC.service';
import { getSection, round } from 'src/app/shared/utils/functions';
import { Category, Product } from 'src/app/models/category.model';
import User from 'src/app/auth/user.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { triggerEscapeKeyPress, showToast } from 'src/app/shared/utils/toast-controller';
import { AuthService } from 'src/app/auth/auth.service';
import { OrderService } from '../order-content.service';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { ContentService } from '../../content.service';
import { AddProductDiscountPage } from 'src/app/modals/add-product-discount/add-product-discount.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { TipsPage } from 'src/app/modals/tips/tips.page';


@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BillPage implements OnInit, OnDestroy {

  @ViewChild('billContent') content!: IonContent;


  tabSub!: Subscription
  userSub!: Subscription
  contSub!: Subscription

  isLoading: boolean = false
  tableNumber!: number

  showZeroTips: boolean = false
  discountValue: number = 0;

  billIndex: number = 0;

  table: Table = emptyTable()
  billToshow: Bill = emptyBill()
  billProducts: BillProduct[] = []
  allCats: Category[] = [];

  user!: User

  client!: any
  cashBackMode: boolean = false
  clientMode: boolean = true


  disableAction: boolean = true
  disableMerge: boolean = true
  disableDelete: boolean = true
  breakMode: boolean = false

  invite: string = 'invite'
  billId!: string

  disableOrderButton: boolean = false


  constructor(
    private route: ActivatedRoute,
    private tableSrv: TablesService,
    private webRTC: WebRTCService,
    private orderService: OrderService,
    private contSrv: ContentService,
    private router: Router,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }

  ngOnInit() {
    this.getTableNumber()
    this.getUser()
    this.getCategories()
  }

  ngOnDestroy(): void {
      if(this.tabSub){
        this.tabSub.unsubscribe()
      }
      if(this.userSub){
        this.userSub.unsubscribe()
      }
  }

  getUserTips(){
    this.webRTC.getUserTipObservable().subscribe(response => {
      if(response || response === 0){
        if(this.billToshow){
          this.billToshow.tips = response
          this.billToshow.total += response
          // this.webRTC.sendProductData(JSON.stringify(this.billToshow))
          this.invite = "invite"
        }
        if(response === 0){
          this.showZeroTips = true
        }
      }
    })
  }


  getCategories(){
    this.contSub = this.contSrv.categorySend$.subscribe(response => {
      if(response){
        this.allCats = response
      }
    })
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




  getTableNumber(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.tableNumber = parseFloat(id);
        this.getBill()
      }
    })
  }

  getBill(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
        console.log("get table")
      const table = response.find(obj => obj.index === this.tableNumber)
      if(table){
        this.table = table;
        this.disableMergeButton()
        this.disableDeleteOrderButton()
      }
      this.billToshow = this.table.bills[this.billIndex]
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
      this.webRTC.sendProductData(JSON.stringify(this.billToshow))
       this.billProducts = [...this.billToshow.products]
     }
    if(this.billToshow && this.billToshow.productCount > 4){
      setTimeout(()=>{
        this.content.scrollToBottom(300);
      }, 200)
    }
    }
    })
  }



  hideAllBils(table: Table){
    table.bills.forEach(bill => {
      bill.show = false
    })
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
          const title = "MOTIVUL ȘTERGERII"
          const message = "Alege motivul pentru care vrei să stergi comanda!"
          const label = "Scrie motivul"
          const response = await this.actionSheet.reasonAlert(title, message, label);
          let reason = ''
          let admin =''
          if(response) {
            reason = response
            if(response === 'protocol'){
              const res = await this.actionSheet.protocolAlert()
              if(res){
               admin = res
              } else {
               return showToast(this.toastCtrl, 'Trebuie să alegi un responsabil!', 3000)
              }
            }
            if(response === 'altele'){
              const res = await this.actionSheet.detailsAlert()
              if(res){
                reason = res
              } else {
                return showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi nota!', 3000)
              }
            }
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
           this.tabSub = this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
              if(choise.upload){
                const operation = {name: 'intoarcere', details: el.name}
                if(el.toppings.length){
                this.tabSub =  this.tableSrv.uploadIngs(el.toppings, buc, operation, this.user.locatie).subscribe()
                }
                this.tabSub = this.tableSrv.uploadIngs(el.ings, buc, operation, this.user.locatie).subscribe(response => {
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
            this.tabSub = this.tableSrv.deleteOrders(data).subscribe(response => {
              if(response){
                this.billProducts = []
                this.client = null
                this.clientMode = true
                this.billToshow = emptyBill()
                if(this.table.bills.length){
                  this.showOrder(0)
                } else {
                this.router.navigateByUrl('/tabs/tables')
              }
              }
            })
          }
        } else {
          this.tableSrv.removeBill(this.tableNumber, this.billIndex)
          this.billProducts = []
          if(this.table.bills.length){
            this.showOrder(0)
          } else {
          this.router.navigateByUrl('/tabs/tables')
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





  breakOrder(){
    this.breakMode = !this.breakMode

  }

  showOrder(orderIndex: number){
    this.hideAllBils(this.table)
    this.billToshow = this.table.bills[orderIndex]
    this.client = this.billToshow.clientInfo.name.length ? this.billToshow.clientInfo : null
    this.billProducts = [...this.billToshow.products]
    this.billIndex = orderIndex
    this.orderService.setOrderIndex(orderIndex)
    if(this.billToshow.payOnline){
      this.billToshow.payment.online = this.billToshow.total
      this.billToshow.total = 0
      this.billToshow.payOnline = false
    }
    // this.billToshow.masaRest.index = this.tableNumber
    this.billToshow.show = true
    this.webRTC.sendProductData(JSON.stringify(this.billToshow))
    this.disableBrakeButton()
    this.calcBillDiscount(this.billToshow)
  }


  newOrder(){
    this.tableSrv.addNewBill(this.tableNumber, 'NEW', true)
    this.disableMergeButton()
    this.showOrder(+this.table.bills.length-1)
  }


  sendOrder(out: boolean): Observable<boolean> {
    if (this.billToshow) {
      this.disableOrderButton = true;
      this.billToshow._id.length
        ? (this.billId = this.billToshow._id)
        : (this.billId = 'new');
      const tableIndex = this.tableNumber;
      this.billToshow.locatie = this.user.locatie;
      this.calcBillDiscount(this.billToshow);
      if(this.billToshow.inOrOut && this.billToshow.inOrOut !== ''){
        return this.tableSrv.saveOrder(
          tableIndex,
          this.billId,
          this.billIndex,
          this.user.employee,
          this.user.locatie,
          this.billToshow.inOrOut
        ).pipe(
          map((res) => {
            this.disableOrderButton = false;
            if (out && res) {
              this.router.navigateByUrl('/tabs/tables');
            }
            return !!res; // Convert the response to a boolean
          })
        );
      } else {
        return this.actionSheet.chosseInOrOut().pipe(
          switchMap((response) => {
            this.billToshow.inOrOut = response.inOrOut
            return this.tableSrv.saveOrder(
              tableIndex,
              this.billId,
              this.billIndex,
              this.user.employee,
              this.user.locatie,
              this.billToshow.inOrOut
            ).pipe(
              map((res) => {
                this.disableOrderButton = false;
                if (out && res) {
                  this.router.navigateByUrl('/tabs/tables');
                }
                return !!res; // Convert the response to a boolean
              })
            );
          })
        )
      }

    } else {
      // If this.billToshow is not truthy, return Observable of false
      return of(false);
    }
  }


  async payment(){
    this.sendOrder(false).subscribe(async(response) => {
      if(response){
        const paymentInfo = await this.actionSheet.openPayment(PaymentPage, this.billToshow)
          if(paymentInfo){
            this.billToshow.payment = paymentInfo
            this.billToshow.cif = paymentInfo.cif;
           this.tabSub = this.tableSrv.sendBillToPrint(this.billToshow).subscribe({
                  next: (response => {
                    if(response && response.bill.status === 'done'){
                      this.tableSrv.removeBill(this.tableNumber, this.billIndex)
                      this.billToshow = emptyBill()
                      this.client = null
                      this.router.navigateByUrl("/tabs/tables")
                      showToast(this.toastCtrl, response.message, 3000)
                    }
                  }),
                  error: (error => {
                    if(error){
                      this.isLoading = false
                      showToast(this.toastCtrl, error.error.message, 3000)
                    }
                  }),
                  complete: () => console.log('complete')
            })
      }
      }
    })
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
          section: product.section,
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
          description: product.description,
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


  async addDiscount(){
    let dataToSend: any = []
    this.allCats.forEach(cat => {
      console.log(cat)
      cat.product.forEach(product => {
        if(product.discount > 0){
          const data = {
            precent: product.discount,
            productId: product._id,
            name: product.name
          }
            dataToSend.push(data)
        }
      })
    })
    const products = await this.actionSheet.openPayment(AddProductDiscountPage, dataToSend)
    if(products) {
      this.contSrv.setProdDisc(products).subscribe(response => {
        if(response){
          this.contSrv.editProductDiscount(products)
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, err => {
        showToast(this.toastCtrl, err.message, 3000)
      })
    }
  }


  async addTips(){
    const tipsValue = await this.actionSheet.openAuth(TipsPage)
    if(tipsValue || tipsValue === 0){
      if(this.billToshow.tips > 0){
        this.billToshow.total =   this.billToshow.total - this.billToshow.tips
        this.billToshow.tips = tipsValue
        this.billToshow.total  =   this.billToshow.total  + tipsValue
      } else {
        this.billToshow.tips = tipsValue
        this.billToshow.total =   this.billToshow.total  + tipsValue
    }
    this.webRTC.sendProductData(JSON.stringify(this.billToshow))
  }
  }


  addProd(billProIndex: number){
    this.tableSrv.addOne(this.tableNumber, billProIndex, this.billIndex)
  }

  redProd(billProIndex: number){
    this.tableSrv.redOne(this.tableNumber, billProIndex, this.billIndex)
  }



  async openComments(product: BillProduct, index: number){
    if(product.sentToPrint){
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
          const extra = await this.actionSheet.openModal(PickOptionPage, options, false)
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
               this.tableSrv.addTopping(this.tableNumber, index, this.billIndex, product)
            }
            if(extra && extra.comment){
              this.tableSrv.addComment(this.tableNumber, index, this.billIndex, extra.comment)
            }
        }
    }
    }


    async addCustomer(clientMode: boolean){
      if(clientMode){
        const clientInfo = await this.actionSheet.openPayment(CustomerCheckPage, '')
        if(clientInfo.message === "client"){
          this.client = clientInfo.data
          this.clientMode = false
          this.billToshow.clientInfo = this.client
          this.billToshow.name = this.client.name
          this.billToshow.inOrOut = '',
          this.tableSrv.addCustomer(this.client, this.tableNumber, this.billIndex)
          this.sendOrder(false).subscribe(response => {
            console.log(response)
          })
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
        this.disableOrderButton = true
        const response = await this.tableSrv.redCustomer(this.tableNumber, this.billIndex, this.billId, this.user.employee, this.user.locatie)
        if(response) {
          this.disableOrderButton = false
          this.clientMode = true;
          this.client = null
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
      const title = "MOTIVUL ȘTERGERII"
      const message = "Alege motivul pentru care vrei să stergi produsul!"
      const label = "Scrie motivul"
      let admin = ''
      let reason = ''
      const response = await this.actionSheet.reasonAlert(title, message, label);
        if(response) {
          reason = response
          if(response === 'protocol'){
            const res = await this.actionSheet.protocolAlert()
            if(res){
             admin = res
            } else {
              return showToast(this.toastCtrl, 'Trebuie să alegi un responsabil!', 3000)
            }
          }
          if(response === 'altele'){
            const res = await this.actionSheet.detailsAlert()
            if(res){
              reason = res
            } else {
              return showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
            }
          }
          for(let i=0; i<buc; i++){
            this.tableSrv.redOne(this.tableNumber, index, this.billIndex)
            this.disableBrakeButton()
          }
          delProd.billProduct = product
          delProd.reason = reason;
          delProd.admin = admin
          delProd.employee = this.user.employee
          delProd.locatie = this.user.locatie
          delProd.billProduct.quantity = buc
          delProd.billProduct.total = buc * delProd.billProduct.price
          result.upload ? delProd.inv = 'in' : delProd.inv = 'out'
         this.tabSub = this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
            if(result.upload){
              const operation = {name: 'intoarcere', details: product.name}
              if(product.toppings.length){
               this.tabSub = this.tableSrv.uploadIngs(product.toppings, buc, operation, this.user.locatie).subscribe()
              }
              this.tabSub = this.tableSrv.uploadIngs(ings, buc, operation, this.user.locatie).subscribe(response => {
                if(response) {
                  showToast(this.toastCtrl, response.message, 4000)
                }
              })
            }
          })

      } else {
        showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
      }
      this.sendOrder(false).subscribe()

    }
  }







  calcBillDiscount(bill: Bill){
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




modifyImageURL(url: string): string {
  const parts = url.split('/v1');
  const baseURL = parts[0];
  const cropParameters = '/w_555,h_555,c_fill';
  const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
  return cropUrl;
}


calcProductTotal(products: BillProduct[]){
  let total = 0
  products.forEach(el => {
      total += +el.total
  })
  return total
}


roundInHtml(num: number){
  return round(num)
}

toggleFullscreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}


}
