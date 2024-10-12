import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})



export class AddProductDiscountService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient
  ){
  }

  getProducts(){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.post<{cat: any[]}>(`${this.url}product/get-products`, {loc: environment.LOC}, {headers})
  }
}
