import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from '../../auth/auth.service';



@Injectable({providedIn: 'root'})



export class PaymentService{


  constructor(
    private http: HttpClient,
    private auth: AuthService
  ){}

  checkPos(sum: number){
    const headers = this.auth.apiAuth()
    return this.http.post<{message: string, payment: boolean}>(`${environment.PRINT_URL}print`, {pos: sum}, {headers})
  }
}
