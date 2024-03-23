import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product, SubProduct } from "src/app/models/category.model";
import { emptyProduct } from "src/app/models/empty-models";
import {environment} from '../../../environments/environment'
import { ProductService } from "../CRUD/product/product.service";





@Injectable({providedIn: 'root'})



export class ProductsService{

  private productsState!: BehaviorSubject<Product[]>;
  public productsSend$!: Observable<Product[]>;
  products: Product[] = [emptyProduct()];

  constructor(
    private http: HttpClient,
    @Inject(ProductService) private productService: ProductService
  ){
    this.productsState = new BehaviorSubject<Product[]>([emptyProduct()]);
    this.productsSend$ =  this.productsState.asObservable();
  }


  getProducts(loc: string){
    Preferences.get({key: 'products'}).then(response => {
      if(response && response.value){
        const parsedProducts = JSON.parse(response.value)
        this.products = parsedProducts
        this.productsState.next([...this.products])
      }
    })
    return this.http.post<Product[]>(`${environment.BASE_URL}product/get-products`, {loc: loc})
          .pipe(tap(response => {
            if(response){
              this.products = response
              const stringProducts = JSON.stringify(this.products)
              Preferences.set({key:'products', value: stringProducts})
              this.productsState.next([...this.products])
            }
          }))
  }

  saveCat(cat: any, loc: string){
    return this.productService.saveCategory(cat, loc)
  }

  changeProductStatus(stat: string, id: string){
    return this.http.post<Product | SubProduct>(`${environment.BASE_URL}product/change-status`, {stat: stat, id: id})
  }

}
