import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ContentService } from 'src/app/content/content.service';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/content/category.model';
import { ActionSheet } from '@capacitor/action-sheet';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { CategoryPage } from '../CRUD/category/category.page';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, CapitalizePipe, FormsModule]
})
export class ProductsPage implements OnInit {

  productSearch: any
  categories: any = []
  mainCats: any = []
  categoriesToShow: any = []
  filter: any = {
    mainCat: '',
    cat: ''
  }
  products: Product[] = []

  constructor(
    @Inject(ProductsService) private productsSrv: ProductsService,
    @Inject(ContentService) private contentSrv: ContentService,
    @Inject(ActionSheetService) private actionSrv: ActionSheetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCategories()
    this.getProducts()
  }

  searchProduct(ev: any){
    this.productsSrv.getProducts(this.filter, ev.detail.value).subscribe(response => {
      this.products = response
    });
  }

  addProduct(){
    this.router.navigate([`tabs/add-product/1`])
  }

  productEdit(id: string){
      this.router.navigate([`tabs/add-product/${id}`])
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
      this.productsSrv.getProducts(this.filter, '').subscribe(response => {
        this.products = response
      });
    }

   async addCat(){
     const response = await this.actionSrv.openModal(CategoryPage, null, false)
     if(response){
       this.productsSrv.saveCat(response).subscribe(response => {
        console.log(response)
       })
     }

    }

}

