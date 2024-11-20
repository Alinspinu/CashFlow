import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EService } from './e-factura.service';
import { Suplier } from 'src/app/models/suplier.model';
import { EFactura, EProduct, InvIngredient, messageEFactura } from 'src/app/models/nir.model';
import { SupliersService } from '../supliers/supliers.service';
import { createNir, editMessage, mergeProducts } from './e-factura.engine';
import { round } from 'src/app/shared/utils/functions';
import { IngredientService } from '../ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { IngredientsPage } from './ingredients/ingredients.page';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

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
        this.getMessage()
      }
    })
  }


  getMessage(){
    this.eService.getMessages(10).subscribe({
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
      //  console.log(response)
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
      console.log(data)
      const ing = await this.actService.openPayment(IngredientsPage, data)
      if(ing){
        console.log(ing)
        this.eFactura = mergeProducts(this.eFactura, this.ingrdients)
      }
    } else {

    }

  }

  createNewNir(){
    const nir = createNir(this.eFactura, this.supliers)
    if(nir){
      Preferences.remove({key: 'nir'});
      Preferences.set({key: 'nir', value: JSON.stringify(nir)})
      this.router.navigateByUrl(`/tabs/office/nir/${nir._id}`)
    }
  }



  roundInHtml(num: number){
    return round(num)
  }
}
