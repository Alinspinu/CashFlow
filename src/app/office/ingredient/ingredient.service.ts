import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'


@Injectable({providedIn: 'root'})


export class IngredientService{

  constructor(
    private http: HttpClient
  ){}


  getIngredients(searchQuery: string){
    return this.http.post(`${environment.BASE_URL}ing/search-ingredients`, {search: searchQuery})
  }

  deleteIngredient(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`)
  }

  editIngredient(id: string, ing: any){
    return this.http.put<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`, {newIng: ing})
  }
}
