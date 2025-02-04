import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { EService } from './e-factura.service';
import { Suplier } from 'src/app/models/suplier.model';
import { EFactura, EProduct, InvIngredient, messageEFactura, Nir } from 'src/app/models/nir.model';
import {  createNir, getBillIds, mergeProducts } from './e-factura.engine';
import { formatedDateToShow,  round } from 'src/app/shared/utils/functions';
import { IngredientService } from '../ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { IngredientsPage } from './ingredients/ingredients.page';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { SuplierPage } from '../CRUD/suplier/suplier.page';
import { NirsModalPage } from './nirs-modal/nirs-modal.page';
import { FacturaPage } from './factura/factura.page';

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
    @Inject(ActionSheetService) private actService: ActionSheetService,
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


  selectPeriod(){

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
        const nulls = await this.actService.openAdd(FacturaPage, this.eFactura, 'add-modal')
        if(!nulls){
          this.eService.checkInvoiceStatus(getBillIds(this.message)).subscribe()
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async selectIng(product: EProduct){
      const data = {
        name: product.name,
        um: product.unitCode,
        suplier: this.eFactura.supplier.name
      }
      const ing = await this.actService.openPayment(IngredientsPage, data)
      if(ing){
        this.eFactura = mergeProducts(this.eFactura, this.ingrdients)
      }

  }

   addNewNir(nir: Nir){
    Preferences.remove({key: 'nir'});
    Preferences.set({key: 'nir', value: JSON.stringify(nir)})
    setTimeout(() => {
      console.log('hit navigation process')
      this.router.navigateByUrl(`/nir/${nir._id}`)
    }, 500)
  }


 async createNewNir(){
    const nir = createNir(this.eFactura, this.supliers)
    if(nir && nir.nir && !nir.add){
      this.addNewNir(nir.nir)
    } else if(nir && !nir.nir && nir.add) {
      const suplier = await this.actService.openModal(SuplierPage, {cif: this.eFactura.supplier.vatNumber}, false)
      if(suplier){
        this.supliers.push(suplier)

        const nir = createNir(this.eFactura, this.supliers)
        if(nir && nir.nir && !nir.add){
          this.addNewNir(nir.nir)
        }
      }
    }
  }

 async merge(){
    const nir = createNir(this.eFactura, this.supliers)
    const suplierId = nir.nir?.suplier._id
    if(suplierId){
      const data = {id: suplierId, docNumber: this.eFactura.invoiceNumber, docDate: this.eFactura.issueDate, eFacturaID: this.eFactura.id}
      const nir = await this.actService.openPayment(NirsModalPage, data)
      this.eService.checkInvoiceStatus(getBillIds(this.message)).subscribe()
    }
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
    const days = await this.actService.numberAlert('Alege numarul de zile', 'Alege numarul de zile pentru care vrei să faci interogarea!', 'val', 'Zile')
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
