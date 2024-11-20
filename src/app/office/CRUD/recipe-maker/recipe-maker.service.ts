import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../../environments/environment'


@Injectable({providedIn: 'root'})


export class RecipeMakerService{

  constructor(
    private http: HttpClient
  ){}


getIngredients(){
  return this.http.post<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients?prod=true`, {loc: environment.LOC})
}
saveIng(ing: any){
  return this.http.post<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/ingredient`, {ing: ing, loc: environment.LOC})
}

editIng(ing: any, id: string){
  return this.http.put<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/ingredient?id=${id}`,{newIng: ing} )
}

deleteIng(id: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`)
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
