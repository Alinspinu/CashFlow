import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentService } from '../content.service';
import { Category, Product } from '../../models/category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { showToast} from 'src/app/shared/utils/toast-controller';
import { Bill, BillProduct, deletetBillProduct, Ing, Table, Topping } from 'src/app/models/table.model';
import { TablesService } from 'src/app/tables/tables.service';
import { map, Observable, of, Subscription, switchMap, BehaviorSubject } from 'rxjs';
import { IonInput } from '@ionic/angular/standalone';
import { PaymentPage } from 'src/app/modals/payment/payment.page';
import { CustomerCheckPage } from 'src/app/modals/customer-check/customer-check.page';
import { CashbackPage } from 'src/app/modals/cashback/cashback.page';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { AuthService } from 'src/app/auth/auth.service';
import User from 'src/app/auth/user.model';
import { emptyBill, emptyDeletetBillProduct, emptyTable } from 'src/app/models/empty-models';
import { round } from 'src/app/shared/utils/functions';
import { TipsPage } from 'src/app/modals/tips/tips.page';
import { AddProductDiscountPage } from 'src/app/modals/add-product-discount/add-product-discount.page';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';
import { WebRTCService } from '../webRTC.service';
import { MeniuPage} from './meniu/meniu.page';
import { BillPage } from './bill/bill.page';
import { emptyBillProduct } from '../../models/empty-models';
import { ScreenSizeService } from 'src/app/shared/screen-size.service';


interface billData{
  billProducts: BillProduct[],
  billToshow: Bill,
  breakMode: boolean,
  billIndex: number,
  tableNumber: number,
  table: Table
}

