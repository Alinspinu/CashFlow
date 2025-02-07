import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { EService } from './e-factura.service';
import { Suplier } from 'src/app/models/suplier.model';
import { EFactura, InvIngredient, messageEFactura } from 'src/app/models/nir.model';
import { getBillIds, mergeProducts } from './e-factura.engine';
import { formatedDateToShow,  round } from 'src/app/shared/utils/functions';
import { IngredientService } from '../ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Router } from '@angular/router';
import { FacturaPage } from './factura/factura.page';
import { DatePickerPage } from 'src/app/modals/date-picker/date-picker.page';

@Component({
  selector: 'app-e-factura',
  templateUrl: './e-factura.page.html',
  styleUrls: ['./e-factura.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EFacturaPage implements OnInit, OnDestroy {

  supliers: Suplier[] = []
  message!: messageEFactura
  eFactura!: EFactura
  invoiceSearch: string = ''

  messages: any[] = []
  messageToShow!: any

  billsId: string[] = []

  ingSub!: Subscription

  ingrdients: InvIngredient[] = []

  constructor(
    private eService: EService,
    private ingService: IngredientService,
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.ingService.getAllIngredients().subscribe()
    this.getIngredients()
    this.getMessage(5)
  }


  ngOnDestroy(): void {
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }


  async selectPeriod(){
      const stDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE ÎNCEPUT')
      if(stDate){
        const enDate = await this.actionSheet.openPayment(DatePickerPage, 'ALEGE ZIUA DE SFÂRȘIT')
        const start = new Date(stDate).setHours(0,0,0,0)
        const end = new Date(enDate).setHours(0,0,0,0)
        this.eService.getDateMessages(start, end).subscribe()
      }
    }



  close(){
    this.modalCtrl.dismiss(null)
  }


  getIngredients(){
    this.ingSub = this.ingService.ingredientsSend$.subscribe({
      next: (response) => {
        this.ingrdients = response.filter(i => !i.productIngredient)
      }
    })
  }


  getMessage(days: number){
    this.eService.eFacturaMessageSend$.subscribe({
      next: (response) => {
        this.message = response
        this.messages = this.message.mesaje
      },
      error: (error)=> {
        console.log(error)
      }
    })
  }


  async showInvoice(id: string){
    this.eService.getInvoice(id).subscribe({
      next: async (response) => {
       this.eFactura = mergeProducts(response, this.ingrdients)
        const nulls = await this.actionSheet.openAdd(FacturaPage, this.eFactura, 'add-modal')
        if(!nulls){
          setTimeout(() => {
            console.log('hit timeout')
            this.eService.checkInvoiceStatus(getBillIds(this.message)).subscribe()
          }, 500)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }






  searchInvooice(ev: any){
    const input = ev.detail.value
    let filterData = this.messages.filter((object) =>
    object.detalii.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
    this.messages = filterData
    if(!input.length){
      this.messages = [ ...this.message.mesaje]
    }
  }

  async selectDays(){
    const days = await this.actionSheet.numberAlert('Alege numarul de zile', 'Alege numarul de zile pentru care vrei să faci interogarea!', 'val', 'Zile')
    if(days){
      this.eService.getMessages(days).subscribe()
    }
  }

formateDate(date: any){
  return formatedDateToShow(date)
}

  roundInHtml(num: number){
    return round(num)
  }
}
