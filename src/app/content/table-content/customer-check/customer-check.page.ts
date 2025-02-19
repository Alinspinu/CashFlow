import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CustomerCheckService } from './customer-check.service';
import { showLoading, showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { ScanQrPage } from '../../../modals/scan-qr/scan-qr.page';
import { AddCustomerPage } from './add-customer/add-customer.page';

 export interface Customer{
  userId: string
  name: string,
  email: string,
  telephone: string,
  cashBack: number,
  discount: number,
}

@Component({
  selector: 'app-customer-check',
  templateUrl: './customer-check.page.html',
  styleUrls: ['./customer-check.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CapitalizePipe]
})
export class CustomerCheckPage implements OnInit {

  searchCustomerForm!: FormGroup;

  addClientMode: boolean = false
  addVoucherMode: boolean = false



  checkForm!: FormGroup

  voucher!: any
  checkMode: boolean = true


  foundClient: boolean = false
  search: boolean = true
  customer!: Customer
  user!: User

  voucherMode: boolean = true
  clientMode: boolean = false

  response: any = undefined

  constructor(
   @Inject(CustomerCheckService) private customerSrv: CustomerCheckService,
   @Inject(ActionSheetService) private actSrv: ActionSheetService,
   private loadingCtrl: LoadingController,
   private toastCtrl: ToastController,
   private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getUser()
    this.setUpSearchForm()
    this.setUpCheckForm()
  }

  dismissModal(){
    this.modalCtrl.dismiss(null)
  }

  getUser(){
    Preferences.get({key:'authData'}).then(data => {
      if(data.value){
        this.user = JSON.parse(data.value)
      }
    })
  }




  setUpSearchForm(){
    this.searchCustomerForm = new FormGroup({
      customerId: new FormControl(null, {
        updateOn: 'change',
      }),
      email: new FormControl(null, {
        updateOn: 'change',
      }),
    });
  }

  setUpCheckForm(){
    this.checkForm = new FormGroup({
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  }

searchCustomer(mode: string){
  let customerId: string | undefined = undefined
  if(mode === 'card'){
    customerId = this.searchCustomerForm.value.customerId
    this.searchCustomerForm.get('customerId')?.setValue(undefined)
  } else {
    customerId = this.searchCustomerForm.value.email
    this.searchCustomerForm.get('email')?.setValue(undefined)
  }
  if(customerId){
    showLoading(this.loadingCtrl, 'Cautare...')
    this.customerSrv.searchCustomer(customerId, mode).subscribe(response => {
      if(response.message === "All good"){
        this.customer = response.customer
        this.loadingCtrl.dismiss()
        this.response = {
          title: 'Valid',
          message: "Clientul a fost găsit in baza de date.",
          client: true,
          info: [
            {
              label: 'Nume',
              value: this.customer.name,
            },
            {
              label: 'E-mail',
              value: this.customer.email,
            },
            {
              label: 'Cash Back',
              value: this.customer.cashBack + ' Lei',
            }
          ],
        }
      }
    }, error => {
      if(error){
        this.loadingCtrl.dismiss()
        this.response = {
          title: 'Invalid',
          message: "Clientul nu a fost găsit în baza de date.",
          client: false,
          info: [
            {
              label: 'EROARE',
              value: 'Încercă din nou!',
            },
          ],
        }
      }
    })
  } else {
    showToast(this.toastCtrl, 'Introdu adresa de email a clientului sau scanează cardul!', 4000)
  }
}

addCustomerToBill(){
  if(this.customer){
    this.modalCtrl.dismiss({data: this.customer, message:'client'})
  }
}

async scanQr(mode: string){
  if(mode === "client"){
    const code = await this.actSrv.openAuth(ScanQrPage)
    if(code){
      this.searchCustomerForm.get('customerId')?.setValue(code)
    }
  }
  if(mode === 'voucher'){
    const code = await this.actSrv.openAuth(ScanQrPage)
    if(code){
      this.checkForm.get('code')?.setValue(code)
    }
  }
}


checkVoucher(){
  if(this.checkForm.valid){
    const code = this.checkForm.value.code
    if(code){
      showLoading(this.loadingCtrl, 'Cautare...')
      this.customerSrv.verfyVoucher(code).subscribe({
        next: (response) => {
        if(response){
          this.loadingCtrl.dismiss()
          this.voucher = response.voucher
          showToast(this.toastCtrl, response.message, 3000)
          this.response = {
            title: response.voucher.status,
            message: "Voucherul a fost găsit în vaza de date.",
            client: false,
            info: [
              {
                label: 'Status',
                value: response.voucher.status,
              },
              {
                label: 'Valoare',
                value: response.voucher.value + ' Lei',
              }
            ],
          }
        }
      },
    error: (error) => {
      console.log(error)
      this.loadingCtrl.dismiss()
      this.response = {
        title: 'Eroare',
        message: "Voucherul nu a fost găsit",
        client: false,
        info: [
          {
            label: 'EROARE',
            value: 'Încercă din nou!',
          },
        ],
      }
    }
    })
    }
  } else {
    showToast(this.toastCtrl, 'Introdu sau scanează codul voucherului!', 4000)
  }
}



useVoucher(){
  this.customerSrv.useVoucher(this.voucher._id).subscribe(response => {
    if(response){
      this.modalCtrl.dismiss({message:'voucher', data: this.voucher.value})
    }
  })
}



async add(){
  const choise = await this.actSrv.entryAlert(['Client', 'Voucher'], 'radio', 'Alege', 'Adaugă un client nou sau crează un voucher.', '', '')
  if(choise && choise === 'Client'){
    const customer = await this.actSrv.openAdd(AddCustomerPage, false, 'medium-one') as Customer
    if(customer){
      this.modalCtrl.dismiss({data: customer, message: 'client'})
    }
  }
  if(choise && choise  === 'Voucher'){
    const voucher = await this.actSrv.openAdd(AddCustomerPage, true, 'medium-one')
    if(voucher){
      this.modalCtrl.dismiss({data: voucher, message: 'voucher'})
    }
  }
}



}
