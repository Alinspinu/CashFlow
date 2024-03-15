import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CustomerCheckService } from './customer-check.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import User from 'src/app/auth/user.model';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

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
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CustomerCheckPage implements OnInit {

  searchCustomerForm!: FormGroup;
  addCustomerForm!: FormGroup;

  addClientMode: boolean = false
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
        console.log(response)
        this.customer = response.customer
      }
    }, error => {
      if(error){
        showToast(this.toastCtrl, error.error.message, 4000, 'error-toast')
      }
    })
  }
}

addCustomerToBill(){
  if(this.customer){
    console.log(this.customer)
    this.modalCtrl.dismiss(this.customer)
  }
}

setMode(){
  this.addClientMode = !this.addClientMode
}

addClient(){
  if(this.addCustomerForm.valid){
    const email = this.addCustomerForm.value.email
    const name = this.addCustomerForm.value.name
    const cardIndex = this.addCustomerForm.value.cardCode ? this.addCustomerForm.value.cardCode : 0
    console.log(this.user.locatie)
      this.customerSrv.createCustomer(name, email, cardIndex, this.user.locatie).subscribe(res => {
        if(res.message === "All good"){
            showToast(this.toastCtrl, `Un email a fost trimis la ${email} pentru a completa înregistrarea!`, 5000, 'success-toast')
            this.customer = res.customer
            this.customer.userId = res.customer._id
            this.modalCtrl.dismiss(this.customer)
            console.log(this.customer)
          } else if(res.message === 'Acest email există deja în baza de date!' || res.message === "Utilizatorului i s-a adaugat cadrul la cont"){
            showToast(this.toastCtrl, res.message , 3000, 'error-toast')
            this.customer = res.customer
            console.log(this.customer)
          this.customer.userId = res.customer._id
          this.addClientMode = false
        }
      })
  }

}

}
