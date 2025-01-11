import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class GbtService{
  constructor(
    private http: HttpClient
  ){}


  getImage(prompt: string, size: string | undefined) {
    return this.http.post<{imageUrl: string}>(`${environment.BASE_URL}gbt/image`, {prompt, size})
  }
}
