import { HttpClient } from "@angular/common/http";
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
    return this.http.post<any[]>(`${environment.BASE_URL}suplier/send-supliers`, {search: input, loc: loc})
  }

  saveNir(nir: Nir, loc: string){
    return this.http.post<{message: string, nir: any}>(`${environment.BASE_URL}nir/save-nir`, {nir: nir, loc: loc})
  }

  getIngredients(loc: string){
    return this.http.post<InvIngredient[]>(`${environment.BASE_URL}ing/search-ingredients`, {loc: loc})
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
