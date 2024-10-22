import { Component, Inject, OnInit, OnDestroy, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, IonContent } from '@ionic/angular';
import { TablesService } from '../../../tables/tables.service';
import { AuthService } from '../../../auth/auth.service';
import { ActionSheetService } from '../../../shared/action-sheet.service';
import { BillProduct, Topping, Bill, deletetBillProduct, Table } from '../../../models/table.model';
import { PickOptionPage } from 'src/app/modals/pick-option/pick-option.page';
import { round } from '../../../shared/utils/functions';
import { emptyDeletetBillProduct, emptyBill, emptyTable } from '../../../models/empty-models';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { Subscription, Observable, map, switchMap, of, Subject } from 'rxjs';
import User from '../../../auth/user.model';
import { Router } from '@angular/router';

interface billData{
  billProducts: BillProduct[],
  billToshow: Bill,
  breakMode: boolean,
  tableNumber: number,
  billIndex: number,
  table: Table
}


@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BillPage implements OnInit, OnDestroy {

  billData!: billData


  @Input() billData$!: Observable<billData>

  private billSub!: Subscription;


  @ViewChild('billContent') content!: IonContent;


  billIndex!: number;
  billId!: string;

  tableNumber!: number;

  tableSub!: Subscription
  userSub!: Subscription
  sendOrderSub!: Subscription

  user!: User
  client!: any
  table!: Table



  showZeroTips: boolean = false

  constructor(
    private tableSrv: TablesService,
    private authSrv: AuthService,
    private toastCtrl: ToastController,
    private router: Router,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService
  ) { }

  ngOnInit() {
    this.getUser()
    this.billSub = this.billData$.subscribe(billData => {
      if(billData){
        this.billData = billData
        if(this.billData.billProducts.length > 5){
          setTimeout(()=>{
            this.content.scrollToBottom(300);
          }, 200)
        }
      }
    })
  }


  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
    if(this.tableSub){
      this.tableSub.unsubscribe()
    }
    if(this.billSub){
      this.billSub.unsubscribe()
    }
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response){
        this.user = response;
      }
    })
  }


  addDisc(index: number) {
    const product =  this.billData.billToshow.products[index]
    product.discount = product.total
    this.billData.billToshow.discount = this.billData.billToshow.discount + product.discount
    this.billData.billToshow.total = this.billData.billToshow.total - product.discount
  }



  async break(index: number){
    const product =  this.billData.billToshow.products[index]
    let qty: number[] = []
    for(let i=1; i<=product.quantity; i++){
      qty.push(i)
    }
    const qtyChioise = await this.actionSheet.breakBillProduct(qty)
    if(qtyChioise){
      this.tableSrv.addNewBill(this.billData.tableNumber, 'COMANDA SEPARATA', false)
      const oldBillIndex = this.tableSrv.getBillIndex(this.billData.tableNumber-1, this.billData.billToshow._id)
      const bills = this.billData.table.bills;
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
          printOut: product.printOut
        };
        if(newBillIndex){
          for(let i=0; i<qtyChioise; i++){
            this.tableSrv.addToBill(cartProduct,this.billData.tableNumber, newBillIndex, this.user.name)
            this.tableSrv.redOneProg(this.billData.tableNumber, index, this.billData.billIndex)
          }
          // this.showOrder(newBillIndex);
          // this.disableOrderButton = true
          const response = await this.tableSrv.manageSplitBills(this.billData.tableNumber, oldBillIndex, this.user.employee, true)
          if(response){
            // this.disableOrderButton = false
          }
          // this.disableOrderButton = true
         const resp = await this.tableSrv.manageSplitBills(this.billData.tableNumber, newBillIndex, this.user.employee, false)
         if(response){
          // this.disableOrderButton = false
         }
        } else {
          this.tableSrv.removeBill(this.billData.tableNumber, -1)
        }
      }
    }
  }



  addProd(billProIndex: number){
    this.tableSrv.addOne(this.billData.tableNumber, billProIndex, this.billData.billIndex)
  }

  redProd(billProIndex: number){
    this.tableSrv.redOne(this.billData.tableNumber, billProIndex, this.billData.billIndex)
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
               this.billData.billToshow.total += (optionPrice * product.quantity)
               this.tableSrv.addTopping(this.billData.tableNumber, index, this.billData.billIndex, product)
            }
            if(extra && extra.comment){
              this.tableSrv.addComment(this.billData.tableNumber, index, this.billData.billIndex, extra.comment)
            }
            if(extra && extra.qty){
              this.tableSrv.addQty(this.billData.tableNumber, index, this.billData.billIndex, extra.qty)
            }
        }
    }
    }


  async openDeleteAlert(qty: number, index: number, ings: any, product: BillProduct){
    let numberArr: string [] = []
    let delProd: deletetBillProduct  = emptyDeletetBillProduct()
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
            this.tableSrv.redOneProg(this.billData.tableNumber, index, this.billData.billIndex)
            // this.disableBrakeButton()
          }
          delProd.billProduct = product
          delProd.reason = reason;
          delProd.admin = admin
          delProd.employee = this.user.employee
          delProd.locatie = this.user.locatie
          delProd.billProduct.quantity = buc
          delProd.billProduct.total = buc * delProd.billProduct.price
          result.upload ? delProd.inv = 'in' : delProd.inv = 'out'
         this.tableSub = this.tableSrv.registerDeletetProduct(delProd).subscribe(response=> {
            if(!result.upload){
              const operation = {name: reason, details: product.name}
              if(product.toppings.length){
               this.tableSub = this.tableSrv.unloadIngs(product.toppings, buc, operation, this.user.locatie).subscribe()
              }
              this.tableSub = this.tableSrv.unloadIngs(ings, buc, operation, this.user.locatie).subscribe(response => {
                if(response) {
                  showToast(this.toastCtrl, response.message, 4000)
                }
              })
            }
          })

      } else {
        showToast(this.toastCtrl, 'Trebuie să dai un motiv pentru care vrei să ștergi produsul!', 3000)
      }
     this.sendOrderSub = this.sendOrder(false, false).subscribe()

    }
  }


  sendOrder(out: boolean, outside: boolean): Observable<boolean> {
    if (this.billData.billToshow) {
      this.billData.billToshow.out = outside
      // this.disableOrderButton = true;
      this.billData.billToshow._id.length
        ? (this.billId = this.billData.billToshow._id)
        : (this.billId = 'new');
      const tableIndex = this.billData.tableNumber;
      this.billData.billToshow.locatie = this.user.locatie;
      this.calcBillDiscount(this.billData.billToshow);
      if(this.billData.billToshow.inOrOut && this.billData.billToshow.inOrOut !== ''){
        return this.tableSrv.saveOrder(
          tableIndex,
          this.billId,
          this.billData.billIndex,
          this.user.employee,
          this.billData.billToshow.inOrOut,
          outside
        ).pipe(
          map((res) => {
            // this.disableOrderButton = false;
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
              this.billData.billIndex,
              this.user.employee,
              this.billData.billToshow.inOrOut,
              outside
            ).pipe(
              map((res) => {
                // this.disableOrderButton = false;
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
}
