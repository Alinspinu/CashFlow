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
  cashBackValue: number = 0
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
    const clientTotalCashBack = this.data.cashBack
    const orderTotal = this.data.total
    const formValue = this.cashBackValue
    if(clientTotalCashBack >= formValue && orderTotal >= formValue){
      this.modalCtrl.dismiss(this.cashBackValue)
  } else {
    showToast(this.toastCtrl, 'Valoarea nu poate fi mai mare decât banii adunați sau decât nota de plată!', 3000)
  }
}

  maxim(){
    const value = this.data.cashBack > this.data.total ? this.data.total  : this.data.cashBack
    this.cashBackValue = value
  }


}
