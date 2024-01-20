import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-cashback',
  templateUrl: './cashback.page.html',
  styleUrls: ['./cashback.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CashbackPage implements OnInit {

  cashBackForm!: FormGroup
  data!: any

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const data = this.navPar.get('options')
    this.data = data
    this.setUpForm()
  }

  setUpForm(){
    this.cashBackForm = new FormGroup({
      val: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  dismiss(){
    this.modalCtrl.dismiss(null)
  }

  useCashBack(){
    if(this.cashBackForm.valid && this.cashBackForm.value.val <= this.data.total / 1.1){
      this.modalCtrl.dismiss(this.cashBackForm.value.val)
    }else {
      showToast(this.toastCtrl, 'Valoare din cashBack nu trebuie să depăsească 90 % din nota de plata', 3000)
    }
  }

  maxim(){
    const value = this.data.cashBack > this.data.total / 1.1 ? this.data.total / 1.1 : this.data.cashBack
    this.cashBackForm.get('val')?.setValue(value)
  }


}
