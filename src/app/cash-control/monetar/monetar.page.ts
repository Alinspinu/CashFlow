import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-monetar',
  templateUrl: './monetar.page.html',
  styleUrls: ['./monetar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class MonetarPage implements OnInit {

  total: number = 0
  remainingSum: number = 0
  monetaryTotal: number = 0

  monetaryForm!: FormGroup

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getTotal()
    this.setUpForm()
    this.calculateTotal()
  }

  getTotal(){
   const data = this.navPar.get('options')
   this.total = data.total
   this.remainingSum = data.total
  }



  setUpForm(){
    this.monetaryForm = new FormGroup({
      fiveH: new FormControl(null, {
        updateOn: 'change',
      }),
      twoH: new FormControl(null, {
        updateOn: 'change',
      }),
      oneH: new FormControl(null, {
        updateOn: 'change',
      }),
      fiveT: new FormControl(null, {
        updateOn: 'change',
      }),
      ten: new FormControl(null, {
        updateOn: 'change',
      }),
      five: new FormControl(null, {
        updateOn: 'change',
      }),
      one: new FormControl(null, {
        updateOn: 'change',
      }),
      oneByTwo: new FormControl(null, {
        updateOn: 'change',
      }),
    })
    this.monetaryForm.get('fiveH')?.setValue(0)
    this.monetaryForm.get('twoH')?.setValue(0)
    this.monetaryForm.get('oneH')?.setValue(0)
    this.monetaryForm.get('fiveT')?.setValue(0)
    this.monetaryForm.get('ten')?.setValue(0)
    this.monetaryForm.get('five')?.setValue(0)
    this.monetaryForm.get('one')?.setValue(0)
    this.monetaryForm.get('oneByTwo')?.setValue(0)
  }


  save(){
    const monetary = {
      fiveH: this.monetaryForm.value.fiveH,
      twoH: this.monetaryForm.value.twoH,
      oneH: this.monetaryForm.value.oneH,
      fiveT: this.monetaryForm.value.fiveT,
      ten: this.monetaryForm.value.ten,
      five: this.monetaryForm.value.five,
      one: this.monetaryForm.value.one,
      oneByTwo: this.monetaryForm.value.oneByTwo,
      total: this.monetaryTotal
    }
    this.modalCtrl.dismiss(monetary)
  }




  calculateTotal() {
    this.monetaryForm.valueChanges.subscribe(values => {
      const { fiveH, twoH, oneH, fiveT, ten, five, one, oneByTwo } = values;

      this.monetaryTotal = (fiveH * 500) + (twoH * 200) + (oneH * 100) +(fiveT * 50) + (ten * 10) + (five * 5) + (one * 1) + (oneByTwo * 0.5);
      this.remainingSum = this.total - this.monetaryTotal
    });
  }


  close(){
    this.modalCtrl.dismiss(null)
  }

}
