import { AfterViewInit, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/category.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CategoryPage } from '../CRUD/category/category.page';
import { findCommonNumber, getUserFromLocalStorage, modifyImageURL, round } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';

import { getMaincat, mainCat } from './products.engine';
import { ProductPage } from '../CRUD/product/product.page';
import { CategoriesPage } from './categories/categories.page';
import { map, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, CapitalizePipe, CategoriesPage]
})
export class ProductsPage implements OnInit, OnChanges, OnDestroy {

  productSearch: string = ''
  productIngSearch: string = ''
  recipeIcon: string = ''
  categories: {name: string, _id: string, order: number, mainCat: string}[] = []
  mainCats: mainCat[] = []

  user!: User

  showSubProducts: boolean = false
  products: Product[] = []
  dbProducts: Product[] = []

  isLoading: boolean = true

  productSub!: Subscription

 @Input() isDarkMode: boolean = false



  inPriceColor: boolean = false
  outPriceColor: boolean = false
  recipeColor: boolean = false
  surplusColor: boolean = false
  nameColor: boolean = true

  constructor(
    @Inject(ProductsService) private productsSrv: ProductsService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getuser()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDarkMode']) {
      this.mainCats = getMaincat(this.products, this.isDarkMode)
    }
  }

  ngOnDestroy(): void {
    if(this.productSub){
      this.productSub.unsubscribe()
    }
  }




