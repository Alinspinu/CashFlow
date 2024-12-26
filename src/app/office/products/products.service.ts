import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product, SubProduct } from "src/app/models/category.model";
import { emptyProduct } from "src/app/models/empty-models";
import { IndexDbService } from "src/app/shared/indexDb.service";
import {environment} from '../../../environments/environment'
import { ProductService } from "../CRUD/product/product.service";





@Injectable({providedIn: 'root'})



export class ProductsService{

  private productsState!: BehaviorSubject<Product[]>;
  public productsSend$!: Observable<Product[]>;
  products: Product[] = [emptyProduct()];

  url: string = environment.BASE_URL

  constructor(
    private http: HttpClient,
    @Inject(ProductService) private productService: ProductService,
    private dbService: IndexDbService,
  ){
    this.productsState = new BehaviorSubject<Product[]>([emptyProduct()]);
    this.productsSend$ =  this.productsState.asObservable();
  }


  getProducts(loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    this.dbService.getData('data', 2).subscribe((response: any) => {
      if(response){
        this.products = [...JSON.parse(response.products)]
        this.productsState.next(this.products)
      }
    })
    return this.http.post<Product[]>(`${this.url}product/get-products`, {loc: loc}, {headers})
          .pipe(tap(response => {
            if(response){
              this.products = response
              const stringProducts = JSON.stringify(this.products)
              this.dbService.addOrUpdateIngredient({id: 2, products: stringProducts }).subscribe()
              this.productsState.next([...this.products])
            }
          }))
        }
  saveCat(cat: any, loc: string){
    return this.productService.saveCategory(cat, loc)
  }

  changeProductStatus(stat: string, id: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<Product | SubProduct>(`${this.url}product/change-status`, {stat: stat, id: id}, {headers})
  }


  editProduct(product: any, id: string) {
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.put<{message: string, product: any}>(`${this.url}product/product?id=${id}`, product, {headers})
        .pipe(tap(response => {
          if(response && response.product){
            const newProduct = response.product
            const productIndex = this.products.findIndex(product => product._id === newProduct._id)
            console.log(productIndex)
            if(productIndex !== -1){
              this.products[productIndex] = newProduct
              this.productsState.next([...this.products])
            }
          }
        }))
  }

  saveProduct(product: any, loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{message: string, product: any}>(`${this.url}product/prod-add?loc=${loc}`, product, {headers})
    .pipe(tap(response => {
      if(response && response.product){
        const newProduct = response.product
        this.products.push(newProduct)
        this.products.sort((a,b) => a.name.localeCompare(b.name))
        this.productsState.next([...this.products])
      }
    }))
  }

  deleteProduct(id: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.delete<{message: string}>(`${this.url}product/product?id=${id}`, {headers})
        .pipe(tap(response => {
          if(response){
            const productIndex = this.products.findIndex(product => product._id === id)
            if(productIndex !== -1){
              this.products.splice(productIndex, 1)
              this.productsState.next([...this.products])
            }
          }
        }))
  }


}
