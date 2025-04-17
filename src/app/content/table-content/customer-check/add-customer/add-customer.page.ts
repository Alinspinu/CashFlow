import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController, NavParams } from '@ionic/angular';
import { CustomerCheckService } from '../customer-check.service';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { Customer } from '../customer-check.page';
import { WebRTCService } from 'src/app/content/webRTC.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddCustomerPage implements OnInit {

    addCustomerForm!: FormGroup;
    voucherForm!: FormGroup;

    voucher: boolean = false

    title:string = 'Adaugă client nou'

    serverKey!: string

    connectionOpen: boolean = false

    customer!: Customer

  constructor(
    @Inject(CustomerCheckService) private customerSrv: CustomerCheckService,
    @Inject(WebRTCService) private socketService: WebRTCService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.setUpVoucherForm()
    this.setUpAddForm()
    this.getMode()
    this.connectToReader()
    this.getCardData()
  }


  getMode(){
    const data = this.navParams.get('options')
    if(data && data.mode){
      this.voucher = true
      this.title = 'Adaugă voucher'
    }
    if(data && data.key){
      this.serverKey = data.key
    }
  }



 
   connectToReader(){
     if(this.serverKey){
       const data = {
         serverKey: this.serverKey,
         action: 'connect',
       }
       this.socketService.connectToReader(JSON.stringify(data))
     }
   }
 
   getCardData(){
     this.socketService.getCardData().subscribe({
       next: (response) => {
         const data = JSON.parse(response)
         if(data.serverKey === this.serverKey && data.action === 'connection-open') this.connectionOpen = true
 
         if(data.serverKey === this.serverKey && data.action === 'card-read'){
           this.addCustomerForm.get('cardCode')?.setValue(data.id)
         }
       },
       error: (error) => {
 
       }
     })
   }

  close(){
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
      cardCode: new FormControl(null, {
        updateOn: 'change',
      }),
    })
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

  addClient(){
    if(this.addCustomerForm.valid){
      const email = this.addCustomerForm.value.email
      const name = this.addCustomerForm.value.name
      const cardIndex = this.addCustomerForm.value.cardCode ? this.addCustomerForm.value.cardCode : 0
        this.customerSrv.createCustomer(name, email, cardIndex).subscribe(res => {
          if(res.message === "All good"){
              showToast(this.toastCtrl, `Un email a fost trimis la ${email} pentru a completa înregistrarea!`, 5000)
              this.customer = res.customer
              this.customer.userId = res.customer._id
              this.modalCtrl.dismiss(this.customer)
            } else if(res.message === 'Acest email există deja în baza de date!' || res.message === "Utilizatorului i s-a adaugat cadrul la cont"){
              showToast(this.toastCtrl, res.message , 3000)
              this.customer = res.customer
              this.customer.userId = res.customer._id
              this.modalCtrl.dismiss(this.customer)
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



}
