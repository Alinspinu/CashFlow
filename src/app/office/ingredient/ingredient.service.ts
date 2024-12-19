import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptyIng } from "src/app/models/empty-models";
import { InvIngredient } from "src/app/models/nir.model";
import { IndexDbService } from "src/app/shared/indexDb.service";
import {environment} from '../../../environments/environment'
import { Ingredient } from '../../models/category.model';


@Injectable({providedIn: 'root'})


export class IngredientService{

  private ingredientsState!: BehaviorSubject<InvIngredient[]>;
  public ingredientsSend$!: Observable<InvIngredient[]>;
  ingredients: InvIngredient[] = [emptyIng()];

  constructor(
    private http: HttpClient,
    private dbService: IndexDbService,

  ){
    // this.getIngsFromLocal()
    this.ingredientsState = new BehaviorSubject<InvIngredient[]>([emptyIng()]);
    this.ingredientsSend$ =  this.ingredientsState.asObservable();
  }

  addIngredinet(ing: InvIngredient){
    this.ingredients.push(ing)
    this.ingredientsState.next([...this.ingredients])
  }


  getIngredient(page: number){
    return this.http.get<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients`, {params: { page: page.toString(), loc: environment.LOC }},)
  }

  getIngsFromLocal(){
    this.dbService.getData('data', 1).subscribe((data: any) => {
      if(data){
        this.ingredients = [...JSON.parse(data.ings)]
        this.ingredientsState.next([...this.ingredients])
      }
    })
  }


  getAllIngredients(): Observable<any[]> {
    const allItems: any[] = [];
    let currentPage = 1;

    const fetchNextPage = (): Observable<any> => {
      return this.getIngredient(currentPage);
    };

    return new Observable((observer) => {
      const fetchData = () => {
        fetchNextPage().subscribe(
          (data) => {
            allItems.push(...data.items); // Collect items
            if (currentPage < data.totalPages) {
              currentPage++;
                fetchData(); // Fetch the next page
            } else {
               const sortedIngs = allItems.sort((a, b) => {
                if(a.name && b.name){
                  return a.name.localeCompare(b.name)
                }
               })

              this.ingredients = sortedIngs
              this.ingredientsState.next([...this.ingredients]); // Emit all collected items
              observer.complete(); // Complete the observable
            }
          },
          (error) => {
            observer.error(error); // Handle any errors
          }
        );
      };
      fetchData(); // Start fetching data
    });
  }




  deleteIngredient(id: string){
    return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/ingredient?id=${id}`)
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
    return this.http.put<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/ingredient?id=${id}`, {newIng: ing})
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
    return this.http.post(`${environment.BASE_URL}ing/print-ing-list`, {filter: filter,  loc: loc}, {responseType: 'blob'})

  }

  printConsum(dep: any, loc: string, startDate: string, endDate: string, dont: boolean){
    return this.http.post(`${environment.BASE_URL}ing/print-consum`, {dep: dep, startDate: startDate, endDate: endDate, loc: loc, dont: dont}, {responseType: 'blob'})
  }


  uodateProductIngredientPrices(locatie: string){
    return this.http.post(`${environment.BASE_URL}product/update-pro-ing-price`, {loc: locatie})
  }

  updateIngredientInventary(data: any) {
    return this.http.post<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/save-faptic`, {data: data})
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
  return this.http.get<InvIngredient[]>(`${environment.BASE_URL}ing/get-consumabil?loc=${environment.LOC}`)
}


}
