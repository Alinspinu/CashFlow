import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class AddProductDiscountService{

  constructor(
    private http: HttpClient
  ){}

  searchProduct(searchInput: string, filter: any, loc: string){
    return this.http.post<{cat: any[]}>(`${environment.BASE_URL}product/get-products?search=${searchInput}`, {filter:{locatie: loc}})
  }
}
