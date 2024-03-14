import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../environments/environment'


@Injectable({providedIn: 'root'})


export class IngredientService{

  constructor(
    private http: HttpClient
  ){}


  getIngredients(filter: any, loc: string){
    return this.http.post<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients`, {filter: filter, loc: loc})
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

  printConsum(dep: any, loc: string, startDate: string, endDate: string, dont: boolean){
    return this.http.post(`${environment.BASE_URL}ing/print-consum`, {dep: dep, startDate: startDate, endDate: endDate, loc: loc, dont: dont}, {responseType: 'blob'})
  }


  uodateProductIngredientPrices(locatie: string){
    return this.http.post(`${environment.BASE_URL}product/update-pro-ing-price`, {loc: locatie})
  }
}
