import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../../../models/suplier.model";




@Injectable({providedIn: 'root'})



export class SuplierService{

  constructor(private http: HttpClient){}


  getSuplierInfo(cif: string){
   return this.http.get<any>(`${environment.SUPLIER_APY_URL}?key=${environment.SUPLIER_APY_KEY}&cui=${cif}`)
  }

  saveSuplier(suplier: Suplier, personal: boolean){
    console.log('hit http')
    return this.http.post<any>(`${environment.BASE_URL}suplier/save-suplier?personal=${personal}`, {suplier: suplier})
  }

}
