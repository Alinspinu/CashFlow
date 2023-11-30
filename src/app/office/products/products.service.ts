import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Product } from "src/app/content/category.model";
import {environment} from '../../../environments/environment'
import { ProductService } from "../CRUD/product/product.service";





@Injectable({providedIn: 'root'})



export class ProductsService{

  constructor(
    private http: HttpClient,
    @Inject(ProductService) private productService: ProductService
  ){}


  getProducts(filter: any, searchInput: string){
    return this.http.post<Product[]>(`${environment.BASE_LOCAL_URL}office/get-products?search=${searchInput}`, {filter: filter})
  }

  saveCat(cat: any){
    return this.productService.saveCategory(cat)
  }

}
