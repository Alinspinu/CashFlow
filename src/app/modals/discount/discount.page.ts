import {  Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  total!: any
  tempTotal!: number
  tva: boolean = false
  valLabel: string = 'Valorică'
  title: string = ''


  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }


  ngOnInit() {
    const options = this.navPar.get('options');
    if(options.nir){
      this.tva = true
      this.valLabel = "Reducere valorică fară TVA"
      this.title = "ADAUGĂ REDUCERE"
    } else {
      this.entryTotal = options
      this.total = this.entryTotal
      this.title  = `${this.total} LEI`

    }
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
      tva: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    })
    if(!this.tva){
      this.discountForm.get('tva')?.setValidators([])
      this.discountForm.get('tva')?.updateValueAndValidity()
    }
  }


  close(){
    this.modalCtrl.dismiss(null)
  }


  onValChange(ev: any){
    let value = ev.detail.value
    value.length ? this.discountForm?.get('procent')?.disable() : this.discountForm?.get('procent')?.enable()
    if(!this.tva){
      if(this.total < this.tempTotal){
        this.total = this.tempTotal
      }
      if(this.tempTotal){
        this.tempTotal = this.total
      }
      const inputVal = this.discountForm.get('val')
      const input = inputVal?.value
      if(this.total && input > this.total){
        if(inputVal ){
          inputVal.setValue(this.total)
          this.total = 0
          return
        }
      }
      this.total = this.tempTotal - input
    }
    console.log(this.total)
  }

  onProcentChange(ev: any){
    let value = ev.detail.value
    value.length ? this.discountForm?.get('val')?.disable() : this.discountForm?.get('val')?.enable()
    if(!this.tva){
      if(this.total < this.tempTotal){
        this.total = this.tempTotal
      }
      if(this.tempTotal){
        this.tempTotal = this.total
      }
      const inputVal = this.discountForm.get('procent')
      const input = inputVal?.value
      if(this.total && input > 100){
        inputVal?.setValue(100)
      }
      this.total = this.tempTotal - (this.tempTotal * (input/100))
    }
  }



  addDiscount(){
    if(this.tva && this.discountForm.valid){
      const valInput = this.discountForm.get('val')?.value
      const procInput = this.discountForm.get('procent')?.value
      const tvaInput = this.discountForm.get('tva')?.value
      if(valInput > 0){
        this.modalCtrl.dismiss({type: 'val', val: valInput, tva: tvaInput})
      }
      if(procInput > 0){
        this.modalCtrl.dismiss({type:'proc', val: procInput, tva: tvaInput})
        }
    } else {
      if((this.entryTotal-this.total) !== 0){
        this.modalCtrl.dismiss(round(this.entryTotal-this.total))
      } else {
        this.modalCtrl.dismiss(null)
      }
    }
  }
}
