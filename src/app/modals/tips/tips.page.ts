import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class TipsPage implements OnInit {

  tipsValue!: number

  discountMode: boolean = false

  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams
  ) { }

  ngOnInit() {
    this.getMode()
  }

  getMode(){
   const mode = this.navPar.get('options')
  //  console.log(mode)
   if(mode === 'discount'){
    this.discountMode = true
   } else {
    this.discountMode = false
   }
  }




  close(){
    this.modalCtrl.dismiss(null)
  }

  addTips(){
    if(this.tipsValue){
      this.modalCtrl.dismiss(this.tipsValue)
    }
  }
}
