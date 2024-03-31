import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { AddProductDiscountService } from './add-product-discount.service';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions';
import User from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ProductsService } from 'src/app/office/products/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-product-discount',
  templateUrl: './add-product-discount.page.html',
  styleUrls: ['./add-product-discount.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddProductDiscountPage implements OnInit {

productSearch: string = ''
products: any [] = []
discountsProd: any [] = []
deletedDiscounts: any [] = []
user!: User
dbProducts: any [] = []

prodSub!: Subscription

  constructor(
    @Inject(ActionSheetService) private actioSrv: ActionSheetService,
    private modalCtrl: ModalController,
    private addProdDiscSrv: AddProductDiscountService ,
    private router: Router,
    private productService: ProductsService,
    private navPar: NavParams,
  ) { }

  ngOnInit() {
    this.getUser()
    this.getProducts()
    this.getData()
  }


  getData(){
    const data = this.navPar.get('options');
    if(data){
      this.discountsProd = data
    }

  }


  async selectProduct(prod: any){
    this.productSearch = ''
    this.products = []
    const qty = await this.actioSrv.pickDiscountValue()
    if(qty){
     const discountProd = {
       precent: +qty.discount,
       productId: prod._id,
       name: prod.name,
     }
     this.discountsProd.push(discountProd)
    }
   }


  deleteDiscount(index: number){
    this.deletedDiscounts.push(this.discountsProd[index])
    this.discountsProd.splice(index, 1)

  }
  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user) {
        this.user = user
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }

  // searchProduct(ev: any){
  //   let search = ev.detail.value
  //     this.addProdDiscSrv.searchProduct(search, {}, this.user.locatie).subscribe((response:any) => {
  //       if(response) {
  //         this.products= response
  //       }
  //     })
  // }

  getProducts(){
    this.prodSub = this.productService.productsSend$.subscribe(response => {
      if(response){
        this.dbProducts = response

      }
    })
  }

  searchProduct(ev: any){
    const input = ev.detail.value
    this.products = this.dbProducts.filter(product => product.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
    if(input === ''){
     this.products = [...this.dbProducts]
    }
   }

  onSubmit(){
    if(this.deletedDiscounts.length) {
      this.deletedDiscounts.forEach(el => el.precent = 0)
      this.modalCtrl.dismiss(this.deletedDiscounts)
    } else {
      this.modalCtrl.dismiss(this.discountsProd)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

}
