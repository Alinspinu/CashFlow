import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class PaymentService{


  constructor(
    private http: HttpClient
  ){}

  checkPos(sum: number){
    return this.http.post(`${environment.BASE_URL}payment/pos`, {sum: sum})
  }
}
