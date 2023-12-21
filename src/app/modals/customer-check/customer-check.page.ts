import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CustomerCheckService } from './customer-check.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

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

  constructor(
   @Inject(CustomerCheckService) private customerSrv: CustomerCheckService,
   private toastCtrl: ToastController,
   private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.setUpSearchForm()
    this.setUpAddForm()
  }

  dismissModal(){
    this.modalCtrl.dismiss(null)
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
    this.customerSrv.searchCustomer(customerId).subscribe(response => {
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
      this.customerSrv.createCustomer(name, email).subscribe(res => {
        if(res.message === "All good"){
            showToast(this.toastCtrl, `Un email a fost trimis la ${email} pentru a completa înregistrarea!`, 5000)
            this.customer = res.customer
            this.customer.userId = res.customer._id
            this.modalCtrl.dismiss(this.customer)
        } else if(res.message === 'This email allrady exist'){
          showToast(this.toastCtrl, 'Acest email există deja în baza de date!' , 5000)
          this.customer = res.customer
          this.customer.userId = res.customer._id
          this.addClientMode = false
        }
      })
  }

}

}
