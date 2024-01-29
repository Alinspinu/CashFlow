import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'


@Injectable({providedIn: 'root'})


export class IngredientService{

  constructor(
    private http: HttpClient
  ){}


  getIngredients(searchQuery: string, filter: any, loc: string){
    return this.http.post(`${environment.BASE_URL}ing/search-ingredients`, {filter: filter, search: searchQuery, loc: loc})
  }

  deleteIngredient(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`)
  }

  editIngredient(id: string, ing: any){
    return this.http.put<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`, {newIng: ing})
  }

  printIngredientsList(filter: any, loc: string){
    return this.http.post(`${environment.BASE_URL}ing/print-ing-list`, {filter: filter,  loc: loc}, {responseType: 'blob'})

  }


  uodateProductIngredientPrices(locatie: string){
    return this.http.post(`${environment.BASE_URL}product/update-pro-ing-price`, {loc: locatie})
  }
}
