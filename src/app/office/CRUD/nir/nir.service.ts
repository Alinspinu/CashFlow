import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../../../models/suplier.model";
import { Nir, InvIngredient, NirIngredient } from '../../../models/nir.model';
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { emptyIng } from "src/app/models/empty-models";
import { Preferences } from "@capacitor/preferences";
import { emptyNirIng } from '../../../models/empty-models';





@Injectable({providedIn: 'root'})




export class NirService{
  url: string = 'https://cafetish-server.ew.r.appspot.com/'

  private nirIngState!: BehaviorSubject<NirIngredient[]>;
  public nirIngSend$!: Observable<NirIngredient[]>;
  nirIngredients: NirIngredient[] = [emptyNirIng()];

  constructor(
    private http: HttpClient
  ){
    this.nirIngState = new BehaviorSubject<NirIngredient[]>([emptyNirIng()]);
    this.nirIngSend$ =  this.nirIngState.asObservable();
  }



  addNirIngs(ing: NirIngredient){
    this.nirIngredients.push(ing)
    console.log(this.nirIngredients)
    this.nirIngState.next([...this.nirIngredients])
  }

  redNirIng(index: number){
    this.nirIngredients.splice(index, 1)
    this.nirIngState.next(this.nirIngredients)
  }

  resetProducts(){
    this.nirIngredients = [emptyNirIng()]
    this.nirIngState.next(this.nirIngredients)
  }

  setIngredients(ings: NirIngredient[]){
    this.nirIngredients = ings
    console.log(this.nirIngredients)
    this.nirIngState.next(this.nirIngredients)
  }



  getSuplier(input: any, loc: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.post<any[]>(`${this.url}suplier/send-supliers`, {search: input, loc: loc}, {headers})
  }

  saveNir(nir: Nir, loc: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<{message: string, nir: any}>(`${this.url}nir/save-nir`, {nir: nir, loc: loc}, {headers})
  }

  getIngredients(loc: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post<InvIngredient[]>(`${this.url}ing/search-ingredients`, {loc: loc}, {headers})
  }

  printNir(id: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.post(`${this.url}nir/print-nir`, {id: id}, {headers})
  }

  getNir(id: string){
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.get<{nir: Nir}>(`${this.url}nir/nir?id=${id}`, {headers})
  }

  deleteNir(id: string) {
         const  headers: HttpHeaders = new HttpHeaders({
        'bypass-tunnel-reminder': 'true'
      });
    return this.http.delete<{message: string}>(`${this.url}nir/nir?id=${id}`, {headers})
  }
}
