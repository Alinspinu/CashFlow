import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../suplier/suplier.model";
import { Nir } from "./nir.model";




@Injectable({providedIn: 'root'})



export class NirService{

  constructor(
    private http: HttpClient
  ){}


  getSuplier(input: any){
    return this.http.post(`${environment.BASE_LOCAL_URL}office/send-supliers`, {search: input})
  }

  saveNir(nir: Nir){
    return this.http.post(`${environment.BASE_LOCAL_URL}office/save-nir`, {nir: nir})
  }

  getIngredients(input: any){
    return this.http.post(`${environment.BASE_LOCAL_URL}office/search-ingredients`, {search: input})
  }
}
