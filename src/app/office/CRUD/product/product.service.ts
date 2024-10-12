import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Product, SubProduct } from "src/app/models/category.model";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../../environments/environment'
import { Preferences } from '@capacitor/preferences';


@Injectable({providedIn: 'root'})


export class ProductService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'
  constructor(
    private http: HttpClient
  ){
  }



  getProduct(id: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get<Product>(`${this.url}product/get-product?id=${id}`, {headers})
  }


  saveProduct(product: any, loc: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{message: string, product: any}>(`${this.url}product/prod-add?loc=${loc}`, product, {headers})
  }

  editProduct(product: any, id: string) {
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.put<{message: string, product: any}>(`${this.url}product/product?id=${id}`, product, {headers})
  }

  // getCategories(input: any){
  //   return this.http.post(`${environment.BASE_URL}product/seearch-category`, {search: input})
  // }


  deleteSubProduct(id: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.delete(`${this.url}sub/sub-product?id=${id}`, {headers})
  }

  saveSubProduct(sub: SubProduct, loc: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{message: string, subProduct: any}>(`${this.url}sub/sub-prod-add?loc=${loc}`, sub, {headers})
  }

  saveCategory(category: any, loc: string) {
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}cat/cat-add?loc=${loc}`, category, {headers})
  }

}
