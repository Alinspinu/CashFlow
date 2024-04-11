import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class PaymentService{


  constructor(
    private http: HttpClient
  ){}

  checkPos(sum: number){
    const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
    return this.http.post<{message: string, payment: boolean}>(`${environment.PRINT_URL}pay/pos`, {sum: sum}, {headers})
  }
}
