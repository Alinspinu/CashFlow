import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "./suplier.model";




@Injectable({providedIn: 'root'})



export class SuplierService{

  constructor(private http: HttpClient){}


  getSuplierInfo(cif: string){
   return this.http.get<any>(`${environment.SUPLIER_APY_URL}?key=${environment.SUPLIER_APY_KEY}&cui=${cif}`)
  }

  saveSuplier(suplier: Suplier, personal: boolean){
    return this.http.post<any>(`${environment.BASE_LOCAL_URL}office/save-suplier?personal=${personal}`, {suplier: suplier})
  }

}
