import {  Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { round } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DiscountPage implements OnInit {

  discountForm!: FormGroup
  entryTotal!: number
  total!: number
  tempTotal!: number


  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }


  ngOnInit() {
    this.entryTotal = this.navPar.get('options');
    this.total = this.entryTotal
    this.setUpForm()
  }

  setUpForm(){
    this.discountForm = new FormGroup({
      val: new FormControl(null, {
        updateOn: 'change',
      }),
      procent: new FormControl(null, {
        updateOn: 'change',
      }),
    });
  }


  close(){
    this.modalCtrl.dismiss(null)
  }


  onValChange(ev: any){
    if(this.total < this.tempTotal){
      this.total = this.tempTotal
    }
    this.tempTotal = this.total
    let value = ev.detail.value
    const inputVal = this.discountForm.get('val')
    const input = inputVal?.value
    value.length ? this.discountForm?.get('procent')?.disable() : this.discountForm?.get('procent')?.enable()
    if(input > this.total){
      if(inputVal ){
        inputVal.setValue(this.total)
        this.total = 0
        return
      }
    }
    this.total = this.tempTotal - input
  }

  onProcentChange(ev: any){
    if(this.total < this.tempTotal){
      this.total = this.tempTotal
    }
    this.tempTotal = this.total
    let value = ev.detail.value
    const inputVal = this.discountForm.get('procent')
    const input = inputVal?.value
    value.length ? this.discountForm?.get('val')?.disable() : this.discountForm?.get('val')?.enable()
    if(input > 100){
      inputVal?.setValue(100)
    }
    this.total = this.tempTotal - (this.tempTotal * (input/100))
  }



  addDiscount(){
    if((this.entryTotal-this.total) !== 0){
      this.modalCtrl.dismiss(round(this.entryTotal-this.total))
    } else {
      this.modalCtrl.dismiss(null)
    }
  }
}
