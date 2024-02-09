import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";



@Injectable({providedIn: 'root'})



export class ConfigService{

  locatie!: string

  constructor(
    private http: HttpClient,
  ){}


  fetchLocatie(locId: string){
    return this.http.get(`${environment.BASE_URL}users/loc?id=${locId}`)
  }

  saveServiceMail(email: string, appKey: string, locId: string ){
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/loc`, {email, appKey, locId})
  }

}
