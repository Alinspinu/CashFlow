import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product, SubProduct } from "src/app/content/category.model";
import {environment} from '../../../../environments/environment'


@Injectable({providedIn: 'root'})


export class ProductService{

  constructor(
    private http: HttpClient
  ){}

  getProduct(id: string){
    return this.http.get<Product>(`${environment.BASE_LOCAL_URL}office/get-product?id=${id}`)
  }

  getIngredients(input: any){
    return this.http.post(`${environment.BASE_LOCAL_URL}office/search-ingredients?prod=true`, {search: input})
  }

  seaveProduct(product: any, toppings: string, ings: string){
    return this.http.post<{message: string, product: any}>(`${environment.BASE_LOCAL_URL}api-true/prod-add?ings=${ings}&toppings=${toppings}`, product)
  }

  editProduct(product: any, toppings: string, ings: string, sub: string) {
    console.log('hit service')
    return this.http.put(`${environment.BASE_LOCAL_URL}api-true/product?ings=${ings}&toppings=${toppings}&sub=${sub}`, product)
  }

  getCategories(input: any){
    return this.http.post(`${environment.BASE_LOCAL_URL}office/seearch-category`, {search: input})
  }

  saveIng(ing: any){
    return this.http.post<{message: string}>(`${environment.BASE_LOCAL_URL}office/save-ingredient`, {ing: ing})
  }

  deleteSubProduct(id: string){
    return this.http.delete(`${environment.BASE_LOCAL_URL}api-true/sub-product?id=${id}`)
  }

  saveSubProduct(sub: SubProduct){
    return this.http.post<{message: string, subProduct: any}>(`${environment.BASE_LOCAL_URL}api-true/sub-prod-add`, sub)
  }

  saveCategory(category: any) {
    return this.http.post(`${environment.BASE_LOCAL_URL}api-true/cat-add`, category)
  }

}
