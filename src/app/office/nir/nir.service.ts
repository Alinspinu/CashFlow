import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment'
import { Suplier } from "../../models/suplier.model";
import { Nir } from "../../models/nir.model";




@Injectable({providedIn: 'root'})



export class NirService{

  constructor(
    private http: HttpClient
  ){}


  getSuplier(input: any){
    return this.http.post(`${environment.BASE_URL}suplier/send-supliers`, {search: input})
  }

  saveNir(nir: Nir){
    return this.http.post(`${environment.BASE_URL}nir/save-nir`, {nir: nir})
  }

  getIngredients(input: any){
    return this.http.post(`${environment.BASE_URL}ing/search-ingredients`, {search: input})
  }
}
