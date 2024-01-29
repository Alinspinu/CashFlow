import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PickOptionPage } from '../modals/pick-option/pick-option.page';
import { SuplierPage } from '../office/CRUD/suplier/suplier.page';
import { PickQtyPage } from '../modals/pick-qty/pick-qty.page';
import { AddIngredientPage } from '../office/CRUD/add-ingredient/add-ingredient.page';
import { SubProductPage } from '../office/CRUD/sub-product/sub-product.page';
import { CategoryPage } from '../office/CRUD/category/category.page';
import { AuthPage } from '../auth/auth.page';
import { RegisterPage } from '../auth/register/register.page';
import { PaymentPage } from '../modals/payment/payment.page';
import { CustomerCheckPage } from '../modals/customer-check/customer-check.page';
import { CashbackPage } from '../modals/cashback/cashback.page';
import { DiscountPage } from '../modals/discount/discount.page';
import { AddEmployeeDataPage } from '../modals/add-employee-data/add-employee-data.page';
import { OrderViewPage } from '../reports/cash/order-view/order-view.page';
import { ProductIngredientPage } from '../office/CRUD/product-ingredient/product-ingredient.page';
import { CashInOutPage } from '../modals/cash-in-out/cash-in-out.page';
import { DatePickerPage } from '../modals/date-picker/date-picker.page';
import { AddEntryPage } from '../modals/add-entry/add-entry.page';
import { AddClientDiscountPage } from '../modals/add-client-discount/add-client-discount.page';
import { OrdersViewPage } from '../reports/cash/orders-view/orders-view.page';
import { OrderAppViewPage } from '../modals/order-app-view/order-app-view.page';
import { TipsPage } from '../modals/tips/tips.page';
import { AddProductDiscountPage } from '../modals/add-product-discount/add-product-discount.page';
import { DelProdViewPage } from '../reports/cash/del-prod-view/del-prod-view.page';



@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }

  async openModal(
    component: typeof PickOptionPage |
               typeof SuplierPage |
               typeof AddIngredientPage |
               typeof SubProductPage |
               typeof CategoryPage |
               typeof PaymentPage |
               typeof SuplierPage |
               typeof AddEmployeeDataPage |
               typeof ProductIngredientPage,
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
               typeof OrderViewPage |
               typeof CashInOutPage |
               typeof AddClientDiscountPage |
               typeof AddProductDiscountPage |
               typeof OrdersViewPage |
               typeof OrderAppViewPage |
               typeof DelProdViewPage,
    options: any
  ){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {options: options},
      backdropDismiss: false,
      cssClass: 'billModal',

    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  }

  async pickQty(
    component: typeof PickQtyPage,
    ing: {um: string, name: string, hideTop: boolean, hideIng: boolean}
  ){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps:  {ing: ing}
    });
    modal.present();
    const {data} = await modal.onDidDismiss();
    return data
  }


  async openAuth(
    component: typeof AuthPage |
               typeof RegisterPage |
               typeof DatePickerPage |
               typeof AddEntryPage |
               typeof TipsPage,
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






  async pickDiscountValue() {
    const alert = await this.alertController.create({
      header: 'Procent Discount %',
      buttons: [
        {
          text: 'Renunță',
          role: 'cancel',
        },
        {
          text: 'Adaugă',
          role: 'confirm',
        },
      ],
      inputs:[
        {
        name: 'discount',
        type: 'number',
        placeholder: 'Ex. 10 pentru 10%',
        cssClass: 'custom-input',

      },
    ],
      cssClass: 'discountAlert'
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === "confirm"){
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



  async deleteAlert(message: string, title: string){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Renunță',
          role: 'cancel'
        },
        {
          text: 'Confirm',
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


async reasonAlert(title: string, message: string, label: string){
  const alert = await this.alertController.create({
    header: title,
    message: message,
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
      },
    ],
    inputs: [
      {
      name: 'reason',
      type: 'text',
      placeholder: label

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
          text: 'Renunța',
          role: 'cancel',
          cssClass: 'cancel'
        },
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
          text: 'RENUNȚĂ',
          role: 'cancel',
        },
        {
          text: 'UNEȘTE',
          role: 'confirm',
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
          text: 'RENUNTA',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'CONFIRMA',
          role: 'confirm',
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

      ],
      cssClass: 'extraAlert'
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


};
