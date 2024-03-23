import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product, SubProduct } from "src/app/models/category.model";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../../environments/environment'


@Injectable({providedIn: 'root'})


export class ProductService{

  constructor(
    private http: HttpClient
  ){}

  getProduct(id: string){
    return this.http.get<Product>(`${environment.BASE_URL}product/get-product?id=${id}`)
  }


  // getCategories(input: any){
  //   return this.http.post(`${environment.BASE_URL}product/seearch-category`, {search: input})
  // }


  deleteSubProduct(id: string){
    return this.http.delete(`${environment.BASE_URL}sub/sub-product?id=${id}`)
  }

  saveSubProduct(sub: SubProduct, loc: string){
    return this.http.post<{message: string, subProduct: any}>(`${environment.BASE_URL}sub/sub-prod-add?loc=${loc}`, sub)
  }

  saveCategory(category: any, loc: string) {
    return this.http.post(`${environment.BASE_URL}cat/cat-add?loc=${loc}`, category)
  }

}
