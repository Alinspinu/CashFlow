import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { IonInput } from '@ionic/angular/standalone';
import { PaymentService } from './payment.service';
import { Bill } from 'src/app/models/table.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class PaymentPage implements OnInit {

  @ViewChild('cifInp') cifInp!: IonInput

  total!: number
  tempTotal!: number
  order!: Bill
  button: string = 'ÎNCASEAZĂ'
  disableCancelButton: boolean = false
  disablePayButtons: boolean = false
  disableOnline: boolean = false

  paymentForm!: FormGroup


  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private paySrv: PaymentService
  ) { }


  ngOnInit() {
    this.order = this.navPar.get('options');
    this.total = this.order.total
    if(this.order.payment.online > 0 && this.order.total === 0){
      this.total = this.order.payment.online
    }
    if(this.order.payment.online > 0 && this.order.total > 0){
      this.total = this.order.total + this.order.payment.online
    }


    if(this.order.status === "done"){
      this.button = "SCHIMBĂ METODA DE PLATĂ"
    }
    this.setUpForm()
  }

  setUpForm(){
    this.paymentForm = new FormGroup({
      cash: new FormControl(null, {
        updateOn: 'change',
      }),
      card: new FormControl(null, {
        updateOn: 'change',
      }),
      viva: new FormControl(null, {
        updateOn: 'change',
      }),
      cif: new FormControl(null, {
        updateOn: 'change',
      }),
      online: new FormControl(null, {
        updateOn: 'change',
      }),
    })
    // this.paymentForm.get('online')?.disable()
    // if(this.order.payment.online > 0 && this.order.total === 0){
    //   this.paymentForm.get('online')?.setValue(this.order.payment.online)
    //   this.paymentForm.get('cash')?.disable()
    //   // this.paymentForm.get('card')?.disable()
    //   this.paymentForm.get('viva')?.disable()
    //   // this.paymentForm.get('voucher')?.disable()
    //   this.disablePayButtons = true
    // }
    if(this.order.payment.online > 0 && this.order.total > 0){
      this.paymentForm.get('online')?.setValue(this.order.payment.online)
      this.paymentForm.get('online')?.disable()
      // this.disableOnline = true
    }

  }



  cancel(){
    if(!this.disableCancelButton){
      this.modalCtrl.dismiss(null)
    }
  }

 async cashIn(){
    const posSum = this.paymentForm.value.viva
   if(this.checkTotal()){
    const pay = {
      cash: this.paymentForm.value.cash,
      card: this.paymentForm.value.card,
      viva: posSum,
      cif: this.paymentForm.value.cif,
      online: this.paymentForm.value.online
    }
    if(posSum && posSum > 0){
      this.disableCancelButton = true
      this.paySrv.checkPos(posSum).subscribe(response => {
        if(response){
          if(response.payment){
            showToast(this.toastCtrl, response.message, 2000)
            this.disableCancelButton = false
            return this.modalCtrl.dismiss(pay)
          } else {
            showToast(this.toastCtrl, response.message, 2000)
            this.disableCancelButton = false
            return
          }
        } else {
          showToast(this.toastCtrl, "Eroare de comunicare cu POS-UL", 2000)
          this.disableCancelButton = false
          return
        }
      })
    } else {
      this.modalCtrl.dismiss(pay)
    }
} else {
    showToast(this.toastCtrl, "Valoare încasată trebuie sa fie egală cu nota de plată!", 3000)
   }
  }

  cash(){
      const input  = this.paymentForm.get('cash')
      if(input){
        const value = this.total - this.checkInputs('cash')
        input.setValue(value)
    }
  }
  card(){
      const input  = this.paymentForm.get('card')
      if(input){
        const value = this.total - this.checkInputs('card')
        input.setValue(value)
      }
  }
  viva(){
    const input  = this.paymentForm.get('viva')
    if(input){
      const value = this.total - this.checkInputs('viva')
      input.setValue(value)
    }
  }


  online(){
    const input = this.paymentForm.get('online')
    if(input) {
      const value = this.total - this.checkInputs('online')
      input.setValue(value)
    }
  }

  cif(){
   const input = this.paymentForm.get('cif');
   input?.setValue('RO')
   if (this.cifInp) {
    this.cifInp.setFocus()
  }
  }

  reset(name: string){
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.controls[key];
      if(key === name){
         control.reset()
        }
    });
  }


    checkInputs(name: string){
      let inputsTotal = 0
        Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.controls[key];
        if(key !== name && key !== 'cif'){
            inputsTotal += control.value
          }
      });
      return inputsTotal
    }


    checkTotal(){
      let controlTotal = 0
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.controls[key];
          if(key !=='cif'){
            controlTotal += control.value
          }
      })
      if(controlTotal !== this.total){
        return false
      } else {
        return true
      }
    }

   checkPos(sum: number){
      this.paySrv.checkPos(sum).subscribe(response => {
        if(response){
          if(response.payment){
            showToast(this.toastCtrl, response.message, 2000)
            return true
          } else {
            showToast(this.toastCtrl, response.message, 2000)
            return false
          }
        } else {
          showToast(this.toastCtrl, "Eroare de comunicare cu POS-UL", 2000)
          return false
        }
      })
    }




}

