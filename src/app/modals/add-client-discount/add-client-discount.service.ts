import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";




@Injectable({providedIn: 'root'})



export class AddClientDiscountService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  constructor(
    private http: HttpClient
  ){
  }

  searchCat(search: string, locatie: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.get<{cat: any[]}>(`${this.url}cat/search-cat?search=${search}&loc=${locatie}`, {headers})
  }
}
