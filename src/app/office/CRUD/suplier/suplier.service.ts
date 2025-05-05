import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'




@Injectable({providedIn: 'root'})



export class SuplierService{



  constructor(
    private http: HttpClient
  ){}


  getSuplierInfo(cif: string){
   return this.http.get<any>(`${environment.SUPLIER_APY_URL}?key=${environment.SUPLIER_APY_KEY}&cui=${cif}`)
  }

  saveAdmin(user: any, second: any){
    return this.http.post<{message: string}>(`${environment.BASE_URL}auth/register-employee`, {user: user, second: second})
  }

}
