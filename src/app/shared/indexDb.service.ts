import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class IndexDbService {


  constructor(
    private dbService: NgxIndexedDBService
  ) {}



  addOrUpdateIngredient(data: any): Observable<any> {
    return from(this.dbService.getByID('data', data.id)).pipe(
      switchMap(existingData => {
        if (existingData) {
          console.log('updated db')
          return from(this.dbService.update('data', data));
        } else {
          console.log('iserted db')
          return from(this.dbService.add('data', data));
        }
      })
    );
  }

  getData(store: string, id: number){
    return from(this.dbService.getByKey(store, id))
  }

}
