import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ContentService } from 'src/app/content/content.service';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CategoryPage } from '../CRUD/category/category.page';
import { getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, CapitalizePipe, FormsModule]
})
export class ProductsPage implements OnInit {

  productSearch: any
  recipeIcon: string = ''
  categories: any = []
  mainCats: any = []
  categoriesToShow: any = []
  filter: any = {
    mainCat: '',
    cat: ''
  }
  user!: User

  showSubProducts: boolean = false
  products: Product[] = []

  constructor(
    @Inject(ProductsService) private productsSrv: ProductsService,
    @Inject(ContentService) private contentSrv: ContentService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getCategories()
    this.getuser()
  }

getuser(){
  getUserFromLocalStorage().then(user => {
    if(user) {
      this.user = user
      this.getProducts()
    } else {
      this.router.navigateByUrl('/auth')
    }
  })
}


  searchProduct(ev: any){
    this.productsSrv.getProducts(this.filter, ev.detail.value, this.user.locatie).subscribe(response => {
      this.products = response
    });
  }

  productStatus(ev: any, id: string, index: number){
  let status
  const isCheked = ev.detail.checked
    if(isCheked) {
      status = "activate"
    } else {
      status = "deactivated"
    }
    this.productsSrv.changeProductStatus(status, id).subscribe(response => {
      if(response){
        const product = this.products[index]
        if(product){
          product.available = response.available
          showToast(this.toastCtrl, `Produsul a fost ${isCheked? 'Activat' : 'Dezactivat'}`, 2000, 'success-toast')
        } else {
          showToast(this.toastCtrl, `Produst nu a fost gasit! REFRESH!`,2000, 'error-toast')
        }
      }
    })
  }

  subStatus(ev: any, id: string, subIndex: number, prodIndex: number){
    let status
    const isCheked = ev.detail.checked
      if(isCheked) {
        status = "activate"
      } else {
        status = "deactivated"
      }
      this.productsSrv.changeProductStatus(status, id).subscribe(response => {
        if(response) {
          const subProduct = this.products[prodIndex].subProducts[subIndex]
          if(subProduct){
            subProduct.available = response.available
            showToast(this.toastCtrl, `Produsul a fost ${isCheked? 'Activat' : 'Dezactivat'}`, 2000, 'success-toast')
          } else {
            showToast(this.toastCtrl, `Produst nu a fost gasit! REFRESH!`,2000, 'error-toast')
          }
        }
      })
  }


  addProduct(){
    this.router.navigate([`tabs/add-product/1`])
  }

  productEdit(id: string){
      this.router.navigate([`tabs/add-product/${id}`])
  }

  showSubs(index: number){
    const product = this.products[index]
      product.showSub = !product.showSub
  }


  onSelectMainCat(ev: CustomEvent){
    const selectedMainCat = ev.detail.value;
    this.categoriesToShow =  this.categories.filter((cat: any) => cat.mainCat === selectedMainCat);
    this.filter.mainCat = selectedMainCat;
    this.filter.cat = ''
    this.getProducts();
  }

  onCatSelect(ev: CustomEvent){
    const selectedCat = ev.detail.value;
    this.filter.cat = selectedCat;
    this.getProducts();
  }

  getCategories(){
    this.categories = this.contentSrv.categoriesNameId$;
    this.categoriesToShow = this.categories;
    this.setMainCats(this.categories);
    }

    setMainCats(cats: any[]){
     const uniqueKeys = [...new Set(cats.map(obj => obj.mainCat))];
     this.mainCats = uniqueKeys.map(name => ({ name }));
    }

    getProducts(){
      console.log(this.filter)
      this.productsSrv.getProducts(this.filter, '', this.user.locatie).subscribe(response => {
        this.products = response

      });
    }

   async addCat(){
     const response = await this.actionSrv.openModal(CategoryPage, null, false)
     if(response){
       this.productsSrv.saveCat(response, this.user.locatie).subscribe(response => {
        console.log(response)
       })
     }

    }

    calcProductionPrice(product: any){
      let total = 0
      if(product.ings.length){
        product.ings.forEach((el:any) => {
          total = round(total + (el.qty * el.ing.price))
        }
        )
      }
      return total
    }

    calcComercialSurplus(product: any){
      const productionPrice = this.calcProductionPrice(product)
      if(productionPrice > 0){
        const procentSurplus =  (( product.price - productionPrice ) / productionPrice ) * 100
        return  round(procentSurplus) + "%"
      } else {
        return 'Infint %'
      }
    }

}

