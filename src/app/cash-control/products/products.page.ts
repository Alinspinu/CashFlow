import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, } from '@ionic/angular';
import {  BillProduct } from 'src/app/models/table.model';
import { getProducts, section } from '../cash-control-engine';
import { modifyImageURL } from 'src/app/shared/utils/functions';

import { HeaderPage } from '../header/header.page';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderPage]
})
export class ProductsPage implements OnInit{

  products: BillProduct[] = []
  allProducts: BillProduct[] = []
  openProducts: BillProduct[] = []
  sections: section[] = []
  productSearch!: string

  headeLabel: string = 'Încasat'




  constructor(
  ) { }

  ngOnInit() {
  }



    reciveData(ev: any){
      const data = ev
      const parsedData = getProducts(data.orders)
      this.products = parsedData.products
      this.allProducts = parsedData.products
      this.sections = parsedData.sections
      this.openProducts = parsedData.openProducts
      this.headeLabel = 'Încasat'
    }




  searchProduct(ev: any){
    this.productSearch = ev.target.value;
    this.products = this.allProducts.filter(p => p.name.toLowerCase().includes(this.productSearch.toLowerCase()));
  }



  selectProducts(section: string){
    if(section === 'Deschise'){
      this.products = this.openProducts
      this.headeLabel = "Potențial"
    } else {
      this.products = this.allProducts.filter(p => p.section === section)
      this.headeLabel = 'Încasat'
    }

  }


modifyImage(url: string){
  return modifyImageURL(url)
}

}
