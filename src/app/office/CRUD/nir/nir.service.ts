import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from '../../../../environments/environment'
import { Suplier } from "../../../models/suplier.model";
import { Nir, InvIngredient, NirIngredient } from '../../../models/nir.model';
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { emptyIng, emptyNir } from "src/app/models/empty-models";
import { Preferences } from "@capacitor/preferences";
import { emptyNirIng } from '../../../models/empty-models';
import { round, round4 } from "src/app/shared/utils/functions";





@Injectable({providedIn: 'root'})




export class NirService{

  private nirState!: BehaviorSubject<Nir>;
  public nirSend$!: Observable<Nir>;
  nir: Nir = emptyNir();

  private tempIngs: {first: boolean, ings : string}  = {first: true, ings: ''}

  constructor(
    private http: HttpClient
  ){
    this.nirState = new BehaviorSubject<Nir>(emptyNir());
    this.nirSend$ =  this.nirState.asObservable();
  }


  addNirIngs(ing: NirIngredient){
    this.nir.ingredients.push(ing)
    this.clacTotals()
  }

  redNirIng(index: number){
    const ing = this.nir.ingredients[index]
    this.nir.ingredients.splice(index, 1)
    this.clacTotals()
  }

  clacTotals(){
    this.nir.val = 0;
    this.nir.valTva = 0;
    this.nir.totalDoc = 0;
    this.nir.valTva = 0;
    this.nir.valVanzare = 0;
    this.nir.ingredients.forEach( ing => {
      this.nir.val = round(this.nir.val + ing.value)
      this.nir.valTva = round(this.nir.valTva + ing.tvaValue)
      this.nir.totalDoc = round(this.nir.totalDoc +  ing.total)
      this.nir.valVanzare = round(this.nir.valVanzare + (ing.sellPrice *  ing.qty))
     })
     this.nirState.next(this.nir)
  }


  calcDiscount(result: {val: number, tva: number, type: string}){
    if(this.tempIngs.first){
      this.tempIngs.ings = JSON.stringify(this.nir.ingredients)
      this.tempIngs.first = false
    }
    if(result.type === 'val'){
      let totalOfIngsClassTva = 0
      this.nir.ingredients.forEach(ing => {
       if(ing.tva === result.tva){
           totalOfIngsClassTva += ing.price * ing.qty
         }
       })
       let discountProcent = round4(result.val / totalOfIngsClassTva)
       this.nir.discount.push({tva: result.tva, value: result.val, procent: discountProcent})
       this.nir.ingredients.forEach(ing => {
         if(ing.tva === result.tva) {
           ing.price = round(ing.price - (ing.price * discountProcent));
           ing.value = round(ing.price * ing.qty);
           ing.tvaValue = round(ing.value * (ing.tva / 100));
           ing.total = round(ing.value + ing.tvaValue);
         }
       })
       this.clacTotals()
     }


     if(result.type === 'proc') {
       let discountValue = 0
       this.nir.ingredients.forEach(ing => {
         if(ing.tva === result.tva) {
           ing.price = round(ing.price - ing.price * result.val / 100)
           ing.value = round(ing.price * ing.qty)
           ing.tvaValue = round(ing.value * ing.tva / 100)
           ing.total = round(ing.value + ing.tvaValue)
           discountValue += (ing.price * result.val / 100) * ing.qty
         }
       })
       this.nir.discount.push({tva: result.tva, value: discountValue, procent: result.val})
       this.clacTotals()
     }
  }



  removeDiscount(){
    this.nir.ingredients = JSON.parse(this.tempIngs.ings)
    this.tempIngs.first = true
    this.nir.discount = []
    this.clacTotals()
  }



  setNir(nir: Nir){
    this.nir = nir
    this.nirState.next(this.nir)
  }



  getSuplier(input: any){
    return this.http.post<any[]>(`${environment.BASE_URL}suplier/send-supliers`, {search: input, loc: environment.LOC})
  }

  saveNir(nir: Nir){
    return this.http.post<{message: string, nir: any}>(`${environment.BASE_URL}nir/save-nir`, {nir: nir, loc: environment.LOC})
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

  saveIng(ing: any){
    return this.http.post<{message: string, ing: InvIngredient}>(`${environment.BASE_URL}ing/ingredient`, {ing: ing, loc: environment.LOC})
  }
}
