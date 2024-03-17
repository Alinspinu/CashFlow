import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashPage } from './cash/cash.page';
import { IngredientsPage } from './ingredients/ingredients.page';
import { ProductsPage } from './products/products.page';



@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, CashPage, IngredientsPage, ProductsPage],
})




export class ReportsPage {


  show:
  {
    sales: boolean
    products: boolean
    ingredients: boolean
  } = {sales: true, products: false, ingredients: false}

  constructor() {}

  sales(){
    this.show.sales = true
    this.show.products = false
    this.show.ingredients = false
  }

  products(){
    this.show.products = true
    this.show.sales = false
    this.show.ingredients = false
  }

  ingredients(){
    this.show.ingredients = true
    this.show.products = false
    this.show.sales = false
  }
}
