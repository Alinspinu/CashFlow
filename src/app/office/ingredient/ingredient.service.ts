import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptyIng } from "src/app/models/empty-models";
import { InvIngredient } from "src/app/models/nir.model";
import { IndexDbService } from "src/app/shared/indexDb.service";
import {environment} from '../../../environments/environment'
import { Ingredient } from '../../models/category.model';
import { Preferences } from '@capacitor/preferences';


@Injectable({providedIn: 'root'})


export class IngredientService{

  private ingredientsState!: BehaviorSubject<InvIngredient[]>;
  public ingredientsSend$!: Observable<InvIngredient[]>;
  ingredients: InvIngredient[] = [emptyIng()];

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient,
    private dbService: IndexDbService,

  ){
    this.ingredientsState = new BehaviorSubject<InvIngredient[]>([emptyIng()]);
    this.ingredientsSend$ =  this.ingredientsState.asObservable();
  }


  addIngredinet(ing: InvIngredient){
    this.ingredients.push(ing)
    this.ingredientsState.next([...this.ingredients])
  }


  getIngredients(loc: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    this.dbService.getData('data', 1).subscribe((data: any) => {
      if(data){
        this.ingredients = [...JSON.parse(data.ings)]
        this.ingredientsState.next([...this.ingredients])
      }
    })
    return this.http.post<InvIngredient[]>(`${this.url}ing/search-ingredients`, {loc: loc}, {headers})
        .pipe(tap(response => {
          this.ingredients = response
          const stringIngs = JSON.stringify(this.ingredients)
          this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs}).subscribe()
          this.ingredientsState.next([...this.ingredients])
        }))
  }

  deleteIngredient(id: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.delete<{message: string}>(`${this.url}ing/ingredient?id=${id}`, {headers})
        .pipe(tap(response => {
          if(response){
            const ingIndex = this.ingredients.findIndex(ing => ing._id === id)
            if(ingIndex !== -1){
              this.ingredients.splice(ingIndex, 1)
              const stringIngs = JSON.stringify(this.ingredients)
              this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs}).subscribe()
              this.ingredientsState.next([...this.ingredients])
            }
          }
        }))
  }

  editIngredient(id: string, ing: any){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.put<{message: string, ing: InvIngredient}>(`${this.url}ing/ingredient?id=${id}`, {newIng: ing}, {headers})
        .pipe(tap(response => {
          if(response){
            const ingIndex = this.ingredients.findIndex(ing => ing._id === id)
            if(ingIndex !== -1){
              ing.ings = []
              this.ingredients[ingIndex] = response.ing
              const stringIngs = JSON.stringify(this.ingredients)
              this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs}).subscribe()
              this.ingredientsState.next([...this.ingredients])
            }
          }
        }))
  }

  printIngredientsList(filter: any, loc: string){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}ing/print-ing-list`, {filter: filter,  loc: loc}, {responseType: 'blob', headers: headers})

  }

  printConsum(dep: any, loc: string, startDate: string, endDate: string, dont: boolean){
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}ing/print-consum`, {dep: dep, startDate: startDate, endDate: endDate, loc: loc, dont: dont}, {responseType: 'blob', headers: headers})
  }


  uodateProductIngredientPrices(locatie: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.post(`${this.url}product/update-pro-ing-price`, {loc: locatie}, {headers})
  }

  updateIngredientInventary(data: any) {
     const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{message: string, ing: InvIngredient}>(`${this.url}ing/save-faptic`, {data: data}, {headers})
      .pipe(tap(response => {
        if(response) {
          const ingIndex = this.ingredients.findIndex(ing => ing._id === response.ing._id)
          if(ingIndex !== -1){
            this.ingredients[ingIndex] = response.ing
            this.ingredientsState.next([...this.ingredients])
          }
        }
      }))
  }

getIngsConsumabils(){
   const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
  return this.http.get<InvIngredient[]>(`${this.url}ing/get-consumabil?loc=${environment.LOC}`, {headers})
}


}
