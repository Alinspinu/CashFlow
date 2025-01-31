import { Injectable, Type } from '@angular/core';
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
import { Observable } from 'rxjs';
import { TogglePage } from '../office/shedule/toggle/toggle.page';
import { TogglePontPage } from '../office/pontaj/togglePont/toggle-pont.page';
import { UsersViewPage } from '../modals/users-view/users-view.page';
import { DepViewPage } from '../modals/dep-view/dep-view.page';
import { PaymentsPage } from '../office/pontaj/payments/payments.page';
import { HoursPage } from '../office/pontaj/hours/hours.page';
import { SelectInvPage } from '../reports/inventary/select-inv/select-inv.page';
import { RecordModalPage } from '../office/supliers/suplier/record-modal/record-modal.page';
import { SelectDataPage } from '../modals/select-data/select-data.page';
import { AddReportPage } from '../reports/add-report/add-report.page';
import { EntryViewPage } from '../modals/entry-view/entry-view.page';
import { CloseDayPage } from '../cash-control/close-day/close-day.page';
import { MonetarPage } from '../cash-control/monetar/monetar.page';
import { UploadLogPage } from '../reports/inventary/upload-log/upload-log.page';
import { IngredientContentPage } from '../office/ingredient/ingredient-content/ingredient-content.page';
import { RecordPage } from '../office/nirs/record/record.page';
import { IngredientsPage } from '../office/e-factura/ingredients/ingredients.page';
import { NirsModalPage } from '../office/e-factura/nirs-modal/nirs-modal.page';
import { AddPointModalPage } from '../office/sale-point/add-point-modal/add-point-modal.page';
import { ProductPage } from '../office/CRUD/product/product.page';
import { NirPage } from '../office/CRUD/nir/nir.page';



@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }

  async openModal(
    component: typeof PickOptionPage |
               typeof SuplierPage |
               typeof SubProductPage |
               typeof PaymentPage |
               typeof SuplierPage |
               typeof AddEmployeeDataPage |
               typeof HoursPage |
               typeof ProductIngredientPage |
               typeof PaymentsPage |
               typeof TogglePage |
               typeof EntryViewPage |
               typeof TogglePontPage |
               typeof AddToInventaryPage,
    options: any,
    sub: boolean,
               ) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: { options, sub},
      cssClass: 'crud-modal'
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  }


  async openSelect(
    component: typeof SelectDataPage |
               typeof RecordPage,
    options: any,
    mode: string,
               ) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: { options, mode},
      cssClass: 'billModal'
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
               typeof UsersViewPage |
               typeof AddToInventaryPage |
               typeof SelectInvPage |
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
               typeof CategoryPage |
               typeof AddEntryPage |
               typeof TipsPage |
               typeof AddIngredientPage |
               typeof TogglePage |
               typeof TogglePontPage |
               typeof DatePickerPage |
               typeof UsersViewPage |
               typeof DepViewPage |
               typeof SelectInvPage |
               typeof RecordModalPage |
               typeof AddReportPage |
               typeof EntryViewPage |
               typeof MonetarPage |
               typeof CloseDayPage |
               typeof DelProdViewPage |
               typeof IngredientContentPage |
               typeof UploadLogPage |
               typeof IngredientsPage |
               typeof NirsModalPage |
               typeof AddPointModalPage |
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
    ing: {um: string, name: string, hideTop: boolean, hideIng: boolean, imp: boolean}
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
      // backdropDismiss: false,
      // keyboardClose: true,
    });

    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  };



  async openAdd(
    component: typeof ProductPage | 
               typeof SubProductPage | 
               typeof AddIngredientPage | 
               typeof ProductIngredientPage | 
               typeof NirPage,
    options: any,
    clas: string
  ) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: {options: options},
      cssClass: clas
    });

    modal.present();
    const { data } = await modal.onDidDismiss();
    return data
  }






  async pickDiscountValue() {
    const alert = await this.alertController.create({
      header: 'PROCENT REDUCERE %',
      buttons: [
        {
          text: 'Renunță',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'Adaugă',
          role: 'confirm',
          cssClass: 'confirm'
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
          text: 'Renuță',
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
          cssClass: 'input',
          placeholder: 'Ex. Piese auto'
        }
    ],
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
          cssClass: 'confirm'
        },
      ],
      cssClass: "deleteAlert"
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
          role: 'fiscal',
          cssClass: 'confirm'
        },
        {
          text: 'NEFISCAL',
          role: 'nefiscal',
          cssClass: 'confirm'
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
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
        cssClass: 'confirm'
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
    header: 'ALEGE RESPONSABILUL DE PROTOCOL',
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
        cssClass: 'confirm'
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
    header: 'SCRIE MOTIVUL',
    buttons: [
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
        cssClass: 'cancel'
      },
      {
        text: 'CONFIRMĂ',
        role: 'confirm',
        cssClass: 'confirm'
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
      buttons: [
        {
          text: 'RENUNȚĂ',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'UNEȘTE',
          role: 'confirm',
          cssClass: 'confirm'
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
      buttons: [
        {
          text: 'RENUNTA',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'CONFIRMA',
          role: 'confirm',
          cssClass: 'confirm'
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
      header: 'ALEGE CANTITATEA',
      buttons: [
        {
          text: 'RENUNȚA',
          role: 'cancel',
          cssClass: 'cancel'
        },
        {
          text: 'ALEGE',
          role: 'confirm',
          cssClass: 'confirm'
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
          cssClass: 'confirm'
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

  async chooseCategory(options: {name: string, _id: string}[]) {
    const inputs = options.map(option => {
      return {
          label: option.name,
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
      cssClass: ['reprint-alert', 'suplier-alert']
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
        header: 'UNDE SERVIM?',
        buttons: [
          {
            text: 'TERASĂ',
            cssClass: 'cancel',
            handler: () => {
              observer.next({ inOrOut: 'TERASA' });
              observer.complete();
            }
          },
          {
            text: 'INTERIOR',
            cssClass: 'confirm',
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



  async entryAlert(options: string[], tip: string, title: string, message: string, cssClass: string, choise: string){
    const inputs = options.map(option => {
      return {
          label: option,
          type: `radio` as const,
          value: option,
          checked: option === choise


      };
  });
    const inputsC = options.map(option => {
      return {
          label: option,
          type: `checkbox` as const,
          value: option,
          checked: option === choise

      };
  });

    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Alege',
          role: 'confirm',
        },
      ],
      inputs: tip === 'radio' ? inputs : inputsC,
      cssClass: ['reprint-alert', cssClass],
      backdropDismiss: false,
      keyboardClose: false,
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm'){
      return result.data.values
    } else {
      return null
    }
  }


  async textAlert(title: string, message: string, name: string, label: string){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'ADAUGĂ',
          role: 'confirm',
        },
      ],
      inputs:[
        {
          name: name,
          label: label,
          type: 'text',
        },

      ],
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'reprint-alert'
    })
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm' && result.data.values) {
      return result.data.values.nr
    } else {
      return null
    }
  }

  async numberAlert(title: string, message: string, name: string, label: string){
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'ADAUGĂ',
          role: 'confirm',
        },
      ],
      inputs:[
        {
          name: name,
          label: label,
          type: 'number',
        },

      ],
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'reprint-alert'
    })
    await alert.present();
    const result = await alert.onDidDismiss();
    if(result.role === 'confirm' && result.data.values) {
      return result.data.values.val
    } else {
      return null
    }
  }


};
