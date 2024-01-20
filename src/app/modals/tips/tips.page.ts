import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class TipsPage implements OnInit {

  tipsValue!: number

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
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
