import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashPage } from './cash/cash.page';
import { IngredientsPage } from './ingredients/ingredients.page';
import { ProductsPage } from './products/products.page';
import { FinancePage } from './finance/finance.page';
import { CashRegisterPage } from '../office/cash-register/cash-register.page';



@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, CashPage, IngredientsPage, ProductsPage, FinancePage, CashRegisterPage],
})




export class ReportsPage {

  screenWidth!: number

  show:
  {
    menu: boolean
    sales: boolean
    products: boolean
    cashRegister: boolean
    finance: boolean
  } = {sales: true, products: false, cashRegister: false, menu: false, finance: false}

  constructor() {
    this.screenWidth = window.innerWidth
  }

  sales(){
    this.show.sales = true
    this.show.products = false
    this.show.cashRegister = false
    this.show.finance = false
  }

  products(){
    this.show.products = true
    this.show.sales = false
    this.show.cashRegister = false
    this.show.finance = false
  }

  register(){
    this.show.cashRegister = true
    this.show.products = false
    this.show.sales = false
    this.show.finance = false
  }

  finance(){
    this.show.cashRegister = false
    this.show.products = false
    this.show.sales = false
    this.show.finance = true
  }

  hideMenu(){
    this.show.menu = false
  }

  showMenu(){
    this.show.menu = true
  }
}
