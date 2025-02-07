import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { emptyeFacturaMessage } from "src/app/models/empty-models";
import { EFactura, messageEFactura } from "src/app/models/nir.model";
import { environment } from "src/environments/environment";
import { ckeckMessageStatus, editMessage, getBillIds } from "./e-factura.engine";
import { SupliersService } from "../supliers/supliers.service";
import { Suplier } from "src/app/models/suplier.model";




@Injectable({providedIn: 'root'})



export class EService{
  private eFacturaMessageState!: BehaviorSubject<messageEFactura>;
  public eFacturaMessageSend$!: Observable<messageEFactura>;
  eFacturaMessage: messageEFactura = emptyeFacturaMessage();
  private supliers: Suplier[] = []


  constructor(
    private http: HttpClient,
    private supliersService: SupliersService,
  ){
    this.eFacturaMessageState = new BehaviorSubject<messageEFactura>(emptyeFacturaMessage());
    this.eFacturaMessageSend$ =  this.eFacturaMessageState.asObservable();
  }




  getMessages(days: number){
    return this.http.get<messageEFactura>(`${environment.BASE_URL}invoice/get-msg?days=${days}&cif=${environment.CIF}`)
            .pipe(tap(message => {
              console.log(message)
                  this.eFacturaMessage = message
                  this.getSupliers()
                }))
  }

  getSupliers(){
    this.supliersService.supliersSend$.subscribe({
      next: (supliers) => {
        this.supliers = supliers
        this.checkInvoiceStatus(getBillIds(this.eFacturaMessage)).subscribe()
      }
    })
  }

  getDateMessages(startTime: number, endTime: number){
    return this.http.post<messageEFactura>(`${environment.BASE_URL}invoice/get-date-msg`, {startDate: startTime, endDate: endTime, cif: environment.CIF})
    .pipe(tap(message => {
      console.log(message)
          this.eFacturaMessage = message
          this.getSupliers()
        }))
  }

getInvoice(id: string){
    return this.http.get<EFactura>(`${environment.BASE_URL}invoice/get-invoice?id=${id}`)
}

checkInvoiceStatus(ids: string[]){
  return this.http.post<string[]>(`${environment.BASE_URL}invoice/check`, {ids: ids})
        .pipe(tap(response => {
          this.eFacturaMessage = editMessage(this.eFacturaMessage, this.supliers)
          this.eFacturaMessage = ckeckMessageStatus(this.eFacturaMessage, response)
          this.eFacturaMessageState.next(this.eFacturaMessage)
        }))
}


}
