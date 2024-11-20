import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EService } from './e-factura.service';
import { Suplier } from 'src/app/models/suplier.model';
import { EFactura, EProduct, InvIngredient, messageEFactura, Nir } from 'src/app/models/nir.model';
import { SupliersService } from '../supliers/supliers.service';
import { createNir, editMessage, mergeProducts } from './e-factura.engine';
import { round } from 'src/app/shared/utils/functions';
import { IngredientService } from '../ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { IngredientsPage } from './ingredients/ingredients.page';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { SuplierPage } from '../CRUD/suplier/suplier.page';

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

  ingSub!: Subscription

  ingrdients: InvIngredient[] = []

  constructor(
    private eService: EService,
    private suplService: SupliersService,
    private ingService: IngredientService,
    @Inject(ActionSheetService) private actService: ActionSheetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getIngredients()
  }


  ngOnDestroy(): void {
    if(this.ingSub){
      this.ingSub.unsubscribe()
    }
  }


  getIngredients(){
    this.ingSub = this.ingService.ingredientsSend$.subscribe({
      next: (response) => {
        this.ingrdients = response.filter(i => !i.productIngredient)
        this.getMessage(10)
      }
    })
  }


  getMessage(days: number){
    this.eService.getMessages(days).subscribe({
      next: (response) => {
        this.message = response
        this.getSupliers()
      },
      error: (error)=> {
        console.log(error)
      }
    })
  }

  getSupliers(){
    this.suplService.getSupliers().subscribe({
      next: (response) => {
        this.supliers = response
        this.message.mesaje.reverse()
        this.messages = this.message.mesaje
        this.message = editMessage(this.message, this.supliers)
 
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  showInvoice(id: string){
    this.eService.getInvoice(id).subscribe({
      next: (response) => {
       this.eFactura = mergeProducts(response, this.ingrdients)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  async selectIng(product: EProduct){
    if(product.ingUm === '-'){
      const data = {
        name: product.name,
        um: product.unitCode,
        suplier: this.eFactura.supplier.name
      }
      const ing = await this.actService.openPayment(IngredientsPage, data)
      if(ing){
        this.eFactura = mergeProducts(this.eFactura, this.ingrdients)
      }
    } else {

    }

  }

   addNewNir(nir: Nir){
    Preferences.remove({key: 'nir'});
    Preferences.set({key: 'nir', value: JSON.stringify(nir)})
    setTimeout(() => {
      this.router.navigateByUrl(`/tabs/office/nir/${nir._id}`)
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
      this.getMessage(days)
    }
  }



  roundInHtml(num: number){
    return round(num)
  }
}
