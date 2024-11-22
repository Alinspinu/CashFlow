import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EFactura, messageEFactura } from "src/app/models/nir.model";
import { environment } from "src/environments/environment";




@Injectable({providedIn: 'root'})



export class EService{

  constructor(
    private http: HttpClient
  ){}



  getMessages(days: number){
    return this.http.get<messageEFactura>(`${environment.BASE_URL}invoice/get-msg?days=${days}&cif=${environment.CIF}`)
  }

getInvoice(id: string){
    return this.http.get<EFactura>(`${environment.BASE_URL}invoice/get-invoice?id=${id}`)
}

checkInvoiceStatus(ids: string[]){
  return this.http.post<string[]>(`${environment.BASE_URL}invoice/check`, {ids: ids})
}


}
