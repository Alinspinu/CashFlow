import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Product, SubProduct } from "src/app/models/category.model";
import {environment} from '../../../environments/environment'
import { ProductService } from "../CRUD/product/product.service";





@Injectable({providedIn: 'root'})



export class ProductsService{

  constructor(
    private http: HttpClient,
    @Inject(ProductService) private productService: ProductService
  ){}


  getProducts(loc: string){
    return this.http.post<Product[]>(`${environment.BASE_URL}product/get-products`, {loc: loc})
  }

  saveCat(cat: any, loc: string){
    return this.productService.saveCategory(cat, loc)
  }

  changeProductStatus(stat: string, id: string){
    return this.http.post<Product | SubProduct>(`${environment.BASE_URL}product/change-status`, {stat: stat, id: id})
  }

}
