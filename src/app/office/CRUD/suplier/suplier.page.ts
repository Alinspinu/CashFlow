import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Suplier } from './suplier.model';
import { SuplierService } from './suplier.service';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-suplier',
  templateUrl: './suplier.page.html',
  styleUrls: ['./suplier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SuplierPage implements OnInit {

  suplierForm!: FormGroup
  suplier!: Suplier

  constructor(
   @Inject(SuplierService) private suplierSrv: SuplierService,
   private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.setUpForm()

  }


  setUpForm(){
    this.suplierForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      bussinessName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      vatNumber: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      register: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        address: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        VAT: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
        bank: new FormControl(null, {
        updateOn: 'change',
      }),
        account: new FormControl(null, {
        updateOn: 'change',
      }),
    })
  }


  searchSuplier(){
    const vatNumber = this.suplierForm.value.vatNumber
    if(vatNumber){
      this.suplierSrv.getSuplierInfo(vatNumber).subscribe((response: any) => {
        if(response){
          if(response.status === 200){
            this.suplierForm.get('bussinessName')?.setValue(response.data.nume);
            this.suplierForm.get('register')?.setValue(response.data.cod_inmatriculare);
            this.suplierForm.get('address')?.setValue(response.data.adresa);
          } else if(response.status === 402){
            showToast(this.toastCtrl, response.message, 4000)
          }
          }
      }, (err: any) => {
        console.log(err)
      })
    }
  }

  addSuplier(){
    if(this.suplierForm.valid){
      const suplier: Suplier = {
        name: this.suplierForm.value.name,
        bussinessName: this.suplierForm.value.bussinessName,
        vatNumber: this.suplierForm.value.vatNumber,
        register: this.suplierForm.value.register,
        address: this.suplierForm.value.address,
        bank: this.suplierForm.value.bank ? this.suplierForm.value.bank : '',
        account: this.suplierForm.value.account ? this.suplierForm.value.account : '',
        VAT: this.suplierForm.value.VAT === 'yes'? true : false,
      }
      this.suplierSrv.saveSuplier(suplier, false).subscribe((response: any) => {
        if(response){
          showToast(this.toastCtrl, response.message, 400)
          this.suplierForm.reset()
        }
      }, (err: any) =>{
        console.log(err)
        showToast(this.toastCtrl, err.message, 4000)
      })
    }

  }

}
