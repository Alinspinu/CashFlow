import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptyIng } from "src/app/models/empty-models";
import { Dep, Gestiune, InvIngredient } from "src/app/models/nir.model";
import { IndexDbService } from "src/app/shared/indexDb.service";
import {environment} from '../../../environments/environment'
import { Ingredient } from '../../models/category.model';
import { round } from "src/app/shared/utils/functions";


@Injectable({providedIn: 'root'})


export class IngredientService{

  private ingredientsState!: BehaviorSubject<InvIngredient[]>;
  public ingredientsSend$!: Observable<InvIngredient[]>;
  ingredients: InvIngredient[] = [emptyIng()];

  constructor(
    private http: HttpClient,
    private dbService: IndexDbService,

  ){

    this.ingredientsState = new BehaviorSubject<InvIngredient[]>([emptyIng()]);
    this.ingredientsSend$ =  this.ingredientsState.asObservable();
  }


  getIng(id: string): InvIngredient | null{
      const index =  this.ingredients.findIndex(i => i._id === id)
      if(index !== -1) {
        let ing = this.ingredients[index]
          let price = 0
          if(ing.productIngredient){
            for(let ig of ing.ings){
              price = round(price + (ig.qty * ig.ing.tvaPrice))
            }
          } else {
            price = ing.tvaPrice
          }
          this.ingredients[index].tvaPrice = price
        return this.ingredients[index]
      } else{
        return null
      }
  }

  addIngredinet(ing: InvIngredient){
    return this.http.post<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/ingredient`, {ing: ing, loc: environment.LOC})
            .pipe(tap(response => {
              if(response){
                console.log('saved ing', response.ing)
                console.log('service ingredients before push',this.ingredients.length)
                this.ingredients.push(response.ing)
                const stringIngs = JSON.stringify(this.ingredients)
                this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs}).subscribe()
                console.log('service ingredients',this.ingredients.length)
                this.ingredientsState.next([...this.ingredients])
                }
            }))
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
    this.getIngsFromLocal()
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
              const stringIngs = JSON.stringify(sortedIngs)
              this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs }).subscribe()
              this.ingredientsState.next([...this.ingredients]);
              observer.complete();
            }
          },
          (error) => {
            observer.error(error);
          }
        );
      };
      fetchData();
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
            const stringIngs = JSON.stringify(this.ingredients)
            this.dbService.addOrUpdateIngredient({id: 1, ings: stringIngs}).subscribe()
            this.ingredientsState.next([...this.ingredients])
          }
        }
      }))
  }

getIngsConsumabils(){
  return this.http.get<InvIngredient[]>(`${environment.BASE_URL}ing/get-consumabil?loc=${environment.LOC}`)
}

saveInventary(){
  return this.http.get<{message: string}>(`${environment.BASE_URL}ing/save-inventary?loc=${environment.LOC}`)
}

getUploadLog(id: string){
  return this.http.get<InvIngredient>(`${environment.BASE_URL}ing/log?id=${id}`)
}




addGestiune(gest: any){
  return this.http.post<{message: string, gest: Gestiune}>(`${environment.BASE_URL}ing/gest`, {gest: gest})
}

getGestiune(){
  return this.http.get<Gestiune[]>(`${environment.BASE_URL}ing/gest?loc=${environment.LOC}&salePoint=${environment.POINT}`)
}

editGestiune(gest: any){
  return this.http.put<{message: string, gest: Gestiune}>(`${environment.BASE_URL}ing/gest`, {gest: gest})
}

deleteGestiune(id: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/gest?id=${id}`)
}




addDep(dep: any){
  return this.http.post<{message: string, dep: Dep}>(`${environment.BASE_URL}ing/dep`, {dep: dep})
}

getDep(){
  return this.http.get<Dep[]>(`${environment.BASE_URL}ing/dep?loc=${environment.LOC}&salePoint=${environment.POINT}`)
}

editDep(dep: any){
  return this.http.put<{message: string, dep: Dep}>(`${environment.BASE_URL}ing/dep`, {dep: dep})
}

deleteDep(id: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}ing/dep?id=${id}`)
}


}
