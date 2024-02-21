import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CustomerCheckService } from './customer-check.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';

 export interface Customer{
  userId: string
  name: string,
  email: string,
  telephone: string,
  cashBack: number
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
  addCustomerForm!: FormGroup;

  addClientMode: boolean = false
  addVoucherMode: boolean = false


  voucherForm!: FormGroup
  checkForm!: FormGroup

  voucher!: any
  checkMode: boolean = true


  foundClient: boolean = false
  search: boolean = true
  customer!: Customer
  user!: User

  constructor(
   @Inject(CustomerCheckService) private customerSrv: CustomerCheckService,
   private toastCtrl: ToastController,
   private modalCtrl: ModalController,
   private router: Router
  ) { }

  ngOnInit() {
    this.getUser()
    this.setUpSearchForm()
    this.setUpAddForm()
    this.setUpCheckForm()
    this.setUpVoucherForm()
  }

  dismissModal(){
    this.modalCtrl.dismiss(null)
  }

  getUser(){
    Preferences.get({key:'authData'}).then(data => {
      if(data.value){
        this.user = JSON.parse(data.value)
        console.log(this.user)
      } else {
        this.router.navigateByUrl('/auth')
      }
    })
  }

  setUpAddForm(){
    this.addCustomerForm = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      cardCode: new FormControl(null, {
        updateOn: 'change',
      }),
    })
  }


  setUpSearchForm(){
    this.searchCustomerForm = new FormGroup({
      customerId: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  }

searchCustomer(){
  const customerId = this.searchCustomerForm.value.customerId
  if(customerId){
    this.customerSrv.searchCustomer(customerId, this.user.locatie).subscribe(response => {
      if(response.message === "All good"){
        this.customer = response.customer
      }
    }, error => {
      if(error){
        showToast(this.toastCtrl, error.error.message, 4000)
      }
    })
  }
}

addCustomerToBill(){
  if(this.customer){
    this.modalCtrl.dismiss({data: this.customer, message:'client'})
  }
}

setClientMode(){
  this.addClientMode = !this.addClientMode
}

setVoucherMode(){
  this.addVoucherMode = !this.addVoucherMode
}

addClient(){
  if(this.addCustomerForm.valid){
    const email = this.addCustomerForm.value.email
    const name = this.addCustomerForm.value.name
    const cardIndex = this.addCustomerForm.value.cardCode ? this.addCustomerForm.value.cardCode : 0
      this.customerSrv.createCustomer(name, email, cardIndex, this.user.locatie).subscribe(res => {
        if(res.message === "All good"){
            showToast(this.toastCtrl, `Un email a fost trimis la ${email} pentru a completa înregistrarea!`, 5000)
            this.customer = res.customer
            this.customer.userId = res.customer._id
            this.modalCtrl.dismiss({data: this.customer, message:'client'})
          } else if(res.message === 'Acest email există deja în baza de date!' || res.message === "Utilizatorului i s-a adaugat cadrul la cont"){
            showToast(this.toastCtrl, res.message , 3000)
            this.customer = res.customer
          this.customer.userId = res.customer._id
          this.addClientMode = false
        }
      })
  }

}



addVoucher(){
  if(this.voucherForm.valid){
    const code = this.voucherForm.value.code
    const value = this.voucherForm.value.value
    this.customerSrv.saveVoucher(code, +value).subscribe(response => {
      if(response){
        showToast(this.toastCtrl, response.message, 5000)
        this.voucherForm.reset()
      }
    })
  }
}

tryAgain(){
 this.voucher = null
}


checkVoucher(){
  if(this.checkForm.valid){
    const code = this.checkForm.value.code
    this.customerSrv.verfyVoucher(code).subscribe(response => {
      if(response){
        this.voucher = response.voucher
        showToast(this.toastCtrl, response.message, 5000)
        this.checkForm.reset()
      }
    })
  }
}


setUpVoucherForm(){
  this.voucherForm = new FormGroup({
    code: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required]
    }),
    value: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.required]
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

useVoucher(id: string, value: number){
  console.log(value)
  this.customerSrv.useVoucher(id).subscribe(response => {
    if(response){
      this.modalCtrl.dismiss({message:'voucher', data: value})
    }
  })
}




}
