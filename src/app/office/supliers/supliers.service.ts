import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Suplier } from "src/app/models/suplier.model";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { IndexDbService } from "src/app/shared/indexDb.service";
import { emptySuplier } from "src/app/models/empty-models";




@Injectable({providedIn: 'root'})


export class SupliersService{

  private supliersState!: BehaviorSubject<Suplier[]>;
  public supliersSend$!: Observable<Suplier[]>;
  supliers: Suplier[] = [emptySuplier()];

  constructor(
    private http: HttpClient,
    private dbService: IndexDbService,

  ){

    this.supliersState = new BehaviorSubject<Suplier[]>([emptySuplier()]);
    this.supliersSend$ =  this.supliersState.asObservable();
  }


  getSupliersFromLocal(){
    this.dbService.getData('data', 4).subscribe((data: any) => {
      if(data){
        this.supliers = [...JSON.parse(data.ings)]
        this.supliersState.next([...this.supliers])
      }
    })
  }

getSupliers(){
  this.getSupliersFromLocal()
  return this.http.get<Suplier[]>(`${environment.BASE_URL}suplier/get-supliers?loc=${environment.LOC}`)
     .pipe(tap(response => {
                if(response){
                  this.supliers = response
                  const stringSupliers = JSON.stringify(this.supliers)
                  this.dbService.addOrUpdateIngredient({id: 4, ings: stringSupliers}).subscribe()
                  this.supliersState.next([...this.supliers])
                  }
              }))
}


deleteSuplier(id: string){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}suplier/remove-suplier?suplierId=${id}`)
        .pipe(tap(response => {
          if(response){
            const index = this.supliers.findIndex(s => s._id === id)
            if(index !== -1) this.supliers.splice(index, 1)
            const stringSupliers = JSON.stringify(this.supliers)
            this.dbService.addOrUpdateIngredient({id: 4, ings: stringSupliers}).subscribe()
            this.supliersState.next([...this.supliers])
            }
        }))
}

editSuplier(suplierId: string, update: any){
  return this.http.put<{message: string, suplier: Suplier}>(`${environment.BASE_URL}suplier/update-suplier`, {suplierId, update})
        .pipe(tap(response => {
          if(response){
            const index = this.supliers.findIndex(s => s._id === response.suplier._id)
            if(index !== -1) this.supliers[index] = response.suplier
            const stringSupliers = JSON.stringify(this.supliers)
            this.dbService.addOrUpdateIngredient({id: 4, ings: stringSupliers}).subscribe()
            this.supliersState.next([...this.supliers])
            }
        }))

}

getSuplier(id: string){
  return this.http.get<Suplier>(`${environment.BASE_URL}suplier/get-suplier?suplierId=${id}`)
}

addRecord(record: any, suplierId: string){
  return this.http.post<any>(`${environment.BASE_URL}suplier/add-record`, {record, suplierId})
}

deleteRecord(suplierId: string, docId: string, amount: number){
  return this.http.put<{message: string}>(`${environment.BASE_URL}suplier/remove-record`, {suplierId, docId, amount })
}

}
