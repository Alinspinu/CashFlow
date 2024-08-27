import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from '../../auth/auth.service';



@Injectable({providedIn: 'root'})



export class PaymentService{

  screenWidth!: number
  baseUrl!: string

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ){
    this.screenWidth = window.innerWidth
    this.screenWidth < 500 ? this.baseUrl = environment.SAVE_URL_MOBILE : this.baseUrl = environment.SAVE_URL
    console.log(this.baseUrl)
  }

  checkPos(sum: number){
    const headers = this.auth.apiAuth()
    return this.http.post<{message: string, payment: boolean}>(`${this.baseUrl}pay/pos`, {sum: sum}, {headers})
  }

  checkPos2(sum: number, id: string, abort: string, ip: string, port: string){
    const headers = this.auth.apiAuth()
    return this.http.get<any>(`${this.baseUrl}pay/pos2?sessionId=${id}&amount=${sum}&abort=${abort}&ip=${ip}&port=${port}`, {headers})
  }

  getLocatie(){
    return this.http.get<{ip: string, port: string}>(`${environment.BASE_URL}auth/loc?id=${environment.LOC}`)
  }

}
