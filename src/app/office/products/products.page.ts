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
import { findCommonNumber, getUserFromLocalStorage, round } from 'src/app/shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, CapitalizePipe, FormsModule, SpinnerPage]
})
export class ProductsPage implements OnInit {

  productSearch: any
  productIngSearch: any
  recipeIcon: string = ''
  categories: {name: string, _id: string, order: number, mainCat: string}[] = []
  mainCats: any = []
  categoriesToShow: any = []
  filter: any = {
    mainCat: '',
    cat: ''
  }
  user!: User

  showSubProducts: boolean = false
  products: Product[] = []
  dbProducts: Product[] = []

  isLoading: boolean = true



  inPriceColor: boolean = false
  outPriceColor: boolean = false
  recipeColor: boolean = false
  surplusColor: boolean = false
  nameColor: boolean = true

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


  printProducts(){
    const filter = {mainCat: this.filter.mainCat, category: this.filter.cat, locatie: environment.LOC, available: true}
    if(!filter.mainCat.length) delete filter.mainCat
    if(!filter.category.length) delete filter.category
    this.productsSrv.printEcel(filter).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'produse.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {

      }
    })
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
  const input = ev.detail.value
  this.products = this.products.filter(product => product.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
  if(input === ''){
   this.products = [...this.dbProducts]
  }
 }

searchIngProduct(ev: any){
  const input = ev.detail.value
  this.products = this.dbProducts.filter(parentItem =>
    parentItem.ings.some(child => {
      if(child.ing.name){
        return child.ing.name.toLowerCase().includes(input.toLowerCase())
      } else {
        console.log(parentItem)
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
    this.router.navigate([`tabs/add-product/1`])
  }

  productEdit(id: string){
      this.router.navigate([`tabs/add-product/${id}`])
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

  onSelectMainCat(ev: CustomEvent){
    this.filter.cat = ''
    this.filter.mainCat = ev.detail.value;
    this.categoriesToShow =  this.categories.filter((cat: any) => cat.mainCat === this.filter.mainCat);
    this.filterProducts()
  }

  onCatSelect(ev: CustomEvent){
    this.filter.cat = ev.detail.value;
    this.filterProducts()
  }

  filterProducts(){
    this.products = this.dbProducts
    if(this.filter.cat !== ''){
      this.products = this.products.filter(product => product.category._id === this.filter.cat)
    }
    if(this.filter.mainCat !== ''){
      this.products = this.products.filter(product => product.mainCat === this.filter.mainCat)
    }
  }

  getCategories(){
    this.categories = this.contentSrv.categoriesNameId$;
    this.categoriesToShow = this.categories;
    this.isLoading = false
    this.setMainCats(this.categories);
    }

    setMainCats(cats: any[]){
     const uniqueKeys = [...new Set(cats.map(obj => obj.mainCat))];
     this.mainCats = uniqueKeys.map(name => ({ name }));
    }

    getProducts(){
      this.productsSrv.productsSend$.subscribe(response => {
        this.dbProducts = response.filter(p => p.category)
        this.products = this.dbProducts
        if(this.dbProducts.length > 1){
            this.isLoading = false
        }
      });
    }

   async addCat(){
     const response = await this.actionSrv.openPayment(CategoryPage, null)
     if(response){
       this.productsSrv.saveCat(response, this.user.locatie).subscribe(response => {
        console.log(response)
       })
     }

    }

    async editCat(){
      const sortedCategories = this.categories.sort((a,b) => a.name.localeCompare(b.name))
      const categoryId = await this.actionSrv.chooseCategory(sortedCategories)
      if(categoryId) {
        const response = await this.actionSrv.openPayment(CategoryPage, categoryId)
        if(response){
          this.contentSrv.editCategory(response).subscribe(response => {
            if(response){
             showToast(this.toastCtrl, response.message, 2000)
            }
          })
        }
      }
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
          return  round(procentSurplus) + "%"
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



filters(option: string){
  switch (option) {
    case 'name':
      this.resetAllColors()
      this.products.sort((a,b) => a.name.localeCompare(b.name))
      this.nameColor = true;
      return;
    case 'out-price':
      this.resetAllColors()
      this.products.sort((a,b) => b.price - a.price)
      this.outPriceColor = true;
      return
    case 'in-price':
      this.resetAllColors()
      this.products.sort((a,b) => (+this.calcProductionPrice(b).split(' ')[0]) - (+this.calcProductionPrice(a).split(' ')[0]))
      this.inPriceColor = true;
      return;
    case 'recipe':
      this.resetAllColors()
      this.products.sort((a,b) => +this.showProducsAndSubsRecipe(a) - +this.showProducsAndSubsRecipe(b))
      this.recipeColor = true;
      return;
    case 'surplus':
      this.resetAllColors()
      this.products.sort((a,b) => ((b.price - +this.calcProductionPrice(b).split(' ')[0]) / +this.calcProductionPrice(b).split(' ')[0] * 100) - ((a.price -+this.calcProductionPrice(a).split(' ')[0] ) / +this.calcProductionPrice(a).split(' ')[0]* 100))
      this.surplusColor = true;
      return;
    default:
      return;
}
}


resetAllColors(){
  this.recipeColor = false
  this.inPriceColor = false
  this.outPriceColor = false
  this.surplusColor = false
  this.nameColor = false
}

}

