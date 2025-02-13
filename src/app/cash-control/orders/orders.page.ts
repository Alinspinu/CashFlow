import { Component,  Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { Bill, deletetBillProduct } from 'src/app/models/table.model';
import { CashControlService } from '../cash-control.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Subscription } from 'rxjs';
import { formatOrderDate, formatOrderDateOne, round } from 'src/app/shared/utils/functions';
import { OrderAppViewPage } from 'src/app/modals/order-app-view/order-app-view.page';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { DelProdViewPage } from 'src/app/reports/cash/del-prod-view/del-prod-view.page';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { HeaderPage } from '../header/header.page';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderPage]
})
export class OrdersPage implements OnInit, OnDestroy {

  productSearch!: string


    orders: Bill[] = []
    allOrders: Bill[] = []

    isLoading: boolean = true

    delProducts: deletetBillProduct[] = []

    ordersDone: Bill[] = []
    ordersOpen: Bill[] = []
    discountOrders: Bill[] = []
    onlineOrders: Bill[] = []

    user!: any
    users: {name: string, id: string, show: boolean}[] = []

    userSub!: Subscription
    menuOpen: boolean = false

  constructor(
        private cashSrv: CashControlService,
        private toastCtrl: ToastController,
        private authSrv: AuthService,
        @Inject(ActionSheetService) private actionSheet: ActionSheetService,
        @Inject(MenuController) private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
    this.getUser()
  }

  ngOnDestroy(): void {
    if(this.userSub){
      this.userSub.unsubscribe()
    }
  }


  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['data']) {
  //     this.updateData(this.data.orders);
  //     this.orders = this.data.orders
  //     this.delProducts = this.data.delProd
  //   }
  // }


  reciveData(ev: any){
    this.updateData(ev.orders);
    this.delProducts = ev.delProd
  }


  getUser(){
    this.userSub = this.authSrv.user$.subscribe(response => {
      if(response) {
        this.user = response
      }
    })
   }



   updateData(orders: Bill[]){
    this.resetOrders()
    orders.forEach(order => {
      if(order.status === 'done'){
        if(order.payment.card) order.paymentMethod = 'Card'
        if(order.payment.cash) order.paymentMethod = 'Cash'
        if(order.payment.online) order.paymentMethod = 'Online'
        if(order.payment.viva) order.paymentMethod = 'Viva'
        if(order.payment.voucher) order.paymentMethod = 'Voucher'
        this.ordersDone.push(order)
      }
      if(order.status === 'open'){
        this.ordersOpen.push(order)
      }
      if(order.discount > 0){
        this.discountOrders.push(order)
      }
      if(order.onlineOrder){
        this.onlineOrders.push(order)
      }
      })
      this.orders = orders
      this.allOrders = orders
   }




  searchProduct(ev: any){
    this.productSearch = ev.target.value;
    this.orders = this.allOrders.filter(parentItem =>
      parentItem.products.some(child =>
        child.name.toLowerCase().includes(this.productSearch.toLowerCase())
      )
    );
  }

  selectOrders(orders: Bill[]){
    this.orders = orders
  }




resetOrders(){
  this.ordersDone = []
  this.ordersOpen = []
  this.discountOrders = []
  this.onlineOrders = []
}



  openDelProducts(products: deletetBillProduct[]){
    let prod: deletetBillProduct[] = []
    let total: number = 0
    for(let product of products){
      const clonedProduct = JSON.parse(JSON.stringify(product));
      // const prd = prod.find(p => p.billProduct.name === product.billProduct.name)
      // if(prd){
      //   prd.billProduct.quantity += clonedProduct.billProduct.quantity
      //   prd.billProduct.total = round(+prd.billProduct.total + +clonedProduct.billProduct.total)
      // } else {
      //   prod.push(clonedProduct)
      // }
      prod.push(clonedProduct)
      total = round(total + +product.billProduct.total)
    }
    // prod.sort((a,b) => b.billProduct.quantity - a.billProduct.quantity)
    prod.sort((a,b) => a.billProduct.name.localeCompare(b.billProduct.name))
   this.actionSheet.openPayment(DelProdViewPage, {products: prod, total: total})
 }



  async openBill(bill: Bill){
    const result = await this.actionSheet.openPayment(OrderAppViewPage, bill)
    if( result && result.message === 'changePayment'){
      this.cashSrv.changePaymnetMethod(result.order).subscribe(response => {
        if(response) {
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, error => {
        if(error) {
          console.log(error )
          showToast(this.toastCtrl, error.message, 3000)
        }
      })
    }
     if(result && result.message === "fiscal") {
        this.isLoading = true
        this.cashSrv.reprintBill(result.order).subscribe(response => {
          if(response) {
            this.isLoading = false
            showToast(this.toastCtrl, response.message, 3000)
          }
        }, error => {
          if(error) {
            this.isLoading = false
            if(error.error && error.error.message === "timeout of 5000ms exceeded"){
              showToast(this.toastCtrl, 'Nu se poate realiza conexiunea cu inprimanta!', 3000)
            } else {
              showToast(this.toastCtrl, error.error.message, 3000)
            }
          }
        })
     }
     if(result && result.message === "nefiscal"){
      const order = JSON.stringify(result.order)
      this.isLoading = true
      this.cashSrv.printNefiscal(order).subscribe(response => {
        if(response) {
          this.isLoading = false
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, error => {
        if(error) {
          this.isLoading = false
          if(error.error && error.error.message === "timeout of 5000ms exceeded"){
            showToast(this.toastCtrl, 'Nu se poate realiza conexiunea cu inprimanta!', 3000)
          } else {
            showToast(this.toastCtrl, error.error.message, 3000)
          }
        }
      })
     }
     if(result && result.message === "bill"){
      this.cashSrv.createInvoice(result.orderId, this.user._id, result.clientId, this.user.locatie).subscribe(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
      })
     }
  }




  formatDate(date: any){
    return formatOrderDate(date)
  }

  calcOrdersTotal(orders: Bill[]){
    let total = 0
    orders.forEach(order => {
      total += order.total
    })
    return round(total)
  }

  calcOrdersDiscount(orders: Bill[]){
    let disc = 0
    orders.forEach(order => {
      disc += order.discount
    })
    return round(disc)
  }

  calcDelProdTotal(products: deletetBillProduct[]){
    let total = 0
    products.forEach(product => {
      total += +product.billProduct.total
    })
    return round(total)
  }



}
