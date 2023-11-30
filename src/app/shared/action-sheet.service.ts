import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { PickOptionPage } from '../modals/pick-option/pick-option.page';
import { SuplierPage } from '../office/CRUD/suplier/suplier.page';
import { PickQtyPage } from '../modals/pick-qty/pick-qty.page';
import { IngredientPage } from '../office/CRUD/ingredient/ingredient.page';
import { SubProductPage } from '../office/CRUD/sub-product/sub-product.page';
import { CategoryPage } from '../office/CRUD/category/category.page';



@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }



  async openModal(
    component: typeof PickOptionPage |
               typeof SuplierPage |
               typeof IngredientPage |
               typeof SubProductPage |
               typeof CategoryPage,
    options: any,
    sub: boolean
               ) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {options: options, sub: sub},
      cssClass: 'crud-modal'
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  }

  async pickQty(
    component: typeof PickQtyPage,
    ing: {um: string, name: string}
  ){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps:  {ing: ing}
    });
    modal.present();
    const {data} = await modal.onDidDismiss();
    return data
  }




  async chooseSubProduct(options: string[]) {
    const inputs = options.map(option => {
      return {
          label: option,
          type: 'radio' as const,
          value: option,
          cssClass: 'option'
      };
  });
    const alert = await this.alertController.create({
      header: 'Alege',
      message: `Alege o opțiune`,
      buttons: [
        {
          text: 'Alege',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'extraAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm"){
      return result.data.values
    } else {
      return null
    }
  }

  async chooseExtra(options: string[]) {
    const inputs = options.map(option => {
      return {
          label: option,
          type: 'checkbox' as const,
          value: option,

      };
  });
    const alert = await this.alertController.create({
      header: 'Extra',
      message: `Adaugă extra`,
      buttons: [
        {
          text: 'Nu Muțumesc!',
          role: 'cancel'
        },
        {
          text: 'Adaugă',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'extraAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return result.data.values
    } else {
      return null
    }
  }

  async addMainCat() {
    const alert = await this.alertController.create({
      header: 'Alege Nume',
      message: `Adaugă Categorie Părinte`,
      buttons: [
        {
          text: 'Nu Muțumesc!',
          role: 'cancel'
        },
        {
          text: 'Adaugă',
          role: 'confirm',
        },
      ],
      inputs: [
        {
          label: 'Alege Nume',
          type: 'text',
        }
    ],
      cssClass: 'extraAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return result.data.values
    } else {
      return null
    }
  }






};
