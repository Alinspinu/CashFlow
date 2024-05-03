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
import { ScanQrPage } from '../modals/scan-qr/scan-qr.page';
import { AddToInventaryPage } from '../modals/add-to-inventary/add-to-inventary.page';
import { BehaviorSubject, Observable } from 'rxjs';



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
               typeof ProductIngredientPage |
               typeof AddToInventaryPage,
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

 async openMobileModal(
    component: typeof PickOptionPage |
               typeof PaymentPage |
               typeof CustomerCheckPage |
               typeof OrderViewPage |
               typeof OrderAppViewPage |
               typeof CashbackPage,
    options: any,
    sub: boolean
  ){
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {options: options, sub: sub},
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
               typeof AddEntryPage |
               typeof TipsPage |
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
               typeof ScanQrPage |
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
          cssClass: 'cancel'
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
          role: 'cancel',
          cssClass: 'cancel'
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
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
        },
      ],
      cssClass: "reprint-alert"
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return true
    } else {
      return false
    }
  }


  async reprintAlert(){
    const alert = await this.alertController.create({
      header: 'RETIPĂRIRE!',
      message: 'Retipărește nota de plată!',
      buttons: [
        {
          text: 'RENUNTA',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'FSICAL',
          role: 'fiscal'
        },
        {
          text: 'NEFISCAL',
          role: 'nefiscal',
        },
      ],
      cssClass: "reprint-alert"
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    return result
  }


async reasonAlert(title: string, message: string, label: string){
  const alert = await this.alertController.create({
    header: title,
    message: message,
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
      },
    ],
    inputs: [
      {
      name: 'Deprecieri',
      label: 'Deprecieri',
      type: 'radio',
      value: 'dep',
    },
      {
      name: 'Produs realizat incorect ce trebuie refacut!',
      label: 'Produs realizat incorect ce trebuie refacut!',
      type: 'radio',
      value: 'Produs realizat incorect ce trebuie refacut',
    },
      {
      name: 'Clientul s-a răzgandit!',
      label: 'Clientul s-a răzgandit!',
      type: 'radio',
      value: 'Clientul s-a răzgandit',
    },
      {
      name: 'Protocol',
      label: 'Protocol',
      type: 'radio',
      value: 'protocol',
    },
      {
      name: 'Altele',
      label: 'Altele....',
      type: 'radio',
      value: 'altele',
    },

  ],
    cssClass: 'reprint-alert'
  });
  await alert.present();
  const result = await alert.onDidDismiss();
  if(result.role === 'confirm' && result.data.values) {
    return result.data.values
  } else {
    return null
  }
}


async protocolAlert(){
  const alert = await this.alertController.create({
    header: 'PROTOCOL',
    message: 'Alege responsabilul de protocol',
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
      },
    ],
    inputs:[
      {
        name: 'Bighiu Sergiu',
        label: 'Bighiu Sergiu',
        type: 'radio',
        value: 'Bighiu Sergiu',
      },
      {
        name: 'Adrian Piticariu',
        label: 'Adrian Piticariu',
        type: 'radio',
        value: 'Adrian Piticariu',
      },
      {
        name: 'Alin Spinu',
        label: 'Alin Spinu',
        type: 'radio',
        value: 'Alin Spinu',
      },

    ],
    cssClass: 'reprint-alert'
  })
  await alert.present();
  const result = await alert.onDidDismiss();
  if(result.role === 'confirm' && result.data.values) {
    return result.data.values
  } else {
    return null
  }
}


async detailsAlert(){
  const alert = await this.alertController.create({
    header: 'ALT MOTIV',
    message: 'Scrie motivul pentru care ștergi produsul!',
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
      },
    ],
    inputs:[
      {
        name: 'motiv',
        label: 'Scrie Motivul',
        type: 'text',
        placeholder: 'Scrie Motivul',
      },

    ],
    cssClass: 'reprint-alert'
  })
  await alert.present();
  const result = await alert.onDidDismiss();
  if(result.role === 'confirm' && result.data.values) {
    return result.data.values.motiv
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
          text: 'Cu întoarcere',
          role: 'confirm-1',
          cssClass: 'inStoc'
        },
        {
          text: 'Fara întoarcere',
          role: 'confirm-2',
          cssClass: 'outStoc',
        },
      ],
      inputs: inputs,
      cssClass: 'reprint-alert'
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
          cssClass: 'cancel'
        },
        {
          text: 'UNEȘTE',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'reprint-alert'
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
      cssClass: 'reprint-alert'
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
          text: 'RENUNȚA',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'ALEGE',
          role: 'confirm',
        },

      ],
      inputs: inputs,
      cssClass: 'reprint-alert'
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
          text: 'RENUNȚĂ',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'CONFIRM',
          role: 'confirm',
        },
      ],
      inputs: inputs,
      cssClass: 'reprint-alert'
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


  chosseInOrOut(): Observable<any> {
    return new Observable<any>((observer) => {
      this.alertController.create({
        header: 'ALEGE LOC',
        message: `UNDE SERVIM?`,
        buttons: [
          {
            text: 'TERASĂ',
            handler: () => {
              observer.next({ inOrOut: 'TERASA' });
              observer.complete();
            }
          },
          {
            text: 'INTERIOR',
            handler: () => {
              observer.next({ inOrOut: 'INTERIOR' });
              observer.complete();
            }
          }
        ],
        cssClass: 'reprint-alert'
      }).then((alert) => {
        alert.present();
      });
    });
  }


};
