import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../../../models/suplier.model";
import { Preferences } from '@capacitor/preferences';




@Injectable({providedIn: 'root'})



export class SuplierService{
  url: string = environment.BASE_URL

  constructor(private http: HttpClient){
  }


  getSuplierInfo(cif: string){

   return this.http.get<any>(`${environment.SUPLIER_APY_URL}?key=${environment.SUPLIER_APY_KEY}&cui=${cif}`)
  }

  saveSuplier(suplier: Suplier, mode: any, loc: string){
    return this.http.post<{message: string, id: string}>(`${this.url}suplier/save-suplier?mode=${mode}`, {suplier: suplier})
  }

  saveAdmin(user: any, second: any){
    return this.http.post<{message: string}>(`${this.url}auth/register-employee`, {user: user, second: second})
  }

}
