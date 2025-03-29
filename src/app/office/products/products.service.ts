import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Product, SubProduct } from "src/app/models/category.model";
import { emptyProduct } from "src/app/models/empty-models";
import { IndexDbService } from "src/app/shared/indexDb.service";
import {environment} from '../../../environments/environment'





@Injectable({providedIn: 'root'})



export class ProductsService{

  private productsState!: BehaviorSubject<Product[]>;
  public productsSend$!: Observable<Product[]>;
  products: Product[] = [emptyProduct()];

  constructor(
    private http: HttpClient,
    private dbService: IndexDbService,
  ){
    this.productsState = new BehaviorSubject<Product[]>([emptyProduct()]);
    this.productsSend$ =  this.productsState.asObservable();
  }


  getProducts(){
    this.dbService.getData('data', 2).subscribe((response: any) => {
      if(response){
        this.products = [...JSON.parse(response.products)]
        this.productsState.next(this.products)
        this.productsState.next([...this.products])
      }
    })
    return this.http.post<Product[]>(`${environment.BASE_URL}product/get-products`, {loc: environment.LOC})
          .pipe(tap(response => {
            if(response){
              this.products = response
              const stringProducts = JSON.stringify(this.products)
              this.dbService.addOrUpdateIngredient({id: 2, products: stringProducts }).subscribe()
              this.productsState.next([...this.products])
            }
          }))
        }


  changeProductStatus(stat: string, id: string){
    return this.http.post<Product | SubProduct>(`${environment.BASE_URL}product/change-status`, {stat: stat, id: id})
  }


  editProduct(product: any) {
    return this.http.put<{message: string, product: any}>(`${environment.BASE_URL}product/product`, {product: product})
        .pipe(tap(response => {
          if(response && response.product){
            const newProduct = response.product
            const productIndex = this.products.findIndex(product => product._id === newProduct._id)
            if(productIndex !== -1){
              this.products[productIndex] = newProduct
              this.productsState.next([...this.products])
            }
          }
        }))
  }

  saveProduct(product: any){
    return this.http.post<{message: string, product: any}>(`${environment.BASE_URL}product/prod-add?loc=${environment.LOC}`, {data: product})
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
    return this.http.delete<{message: string}>(`${environment.BASE_URL}product/product?id=${id}`)
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


  deleteSubProduct(id: string){
    return this.http.delete(`${environment.BASE_URL}sub/sub-product?id=${id}`)
  }

  saveSubProduct(sub: SubProduct){
    return this.http.post<{message: string, subProduct: any}>(`${environment.BASE_URL}sub/sub-product?loc=${environment.LOC}`, sub)
  }

  editSubProduct(subProduct: any){
    return this.http.put<{message: string, subProduct: any}>(`${environment.BASE_URL}sub/sub-product`, {sub: subProduct})
  }


 printEcel(filter : any) {
  return this.http.post(`${environment.BASE_URL}print/products-recipes`, {filter}, {responseType: 'blob'})
 }

 getCigarets(){
  const products = this.products.filter(p => p.name === 'TEREA' || p.name === 'DELIA' || p.name === 'HEETS' || p.name ==='Veev Ultra' || p.name === 'ZYN')
  return products
 }

 getNutritonalValues(request: string){
  return this.http.post<{message: string}>(`${environment.BASE_URL}gbt/nutrition`, {request: request})
 }

}
