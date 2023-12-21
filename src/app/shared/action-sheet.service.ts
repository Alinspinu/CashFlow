import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PickOptionPage } from '../modals/pick-option/pick-option.page';
import { SuplierPage } from '../office/CRUD/suplier/suplier.page';
import { PickQtyPage } from '../modals/pick-qty/pick-qty.page';
import { IngredientPage } from '../office/CRUD/ingredient/ingredient.page';
import { SubProductPage } from '../office/CRUD/sub-product/sub-product.page';
import { CategoryPage } from '../office/CRUD/category/category.page';
import { AuthPage } from '../auth/auth.page';
import { RegisterPage } from '../auth/register/register.page';
import { PaymentPage } from '../modals/payment/payment.page';
import { CustomerCheckPage } from '../modals/customer-check/customer-check.page';
import { CashbackPage } from '../modals/cashback/cashback.page';
import { DiscountPage } from '../modals/discount/discount.page';
import { AddEmployeeDataPage } from '../modals/add-employee-data/add-employee-data.page';
import { OrderViewPage } from '../modals/order-view/order-view.page';



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
               typeof CategoryPage |
               typeof PaymentPage |
               typeof SuplierPage |
               typeof AddEmployeeDataPage,
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

  async openPayment(
    component: typeof PaymentPage |
               typeof CustomerCheckPage |
               typeof CashbackPage |
               typeof DiscountPage |
               typeof AddEmployeeDataPage |
               typeof OrderViewPage,
    options: any
  ){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {options: options},
      cssClass: 'billModal'
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

  async openAuth(
    component: typeof AuthPage |
               typeof RegisterPage
                ) {
    const modal = await this.modalCtrl.create({
      component: component,
      backdropDismiss: false,
      keyboardClose: false,
    });

    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  };


  async deleteAlert(message: string){
    const alert = await this.alertController.create({
      header: 'Șterge!',
      message: message,
      buttons: [
        {
          text: 'Renunță',
          role: 'cancel'
        },
        {
          text: 'Șterge',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return true
    } else {
      return false
    }
  }


async reasonAlert(){
  const alert = await this.alertController.create({
    header: 'MOTIVUL ȘTERGERII',
    message: `Scrie motivul pentru care produsul este șters!`,
    buttons: [
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
      },
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
      },
    ],
    inputs: [
      {
      name: 'reason',
      type: 'text',
      placeholder: 'Scrie motivul'

    },
  ],
    cssClass: 'deleteAlert'
  });
  await alert.present();
  const result = await alert.onDidDismiss();
  if(result.role === 'confirm' && result.data.values) {
    return result.data.values.reason
  } else {
    return null
  }
}

  async deleteBillProduct(options: string[]) {
    const inputs = options.map((option, index) => {
      return {
          label: option + ' Buc',
          type: 'radio' as const,
          value: option,
          cssClass: 'option',
          checked: index === 0,
      };
  });
    const alert = await this.alertController.create({
      header: 'Sterge produs',
      message: `Alege cantitatea`,
      buttons: [
        {
          text: 'Cu întoarcere în stoc',
          role: 'confirm-1',
          cssClass: 'inStoc'
        },
        {
          text: 'Fara întoarcere în stoc',
          role: 'confirm-2',
          cssClass: 'outStoc',
        },
        {
          text: 'Renunța',
          role: 'cancel',
          cssClass: 'cancel'
        },
      ],
      inputs: inputs,
      cssClass: 'deleteAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm-1" && result.data.values){
      return { qty: result.data.values, upload: true }
    } else if(result.role === "confirm-2" && result.data.values) {
      return { qty: result.data.values, upload: false }
    } else {
      return null
    }
  }



  async mergeOreders(options: {name: string, data: {id: string, billIndex: number}}[]) {
    const inputs = options.map(option => {
      return {
          label: option.name,
          type: 'checkbox' as const,
          value: option.data,
          // cssClass: 'option'
      };
  });
    const alert = await this.alertController.create({
      header: 'Unește comenzile',
      message: `Alege comenzile`,
      buttons: [
        {
          text: 'UNEȘTE',
          role: 'confirm',
        },
        {
          text: 'RENUNȚĂ',
          role: 'cancel',
        },
      ],
      inputs: inputs,
      // cssClass: 'deleteAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm" && result.data.values){
      return  result.data.values
    } else {
      return null
    }
  }


  async deleteBill() {
    const alert = await this.alertController.create({
      header: 'ȘTERGE COMANDA',
      message: `Esi sigur?`,
      buttons: [
        {
          text: 'CONFIRMA',
          role: 'confirm',
        },
        {
          text: 'RENUNTA',
          role: 'cancel',
          cssClass: 'cancel'
        },
      ],
      inputs: [
        {
          label: "Cu întoarcere în stoc",
          type: "radio",
          value: "yes"
        },
        {
          label: "Fără întoarcere în stoc",
          type: "radio",
          value: "no"
        },

      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm" && result.data.values === 'yes'){
      return { upload: true }
    } else if (result.role === "confirm" && result.data.values === 'no'){
      return { upload: false }
    }else {
      return null
    }
  }



  async breakBillProduct(options: number[]) {
    const inputs = options.map(option => {
      return {
          label: option + ' Buc',
          type: 'radio' as const,
          value: option,
          cssClass: 'option'
      };
  });
    const alert = await this.alertController.create({
      header: 'SEPARĂ PRODUSE',
      message: `Alege cantitatea`,
      buttons: [
        {
          text: 'ALEGE',
          role: 'confirm',
        },
        {
          text: 'RENUNȚA',
          role: 'cancel',
          cssClass: 'cancel'
        },
      ],
      inputs: inputs,
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm" && result.data.values){
      return result.data.values
    } else {
      return null
    }
  }


  async mergeOredersProducts(options: {name: string,  billIndex: number}[]) {
    const inputs = options.map(option => {
      return {
          label: option.name,
          type: 'checkbox' as const,
          value: option,
      };
  });
    const alert = await this.alertController.create({
      header: 'SEPARĂ',
      message: `Alege comanda`,
      buttons: [
        {
          text: 'CONFIRM',
          role: 'confirm',
        },
        {
          text: 'RENUNȚĂ',
          role: 'cancel',
        },
      ],
      inputs: inputs,
      // cssClass: 'deleteAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm" && result.data.values){
      return  result.data.values[0].billIndex
    } else {
      return null
    }
  }


};