getuser(){
  this.isLoading = true
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
  const input = this.productSearch
  this.products = this.dbProducts.filter(product => product.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
  if(input === ''){
   this.products = [...this.dbProducts]
  }
 }

searchIngProduct(ev: any){
  const input = this.productIngSearch
  this.products = this.dbProducts.filter(parentItem =>
    parentItem.ings.some(child => {
      if(child.ing.name){
        return child.ing.name.toLowerCase().includes(input.toLowerCase())
      } else {
        return false
      }
    }) ||
    parentItem.subProducts.some(sub => {
      return sub.ings.some(child => {
        if (child.ing && child.ing.name) {
          return child.ing.name.toLowerCase().includes(input.toLowerCase());
        } else {
          return false;
        }
      });
    })
  );
  if(input === ''){
   this.products = [...this.dbProducts]
  }
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
          showToast(this.toastCtrl, `Produsul a fost ${isCheked? 'Activat' : 'Dezactivat'}`, 2000)
        } else {
          showToast(this.toastCtrl, `Produst nu a fost gasit! REFRESH!`,2000)
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
            showToast(this.toastCtrl, `Produsul a fost ${isCheked? 'Activat' : 'Dezactivat'}`, 2000)
          } else {
            showToast(this.toastCtrl, `Produst nu a fost gasit! REFRESH!`,2000)
          }
        }
      })
  }


  addProduct(){
    this.actionSrv.openAdd(ProductPage, {mainCats: this.mainCats} ,'add-modal')
  }

  productEdit(product: Product){
    this.actionSrv.openAdd(ProductPage, {product: product, mainCats: this.mainCats} ,'add-modal')
  }


  async deleteProduct(product: Product){
    const message = `Ești sigur ca vrei să ștergi produsul ${product.name}?`
    const title = 'ȘTERGE!'
    const result = await this.actionSrv.deleteAlert(message, title)
    if(result){
      this.productsSrv.deleteProduct(product._id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
        }
      }, (err) => {
        if(err){
          showToast(this.toastCtrl, err.error.message, 3000)
        }
      })
    }

}

  showSubs(index: number){
    const product = this.products[index]
      product.showSub = !product.showSub
  }

  filterByMain(mainCat: mainCat){
    this.products = this.dbProducts.filter(product => product.mainCat === mainCat.name)
    const activeCat = mainCat.cat.find(c => c.active === true)
    if(activeCat) this.products = this.dbProducts.filter(product => product.category.name === activeCat.name)
    if(mainCat.name === 'Toate' && !activeCat) this.products = this.dbProducts

  }

    getProducts(){
      this.productSub = this.productsSrv.productsSend$.pipe(
        map((value, index) => ({ value, index })),
        tap(({value, index}) => {
          if(index === 0){
            this.dbProducts = value.filter(p => p.category)
            this.products = this.dbProducts
            this.mainCats = getMaincat(this.products, this.isDarkMode)
            this.activateMainCat()
          }
          if(index > 0) {
           
            this.dbProducts = value.filter(p => p.category)
            this.products = this.dbProducts
            this.updateProductsBySelectedCategory()
            if(this.productIngSearch.length) this.searchIngProduct('')
            if(this.productSearch.length)this.searchProduct('')
          }
        })
      ).subscribe();
    }

    activateMainCat(){
      setTimeout(() => {
        const index = this.mainCats.findIndex(c => c.name === 'Toate')
        if(index !== -1) this.mainCats[index].active = true
      }, 2000)
    }

    updateProductsBySelectedCategory(){
      const maniCat = this.mainCats.find(c => c.active)
      if(maniCat) this.filterByMain(maniCat)
    }



    calcProductionPrice(product: any){
      if(product.subProducts && product.subProducts.length){
        let subSurplus: number[] = []
        product.subProducts.forEach((sub: any) => {
          const productionPrice =  +this.calcProductionPrice(sub).split(' ')[0]
          if(product.name == 'Catena Chardonnay Tupungato'){
          }
          if(productionPrice > 0){
            subSurplus.push(round(productionPrice))
          } else {
            subSurplus.push(0)
          }
        })

        const modeSubSurplus = findCommonNumber(subSurplus)
        return `${modeSubSurplus} Lei`
      } else {
        let total = 0
        if(product.ings.length){
          product.ings.forEach((el:any) => {
            if(el.ing){
              total = round(total + (el.qty * el.ing.price))
            } else {
              console.log(product)
            }
          }
          )
        }
        return `${total} Lei`
      }
    }

    calcComercialSurplus(product: any){
      if(product.subProducts && product.subProducts.length){
        let subSurplus: number[] = []
          product.subProducts.forEach((sub: any) => {
            const productionPrice =  +this.calcProductionPrice(sub).split(' ')[0]
            if(productionPrice> 0){
              const procentSurplus =  (( sub.price - productionPrice ) / productionPrice ) * 100
              subSurplus.push(round(procentSurplus))
            } else {
              subSurplus.push(0)
            }
          })
          const modeSubSurplus = findCommonNumber(subSurplus)
          if(modeSubSurplus && modeSubSurplus > 0){
              return '~ap ' + modeSubSurplus+ " %"
          } else {
             return 'Infint %'
          }
      } else {
        const productionPrice = +this.calcProductionPrice(product).split(' ')[0]
        if(productionPrice> 0){
          const procentSurplus =  (( product.price - productionPrice ) / productionPrice ) * 100
          return  round(procentSurplus) + " %"
        } else {
          return 'Infint %'
        }
      }
    }




showProducsAndSubsRecipe(product: Product) {
    if(product.subProducts.length){
      const noRecipe = product.subProducts.filter(sub => !sub.ings.length)
      if(noRecipe.length){
        return false
      } else {
        return true
      }
    } else if(product.ings.length){
      return true
    } else {
      return false
    }
}









// printProducts(){
//   const filter = {mainCat: this.filter.mainCat, category: this.filter.cat, locatie: environment.LOC, available: true}
//   if(!filter.mainCat.length) delete filter.mainCat
//   if(!filter.category.length) delete filter.category
//   this.productsSrv.printEcel(filter).subscribe({
//     next: (response) => {
//       const url = window.URL.createObjectURL(response);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'produse.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     },
//     error: (error) => {

//     }
//   })
// }


modifyImage(url: string){
  return modifyImageURL(url)
}

}

