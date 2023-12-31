import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import {triggerEscapeKeyPress} from '../../shared/utils/toast-controller'

@Component({
  selector: 'app-pick-option',
  templateUrl: './pick-option.page.html',
  styleUrls: ['./pick-option.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PickOptionPage implements OnInit {

  options!: any[]
  selectedOption!: any;
  selectedO: string[] = []
  sub!: any

  toppingLabel: string[] = []


  constructor(
  private navPar: NavParams,
  private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getOptions()
  }



  getOptions(){
    this.options = this.navPar.get('options');

    this.sub = this.navPar.get('sub')
  }

  onCheckboxChange(option: string) {
    const index = this.selectedO.indexOf(option);

    if (index === -1) {
      this.selectedO.push(option);
    } else {
      this.selectedO.splice(index, 1);
    }
  }

  pick(){
    if(this.selectedOption){
      this.modalCtrl.dismiss(this.selectedOption)
    } else if(this.selectedO.length){
      this.modalCtrl.dismiss(this.selectedO)
    } else {
      triggerEscapeKeyPress()
    }
  }

back(){
  triggerEscapeKeyPress()
}


}
