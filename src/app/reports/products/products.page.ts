import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { formatedDateToShow, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { ProductsService } from 'src/app/office/products/products.service';
import { ContentService } from 'src/app/content/content.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/category.model';
import User from 'src/app/auth/user.model';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { ReportsService } from '../reports.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class ProductsPage implements OnInit {

  startDay!: string | undefined
  endDay!: string | undefined
  day!: string | undefined


  products: BillProduct[] = []

  productSearch!: string
  user!: User

  bills!: Bill[]


  showProducts: boolean = false
  isLoading: boolean = false


  constructor(
   private reportsSrv: ReportsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getuser()
  }


getuser(){
  getUserFromLocalStorage().then(user => {
    if(user) {
      this.user = user
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}

searchProduct(ev: any){

}

async pickStartDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.startDay = formatedDateToShow(result).split('ora')[0]
  }
}

async pickEndDay(){
  const result = await this.actionSrv.openAuth(DatePickerPage)
  if(result){
    this.endDay = formatedDateToShow(result).split('ora')[0]
  }
  this.checkDtes(this.startDay, this.endDay) ? this.getBills() : this.dateErr()
}

checkDtes(start: string | undefined, end: string | undefined){
  if(start && end) {
    const startDate = new Date(start).getTime()
    const endDate = new Date(end).getTime()
    return startDate <= endDate ? true : false
  }
  return
}

dateErr(){
  showToast(this.toastCtrl, 'DATA DE ÎNCEPUT TREBUIE SĂ FIE MAI NICĂ DECÂT CEA DE SFÂRȘIT!', 3000, 'error-toast')
  this.startDay  = ''
  this.endDay = ''
}

search(){

}



getBills(){
  this.isLoading = true
 this.reportsSrv.getOrders(this.startDay, this.endDay, undefined, this.user.locatie).subscribe(response => {
  if(response){
    this.bills = response.orders
    this.getBillProducts()
    this.products.forEach(product => {
      if(product.toppings.length){
        console.log(product)
      }
    })
    // console.log(this.products)
    this.showProducts = true
    this.isLoading = false
  }
 })
}


getBillProducts(){
  this.bills.forEach(bill => {
    bill.products.forEach(product => {
      const existingProduct = this.products.find(p => p.name === product.name && this.arraysAreEqual(p.toppings, product.toppings))
      if(existingProduct){
        existingProduct.quantity += product.quantity
      } else {
        this.products.push(product)
      }
    })
  })
}






 arraysAreEqual(arr1: any[], arr2: any[]): boolean {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
      return false;
  }

  // Sort the arrays to ensure consistent ordering for comparison
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Iterate over each element and compare
  for (let i = 0; i < sortedArr1.length; i++) {
      // Compare each object in the arrays
      const obj1 = sortedArr1[i];
      const obj2 = sortedArr2[i];

      // Check if the objects are not equal
      if (!this.objectsAreEqual(obj1, obj2)) {
          return false;
      }
  }

  // If all objects are equal, return true
  return true;
}

objectsAreEqual(obj1: any, obj2: any): boolean {
  // Convert objects to JSON strings and compare
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}





}
