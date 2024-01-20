import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class AddClientDiscountService{

  constructor(
    private http: HttpClient
  ){}

  searchCat(search: string, locatie: string){
    return this.http.get<{cat: any[]}>(`${environment.BASE_URL}cat/search-cat?search=${search}&loc=${locatie}`)
  }
}
