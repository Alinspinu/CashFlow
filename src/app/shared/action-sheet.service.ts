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
import { TogglePontPage } from '../office/pontaj/togglePont/toggle-pont.page';
import { PaymentsPage } from '../office/pontaj/payments/payments.page';
import { HoursPage } from '../office/pontaj/hours/hours.page';
import { TogglePage } from '../office/shedule/toggle/toggle.page';
import { RecordModalPage } from '../office/supliers/suplier/record-modal/record-modal.page';
import { AddToInventaryPage } from '../modals/add-to-inventary/add-to-inventary.page';
import { StartUrlPage } from '../modals/start-url/start-url.page';
import { SelectInvPage } from '../reports/inventary/select-inv/select-inv.page';
import { AddReportPage } from '../reports/add-report/add-report.page';
import { DepViewPage } from '../modals/dep-view/dep-view.page';
import { UsersViewPage } from '../modals/users-view/users-view.page';
import { SelectDataPage } from '../modals/select-data/select-data.page';
import { NewSheetModalPage } from '../office/out-ing/new-sheet-modal/new-sheet-modal.page';




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
               typeof PaymentsPage |
               typeof HoursPage |
               typeof TogglePage |
               typeof AddIngredientPage |
               typeof TogglePontPage |
               typeof AddEmployeeDataPage |
               typeof AddToInventaryPage |
               typeof NewSheetModalPage |
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

  async openSelect(
    component: typeof SelectDataPage,
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
               typeof AddEntryPage |
               typeof CategoryPage |
               typeof OrderAppViewPage |
               typeof TipsPage |
               typeof RecordModalPage |
               typeof AddIngredientPage |
               typeof SelectInvPage |
               typeof DatePickerPage |
               typeof AddReportPage |
               typeof DepViewPage |
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
               typeof StartUrlPage |
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
async payAlert(title: string, message: string, label: string){
  const alert = await this.alertController.create({
    header: title,
    message: message,
    buttons: [
      {
        text: 'BANCA',
        role: 'banca',
      },
      {
        text: 'RENUNȚĂ',
        role: 'cancel',
      },
      {
        text: 'CASH',
        role: 'confirm',
      },
    ],
    inputs: [
      {
      name: 'doc',
      type: 'text',
      placeholder: label

    },
  ],
    cssClass: 'deleteAlert'
  });
  await alert.present();
  const result = await alert.onDidDismiss();
  if(result.role === 'confirm' && result.data.values) {
    return result.data.values.doc
  } else if(result.role === 'banca') {
    return 'banca'
  }else {
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
      cssClass: 'reptint-alert'
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
      cssClass: 'deleteAlert'
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

  async download() {
    const alert = await this.alertController.create({
      header: 'Alege',
      message: `Alege o opțiune`,
      buttons: [
        {
          text: 'Renunță',
          role: 'canncel',
        },
        {
          text: 'Alege',
          role: 'confirm',
        },
      ],
      inputs: [
        {
          label: 'Produse',
          type: 'radio',
          value: 'products',
          cssClass: 'option'
        },
        {
          label: 'Consum',
          type: 'radio',
          value: 'consumption',
          cssClass: 'option'
        },
        {
          label: 'Productie',
          type: 'radio',
          value: 'production',
          cssClass: 'option'
        },
      ],
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


};