@Component({
  selector: 'app-table-content',
  templateUrl: './table-content.page.html',
  styleUrls: ['./table-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, CapitalizePipe, SpinnerPage, MeniuPage, BillPage]
})
export class TableContentPage implements OnInit, OnDestroy {

  @ViewChild('addNameInput') nameInput!: IonInput;
  @ViewChild('billContent') content!: IonContent;

  @ViewChild('menuCont') menuCont!: HTMLDivElement

  invite: string = 'invite'
   order!: Bill
  onlineOrder: boolean = false
  dynamicColorChange = false
  colorToggleInterval: any;

  disableOrderButton: boolean = false
  sendOrderSub!: Subscription

  isLoading: boolean = true
  showZeroTips: boolean = false

  discountValue: number = 0;
  discountMode: boolean = true

  tabSub!: Subscription;
  allCats: Category[] = [];
  mainCats: {[key: string]: Category[]} = {};
  categoriesToShow!: Category[];
  productsToShow!: Product[];


  orderName: string = ""

  table: Table = emptyTable();
  tableNumber: number = 0;
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
  tableSub!: Subscription;
  screenSub!: Subscription
  user!: User;

  comment: string = ''

  outside: boolean = false

  workCashBack: number = 0
  hideTips: boolean =false

  tipsCol: number = 1.5
  smallCol: number = 2.75
  sendCol: number = 2.5
  billCol: number = 2.5


  data: {
    mainCats: any,
    billIndex: number,
    tableNumber: number,
    showMainCats: boolean,
    showCats: boolean,
    showProd: boolean
  } = {
    mainCats: [],
    billIndex: 0,
    tableNumber: 0,
    showMainCats: true,
    showCats: false,
    showProd: false
  }

  billData: billData = {
    billProducts: [emptyBillProduct()],
    billToshow: emptyBill(),
    breakMode: false,
    billIndex: 0,
    tableNumber: 0,
    table: emptyTable()
  }

  private billDataSubject = new BehaviorSubject<billData>(this.billData)
    billData$ = this.billDataSubject.asObservable()

  constructor(
    private route: ActivatedRoute,
    private contSrv: ContentService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private tableSrv: TablesService,
    private toastCtrl: ToastController,
    private authSrv: AuthService,
    private router: Router,
    private webRTC: WebRTCService,
    private screenSizeService: ScreenSizeService,
    ) { }


  ngOnInit() {
    this.getUser();
    this.getTableNumber();
    this.getData();
    this.getBill();
    this.getScreenSize()
  }

  ngOnDestroy(): void {
    if(this.tabSub){
      this.tabSub.unsubscribe();
    }
    if(this.userSub){
      this.userSub.unsubscribe()
    }
    if(this.tableSub){
      this.tableSub.unsubscribe()
    }
    if(this.sendOrderSub){
      this.sendOrderSub.unsubscribe()
    }
    if(this.screenSub){
      this.screenSub.unsubscribe()
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


  getScreenSize(){
    this.screenSub = this.screenSizeService.screenSize$.subscribe(screen => {
      if(screen === 'Tablet'){
      this.hideTips = true
       this.billCol = 4
      } else if( screen === 'TabletWide'){
       this.hideTips = false
       this.billCol = 2.5
      }
    })
  }


  getData(){
    this.contSrv.categorySend$.subscribe(response => {
      if(response.length > 1){
        this.isLoading = false
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
        this.data.mainCats = this.mainCats
      }
    })
  }

  getBill(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
      const table = response.find(obj => obj.index === this.tableNumber)
      if(table){
        let bills: Bill[] = []
        this.table = table;
        this.table.bills.forEach(bill => {
          if(bill){
            bills.push(bill)
          }
        })
        this.billData.table = this.table
        this.billData.table.bills = bills
        this.disableMergeButton()
        this.disableDeleteOrderButton()
      }
      this.billData.billToshow = this.table.bills[this.billIndex]
      if(!this.billData.billToshow){
        this.billData.billToshow = emptyBill()
        this.billData.billToshow.masaRest.index = this.tableNumber
      }
      if(this.billData.billToshow && this.billData.billToshow.payOnline){
        this.billData.billToshow.payment.online= this.billData.billToshow.total
        this.billData.billToshow.total = 0
        this.billData.billToshow.payOnline = false
      }
      if(this.billData.billToshow && this.billData.billToshow.clientInfo && this.billData.billToshow.clientInfo.name.length) {
        this.billData.billToshow.name = this.billData.billToshow.clientInfo.name
        this.clientMode = false
      } else {
        this.billData.billToshow.name = 'COMANDĂ'
        this.clientMode = true
      }

      this.disableBrakeButton()
      if(this.billData.billToshow && this.billData.billToshow.clientInfo.name.length){
        this.client = this.billData.billToshow.clientInfo
        this.clientMode = false
      }
     if(this.billData.billToshow){
      this.calcBillDiscount(this.billData.billToshow)
      this.hideAllBils(this.table)
      this.billData.billToshow.show = true
      this.webRTC.sendProductData(JSON.stringify(this.billData.billToshow))
       this.billData.billProducts = [...this.billData.billToshow.products]
     } else {
      this.billData.billProducts = []
     }
     this.data.tableNumber = this.tableNumber
     this.data.billIndex = this.billIndex
     this.billData.tableNumber = this.tableNumber
     this.billData.billIndex = this.billIndex
     this.billDataSubject.next(this.billData)
    //  this.tableSrv.sendBill(this.billData.billToshow)
    }
    })
  }

  getUser(){
  this.userSub = this.authSrv.user$.subscribe(response => {
    if(response){
      this.user = response
    }
  })
  }


  //*******************MENU NAVIGATION********************************* */

  goBack(){
    if(this.data.showCats){
      this.data.showCats = false;
      this.data.showMainCats = true;
      this.data.showProd = false;
    } else if(this.data.showProd){
      this.data.showProd = false;
      this.data.showCats = true;
      this.data.showMainCats = false;
    }
  }

  home(){
    this.data.showCats = false;
    this.data.showMainCats = true;
    this.data.showProd = false
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
    this.data.billIndex = orderIndex
    this.hideAllBils(this.billData.table)
    this.billData.billToshow = this.billData.table.bills[orderIndex]
    if(this.billData.billToshow){
      this.client = this.billData.billToshow.clientInfo.name.length ? this.billData.billToshow.clientInfo : null
      this.billData.billProducts = [...this.billData.billToshow.products]
      this.billData.billToshow.show = true
      this.calcBillDiscount(this.billData.billToshow)
    }
    this.billData.billIndex = orderIndex
    this.billIndex = orderIndex
    if(this.billData.billToshow && this.billData.billToshow.payOnline){
      this.billData.billToshow.payment.online = this.billData.billToshow.total
      this.billData.billToshow.total = 0
      this.billData.billToshow.payOnline = false
    }
    // this.billToshow.masaRest.index = this.tableNumber

    this.billDataSubject.next(this.billData)
    this.webRTC.sendProductData(JSON.stringify(this.billData.billToshow))
    this.disableBrakeButton()
  }

  newOrder(){
    this.tableSrv.addNewBill(this.tableNumber, 'COMANDĂ', true)
    this.disableMergeButton()
    this.showOrder(+this.table.bills.length-1)
  }

  hideAllBils(table: Table){
    table.bills.forEach(bill => {
      bill.show = false
    })
  }





//***********************************BUTTONS LOGIC************************** */

async inviteUserToTip(invite: string){
  const tipsValue = await this.actionSheet.openPayment(TipsPage, invite)
  // this.invite === 'invite' ? this.invite = 'uninvite' : this.invite = 'invite'
  if(tipsValue || tipsValue === 0){
    if(this.billData.billToshow.tips > 0){
      this.billData.billToshow.total =   this.billData.billToshow.total - this.billData.billToshow.tips
      this.billData.billToshow.tips = tipsValue
      this.billData.billToshow.total  =   this.billData.billToshow.total  + tipsValue
    } else {
      this.billData.billToshow.tips = tipsValue
      this.billData.billToshow.total =   this.billData.billToshow.total  + tipsValue
  }
} else {
  this.webRTC.inviteUserToTip('uninvite')
}
}



async addTips(){
  const tipsValue = await this.actionSheet.openPayment(TipsPage, 'uninvite')
  if(tipsValue || tipsValue === 0){
    if(this.billData.billToshow.tips > 0){
      this.billData.billToshow.total =   this.billData.billToshow.total - this.billData.billToshow.tips
      this.billData.billToshow.tips = tipsValue
      this.billData.billToshow.total  =   this.billData.billToshow.total  + tipsValue
    } else {
      this.billData.billToshow.tips = tipsValue
      this.billData.billToshow.total =   this.billData.billToshow.total  + tipsValue
  }

}
}


sendOrder(out: boolean, outside: boolean): Observable<boolean> {
  console.log('before orders',this.clientMode)
  if (this.billData.billToshow) {
    this.billData.billToshow.out = outside
    this.disableOrderButton = true;
    this.billData.billToshow._id.length
      ? (this.billId = this.billData.billToshow._id)
      : (this.billId = 'new');
    const tableIndex = this.tableNumber;
    this.billData.billToshow.locatie = this.user.locatie;
    this.calcBillDiscount(this.billData.billToshow);
    if(this.billData.billToshow.inOrOut && this.billData.billToshow.inOrOut !== ''){
      return this.tableSrv.saveOrder(
        tableIndex,
        this.billId,
        this.billIndex,
        this.user.employee,
        this.billData.billToshow.inOrOut,
        outside
      ).pipe(
        map((res) => {
          console.log('after orders',this.clientMode)
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
          this.billData.billToshow.inOrOut = response.inOrOut
          return this.tableSrv.saveOrder(
            tableIndex,
            this.billId,
            this.billIndex,
            this.user.employee,
            this.billData.billToshow.inOrOut,
            outside
          ).pipe(
            map((res) => {
              console.log('after orders',this.clientMode)
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


updateProductsQuantity(products: any[]){
  products.forEach(prod => {
    this.contSrv.editProductQuantity(prod._id, prod.quantity, prod.name)
  })
}


async payment(){
      this.sendOrder(false, true).subscribe(async (response) => {
        if(response){
          const paymentInfo = await this.actionSheet.openPayment(PaymentPage, this.billData.billToshow)
            if(paymentInfo){
              this.disableOrderButton = true;
              this.billData.billToshow.payment = paymentInfo
              this.billData.billToshow.cif = paymentInfo.cif;
              this.tabSub = this.tableSrv.sendBillToPrint(this.billData.billToshow).subscribe({
                next: (response => {
                  if(response && response.bill.status === 'done'){
                    // this.tableSrv.removeBill(this.tableNumber, this.billIndex)
                    this.billData.billToshow = emptyBill()
                    this.client = null
                    this.router.navigateByUrl("/tabs/tables")
                    this.disableOrderButton = false;
                    this.tableSrv.saveBillToCloud(response.bill)
                    showToast(this.toastCtrl, response.message, 3000)
                  }
                }),
                error: (error => {
                  if(error){
                    showToast(this.toastCtrl, error.error.message, 3000)
                    console.log(error)
                  }
                }),
                complete: () => console.log('complete')
          })
        }
        }
      })
  }

async addCustomer(clientMode: boolean){
    if(clientMode){
      const clientInfo = await this.actionSheet.openPayment(CustomerCheckPage, '')
      if(clientInfo && clientInfo.message === "client"){
        this.client = clientInfo.data
        this.clientMode = false

        this.billData.billToshow.clientInfo = this.client
        this.billData.billToshow.name = this.client.name
        this.calcBillDiscount(this.billData.billToshow);
        this.tableSrv.addCustomer(this.client, this.tableNumber, this.billIndex)
      }
      if( clientInfo && clientInfo.message === "voucher"){
        this.billData.billToshow.voucher = clientInfo.data
        if(this.billData.billToshow.total < this.billData.billToshow.voucher){
          this.billData.billToshow.voucher = this.billData.billToshow.total
        }
        this.billData.billToshow.total = this.billData.billToshow.total - this.billData.billToshow.voucher
        this.clientMode = false
      }
      this.billDataSubject.next(this.billData)
    } else {
        this.billData.billToshow.total = this.billData.billToshow.total + this.billData.billToshow.cashBack
        this.billData.billToshow.cashBack = 0
        this.cashBackMode = true
      if(this.billData.billToshow){
        this.billData.billToshow.products.forEach(el => {
          el.discount = 0
        })
        this.billData.billToshow.total = round(this.billData.billToshow.total + this.billData.billToshow.discount);
        this.billData.billToshow.discount = 0
        this.billData.billToshow._id.length ? this.billId = this.billData.billToshow._id : this.billId = 'new';
      }
      this.billDataSubject.next(this.billData)
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
  if(this.discountValue !== this.billData.billToshow.discount) {
    if(this.discountValue > this.billData.billToshow.discount){
      const dif = this.discountValue - this.billData.billToshow.discount
      this.billData.billToshow.total = round(this.billData.billToshow.total - dif)
      this.billData.billToshow.discount = this.discountValue
    } else {
      const dif = this.billData.billToshow.discount - this.discountValue
      this.billData.billToshow.total = round(this.billData.billToshow.total + dif)
      this.billData.billToshow.discount = this.discountValue
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

calcProductTotal(products: BillProduct[]){
  let total = 0
  products.forEach(el => {
      total += +el.total
  })
  return total
}


async addDiscount(){
  let dataToSend: any = []
  this.allCats.forEach(cat => {
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

async useCashBack(mode: boolean){
  if(mode){
    const data = { cashBack: this.client.cashBack, total: this.billData.billToshow.total}
    const cashBackValue = await this.actionSheet.openPayment(CashbackPage, data)
    if(cashBackValue){
      this.workCashBack = cashBackValue
      this.billData.billToshow.cashBack = cashBackValue;
      this.billData.billToshow.total  = round(this.billData.billToshow.total - cashBackValue)
      this.cashBackMode = false
      this.billData.billToshow.clientInfo.cashBack = round(this.billData.billToshow.clientInfo.cashBack - cashBackValue)
      this.billDataSubject.next(this.billData)
      this.tableSrv.sendBill(this.billData.billToshow)
    }
  }else {
    this.billData.billToshow.total = round(this.billData.billToshow.cashBack + this.billData.billToshow.total)
    this.cashBackMode = true
    this.billData.billToshow.cashBack = 0
    if(this.workCashBack > 0){
      this.billData.billToshow.clientInfo.cashBack = round(this.billData.billToshow.clientInfo.cashBack + this.workCashBack)
      this.billDataSubject.next(this.billData)
    }
    this.billDataSubject.next(this.billData)
    this.tableSrv.sendBill(this.billData.billToshow)
  }
}


  async deleteOrder(){
    let data = []
    if(this.billData.billToshow._id !== 'new'){
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
          if(this.billData.billProducts.length){
            this.billData.billProducts.forEach((el: BillProduct) => {
            let delProd: deletetBillProduct = emptyDeletetBillProduct()
            const buc = el.quantity;
            delProd.billProduct = el
            delProd.reason = reason;
            delProd.employee = this.user.employee
            delProd.locatie = this.user.locatie
            delProd.billProduct.quantity = buc
            delProd.billProduct.total = buc * delProd.billProduct.price
            choise.upload ? delProd.inv = 'in' : delProd.inv = 'out'

            this.tableSub = this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
              if(!choise.upload){
                const operation = {name: reason, details: el.name}
                if(el.toppings.length){
                this.tableSub =  this.tableSrv.unloadIngs(el.toppings, buc, operation, this.user.locatie).subscribe()
                }
                this.tableSub = this.tableSrv.unloadIngs(el.ings, buc, operation, this.user.locatie).subscribe(response => {
                  if(response) {
                    showToast(this.toastCtrl, response.message, 3000)
                  }
                })
              }
            })
          })
          }
        } else {
          showToast(this.toastCtrl, 'Trebuie să dai un motiv pentri care vrei să ștergi produsul!', 3000)
          return
        }

          data.push({id: this.billData.billToshow.soketId})
          console.log(data)
          this.tableSrv.removeBill(this.tableNumber, this.billIndex)
          this.tableSub = this.tableSrv.deleteOrders(data).subscribe()
          this.billData.billProducts = []
          this.client = null
          this.clientMode = true
          this.billData.billToshow = emptyBill()
        }
        if(this.table.bills.length){
          this.showOrder(this.table.bills.length -1)
          }
        this.billDataSubject.next(this.billData)
    } else {
      this.tableSrv.removeBill(this.tableNumber, this.billIndex)
      this.billData.billProducts = []
      this.billDataSubject.next(this.billData)

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
       id.push(el.soketId)
       billIndex.push(i)
      })
      let options = name.map((val, index) =>({name: val, data: {id: id[index], billIndex: billIndex[index]}}))
      const orders = await this.actionSheet.mergeOreders(options)
      if(orders){
        this.disableOrderButton = true
        const response = await this.tableSrv.mergeBills(this.tableNumber, orders, this.user.employee, this.user.locatie)
        if(response) {
          setTimeout(() => {
            this.tableSub = this.tableSrv.deleteOrders(orders).subscribe()
            let index = bills.findIndex(obj => obj.name === 'UNITE')
            this.showOrder(index)
            this.disableOrderButton = false
          }, 1000)
        }
      }
    }
  }

  breakOrder(){
    this.billData.breakMode = !this.billData.breakMode
    this.billDataSubject.next(this.billData)

  }

  //**********************************DISABLE// ENAMEBLE BUTTONS************************ */
  disableBrakeButton(){
    if(this.billData.billToshow && this.billData.billToshow.products){
      if(this.billData.billToshow.products.length){
        this.billData.billToshow.products.forEach((el,i) => {
          if(el.quantity > 1 && !el.sentToPrint || i > 0 && !el.sentToPrint) {
            this.disableAction = false
          } else {
            this.disableAction = true
          }
        })
        this.billDataSubject.next(this.billData)
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


arraysAreEqual = (arr1: {}[], arr2: {}[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

roundInHtml(num: number){
  return round(num)
}
}









// incommingOrders(){
//  this.tableSub = this.tableSrv.getOrderMessage(this.user.locatie, this.user._id).subscribe(response => {
//     if(response){
//       const data = JSON.parse(response.data)
//       if(data.message === 'New Order'){
//         this.order = data.doc
//         if (!this.audio.isCurrentlyPlaying()) {
//           this.audio.play();
//         }
//         this.onlineOrder = true
//         this.colorToggleInterval = setInterval(() => {
//           this.dynamicColorChange = !this.dynamicColorChange;
//         }, 500);
//       }
//     }
//    })
//   }

  // stopDynamicHeader() {
  //   clearInterval(this.colorToggleInterval);
  //   this.dynamicColorChange = false;
  // }

  // async acceptOrder(){
  //   // this.audio.stop()
  //   this.onlineOrder = false
  //   this.stopDynamicHeader()
  //   const result = await this.actionSheet.openPayment(OrderAppViewPage, this.order)
  //   if(result){
  //     const time = +result * 60 * 1000
  //     this.tableSub = this.tableSrv.setOrderTime(this.order._id, time).subscribe(response => {
  //       console.log(response)
  //     })
  //   }
  // }


// ***********************INCOMMING ORDERS*********************
