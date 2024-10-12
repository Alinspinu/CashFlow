import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../../environments/environment'
import { Preferences } from '@capacitor/preferences';


@Injectable({providedIn: 'root'})


export class RecipeMakerService{
  url: string = 'https://cafetish-server.ew.r.appspot.com/'
  constructor(
    private http: HttpClient
  ){
  }



getIngredients(loc: string){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.post<InvIngredient[]>(`${this.url}ing/search-ingredients?prod=true`, {loc: loc}, {headers})
}
saveIng(ing: any, loc: string){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });

  return this.http.post<{message: string, ing: InvIngredient}>(`${this.url}ing/ingredient`, {ing: ing, loc: loc}, {headers})
}

editIng(ing: any, id: string){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.put<{message: string, ing: InvIngredient}>(`${this.url}ing/ingredient?id=${id}`,{newIng: ing} , {headers})
}

deleteIng(id: string){
       const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.delete<{message: string}>(`${this.url}ing/ingredient?id=${id}`, {headers})
}

// saveProductIngredient(productIngredient: ProductIngredient){
//     return this.http.post<{message: string}>(`${environment.BASE_URL}ing/product-ing`, {productIngredient: productIngredient})
// }

// editProductIngredient(productIngredient: ProductIngredient, id: string) {
//   return this.http.put<{message: string}>(`${environment.BASE_URL}ing/product-ing?id=${id}`, {newProdIng: productIngredient})
// }

// deleteProductIngredinet(id: string){
//   return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/product-ing?id=${id}`)
// }



}
