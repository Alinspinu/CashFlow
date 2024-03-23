import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Ingredient } from "src/app/models/category.model";
import { emptyIng } from "src/app/models/empty-models";
import { InvIngredient } from "src/app/models/nir.model";
import {environment} from '../../../environments/environment'


@Injectable({providedIn: 'root'})


export class IngredientService{

  private ingredientsState!: BehaviorSubject<InvIngredient[]>;
  public ingredientsSend$!: Observable<InvIngredient[]>;
  ingredients: InvIngredient[] = [emptyIng()];

  constructor(
    private http: HttpClient
  ){
    this.ingredientsState = new BehaviorSubject<InvIngredient[]>([emptyIng()]);
    this.ingredientsSend$ =  this.ingredientsState.asObservable();
  }

  getIngredients(filter: any, loc: string){
   Preferences.get({key: 'ings'}).then(result => {
    if(result && result.value){
      console.log(result)
      this.ingredients = JSON.parse(result.value)
      this.ingredientsState.next([...this.ingredients])
    }
   })
    return this.http.post<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients`, {filter: filter, loc: loc})
        .pipe(tap(response => {
          this.ingredients = response
          const stringIngs = JSON.stringify(this.ingredients)
          Preferences.set({key: 'ings', value: stringIngs} )
          this.ingredientsState.next([...this.ingredients])
        }))
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
