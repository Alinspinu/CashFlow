import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

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
    if(this.cashBackForm.valid){
      this.modalCtrl.dismiss(this.cashBackForm.value.val)
    }
  }

  maxim(){
    const value = this.data.cashBack > this.data.total ? this.data.total : this.data.cashBack
    this.cashBackForm.get('val')?.setValue(value)
  }


}
