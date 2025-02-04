import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { EFactura, EProduct, InvIngredient, Nir } from 'src/app/models/nir.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { IngredientsPage } from '../ingredients/ingredients.page';
import { ckeckMessageStatus, createNir, getBillIds, mergeProducts } from '../e-factura.engine';
import { IngredientService } from '../../ingredient/ingredient.service';
import { Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { SupliersService } from '../../supliers/supliers.service';
import { Suplier } from 'src/app/models/suplier.model';
import { SuplierPage } from '../../CRUD/suplier/suplier.page';
import { EService } from '../e-factura.service';
import { NirsModalPage } from '../nirs-modal/nirs-modal.page';
import { NirPage } from '../../CRUD/nir/nir.page';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.page.html',
  styleUrls: ['./factura.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FacturaPage implements OnInit, OnDestroy {

  eFactura!: EFactura
  ingredients: InvIngredient[] = []

  ingSub!: Subscription
  supliersSub!: Subscription
  supliers: Suplier[] = []

  constructor(
    private navParams: NavParams,
    private suplService: SupliersService,
    private modalCtrl: ModalController,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    private ingredientsService: IngredientService,
    private eService: EService,
  ) { }

  ngOnInit() {
    this.getSupliers()
    this.getIngredients()
    this.getFactura()
  }

  ngOnDestroy(): void {
      if(this.ingSub){
        this.ingSub.unsubscribe()
      }
      if(this.supliersSub){
        this.supliersSub.unsubscribe()
      }
  }

  getFactura(){
    this.eFactura = this.navParams.get('options')
  }

  getIngredients(){
    this.ingredientsService.ingredientsSend$.subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients
      }
    })
  }

  getSupliers(){
    this.suplService.supliersSend$.subscribe({
      next: (supliers) => {
        this.supliers = supliers
      }
    })
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

    async selectIng(product: EProduct){
        const data = {
          name: product.name,
          um: product.unitCode,
          suplier: this.eFactura.supplier.name
        }
        const ing = await this.actionSheetService.openPayment(IngredientsPage, data)
        if(ing){
          this.eFactura = mergeProducts(this.eFactura, this.ingredients)
        }

    }


    async addNewNir(nir: Nir){
      Preferences.remove({key: 'nir'});
      Preferences.set({key: 'nir', value: JSON.stringify(nir)})
      const nulls = await this.actionSheetService.openAdd(NirPage, nir._id, 'add-modal')
      if(!nulls){
        this.close()
      }

    }

     async createNewNir(){
        const nir = createNir(this.eFactura, this.supliers)
        if(nir && nir.nir && !nir.add){
          this.addNewNir(nir.nir)
        } else if(nir && !nir.nir && nir.add) {
          const suplier = await this.actionSheetService.openModal(SuplierPage, {cif: this.eFactura.supplier.vatNumber}, false)
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
          const nir = await this.actionSheetService.openPayment(NirsModalPage, data)
          // this.checkInvoice(false)
        }
      }


        // checkInvoice(edit: boolean){
        //   this.eService.checkInvoiceStatus(getBillIds(this.message)).subscribe({
        //     next: (response) => {
        //       const msg = ckeckMessageStatus(this.message, response)
        //       this.message = msg
        //       if(edit){
        //         this.getSupliers()
        //       }
        //     },
        //     error: (error) => {
        //       console.log(error)
        //     }
        //   })
        // }

}
