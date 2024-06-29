import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class AddProductDiscountService{

  constructor(
    private http: HttpClient
  ){}

  getProducts(){
    return this.http.post<{cat: any[]}>(`${environment.BASE_URL}product/get-products`, {loc: environment.LOC})
  }
}
