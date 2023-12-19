import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Suplier } from '../../../models/suplier.model';
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

  personal!: boolean

  constructor(
   @Inject(SuplierService) private suplierSrv: SuplierService,
   private toastCtrl: ToastController,
   private modalCtrl: ModalController,
   private navPar: NavParams
  ) {}

  ngOnInit() {
    this.setUpForm()
    this.getMode()

  }

  getMode(){
    this.personal = this.navPar.get('sub')
  }

  setUpForm(){
    this.suplierForm = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
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
      console.log('click')
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
      this.suplierSrv.saveSuplier(suplier, this.personal).subscribe((response: any) => {
        if(response){
          showToast(this.toastCtrl, response.message, 400)
          this.suplierForm.reset()
          this.modalCtrl.dismiss(response.suplier)
        }
      }, (err: any) =>{
        console.log(err)
        showToast(this.toastCtrl, err.message, 4000)
      })
    }

  }

}
