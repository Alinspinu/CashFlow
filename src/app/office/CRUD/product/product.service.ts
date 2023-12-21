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

  getIngredients(input: any){
    return this.http.post<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients?prod=true`, {search: input})
  }

  seaveProduct(product: any, toppings: string, ings: string){
    return this.http.post<{message: string, product: any}>(`${environment.BASE_URL}product/prod-add?ings=${ings}&toppings=${toppings}`, product)
  }

  editProduct(product: any, toppings: string, ings: string, sub: string, id: string) {
    return this.http.put<{message: string, product: any}>(`${environment.BASE_URL}product/product?ings=${ings}&toppings=${toppings}&sub=${sub}&id=${id}`, product)
  }

  // getCategories(input: any){
  //   return this.http.post(`${environment.BASE_URL}product/seearch-category`, {search: input})
  // }

  saveIng(ing: any){
    return this.http.post<{message: string}>(`${environment.BASE_URL}ing/save-ingredient`, {ing: ing})
  }

  deleteSubProduct(id: string){
    return this.http.delete(`${environment.BASE_URL}sub/sub-product?id=${id}`)
  }

  saveSubProduct(sub: SubProduct){
    return this.http.post<{message: string, subProduct: any}>(`${environment.BASE_URL}sub/sub-prod-add`, sub)
  }

  saveCategory(category: any) {
    return this.http.post(`${environment.BASE_URL}api-true/cat-add`, category)
  }

}
