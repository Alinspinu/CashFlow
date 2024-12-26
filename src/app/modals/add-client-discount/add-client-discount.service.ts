import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';




@Injectable({providedIn: 'root'})



export class AddClientDiscountService{

 url: string = environment.BASE_URL

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
