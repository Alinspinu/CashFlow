import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../../../models/suplier.model";
import { Nir } from "../../../models/nir.model";





@Injectable({providedIn: 'root'})



export class NirService{

  constructor(
    private http: HttpClient
  ){}


  getSuplier(input: any, loc: string){
    return this.http.post(`${environment.BASE_URL}suplier/send-supliers`, {search: input, loc: loc})
  }

  saveNir(nir: Nir, loc: string){
    return this.http.post<{message: string, nir: any}>(`${environment.BASE_URL}nir/save-nir`, {nir: nir, loc: loc})
  }

  getIngredients(input: any, loc: string){
    return this.http.post(`${environment.BASE_URL}ing/search-ingredients`, {search: input, loc: loc})
  }

  printNir(id: string){
    return this.http.post(`${environment.BASE_URL}nir/print-nir`, {id: id})
  }

  getNir(id: string){
    return this.http.get<{nir: Nir}>(`${environment.BASE_URL}nir/nir?id=${id}`)
  }

  deleteNir(id: string) {
    return this.http.delete<{message: string}>(`${environment.BASE_URL}nir/nir?id=${id}`)
  }
}
