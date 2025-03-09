import { Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, } from '@ionic/angular';
import {  BillProduct } from 'src/app/models/table.model';
import { modifyImageURL, round } from 'src/app/shared/utils/functions';
import { HeaderPage } from 'src/app/cash-control/header/header.page';
import { getProducts, section } from 'src/app/cash-control/cash-control-engine';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { IngredientService } from 'src/app/office/ingredient/ingredient.service';


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
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private ingredientsService: IngredientService,
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
    this.calcSectionProduction()
    console.log(this.sections)
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

calcSectionProduction(){
  this.allProducts.forEach(p => {
    this.sections.forEach(s => {
      if(p.section === s.name){
       s.production += this.production(p.toppings, p.ings, p.quantity)
       if(typeof p.quantity !== 'number'){
        console.log(p)
       }
      }
    })
  })
}


production(toppings: any[], ings: any[], qty: number){
  const igs = ings.map(i => {
    if(typeof i.qty === 'number'){
      const ing = {
        qty: i.qty,
        ing: this.ingredientsService.getIng(i.ing)
      }
      return ing
     } else{
      const ing = {
        qty: 1,
        ing: this.ingredientsService.getIng(i.ing)
      }
      return ing
     }
  })
  const topp = toppings.map(t => {
    if(typeof t.qty === 'number'){
      const topping = {
        qty: t.qty,
        ing: this.ingredientsService.getIng(t.ing)
      }
      return topping
     } else {
      const topping = {
        qty: 1,
        ing: this.ingredientsService.getIng(t.ing)
      }
      return topping
     }
  })
 return this.calcProductionValue(topp, igs, qty)
}



calcProductionValue(toppings: any[], ings: any[], qty: number ){
  let total = 0
  let toppingsTotal = 0
  for(let ing of ings){
    if(typeof ing.ing.tvaPrice !== 'number'){
      console.log(ing)
     }
    total = round(total + (ing.qty * ing.ing.tvaPrice * qty))
  }
  for(let ing of toppings){

    toppingsTotal = round(toppingsTotal + (ing.qty * ing.ing.tvaPrice))
  }
  return round(total + toppingsTotal - this.vegyDif(toppings, ings))
}

 vegyDif(toppings: any[], ings: any[] ){
    let total = 0
    const vegetal = toppings.find(t => t.ing.name === 'Lapte Vegetal')
    if(vegetal){
      const lapte = ings.find(i => i.ing.name === 'Lapte')
      if(lapte){
        total = round(vegetal.qty * lapte.ing.tvaPrice)
      }
    }
    return round(total)
  }


roundInH(num: number) {
  return round(num)
}

modifyImage(url: string){
  return modifyImageURL(url)
}

}
