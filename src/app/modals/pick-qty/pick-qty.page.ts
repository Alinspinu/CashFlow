import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pick-qty',
  templateUrl: './pick-qty.page.html',
  styleUrls: ['./pick-qty.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class PickQtyPage implements OnInit {

  @ViewChild('ingInputQty') ingQty!: IonInput

  ingredient: {um: string, name: string, hideTop: boolean, hideIng: boolean} = {um: '', name: '', hideTop: false, hideIng: false}
  qty!: number
  mode: string = 'ingredient'
  toppingPrice!: number

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ionViewDidEnter() {
    this.ingQty.setFocus();
  }

  ngOnInit() {
    this.ingredient = this.navParams.get('ing')
   if( this.ingredient.hideIng){
      this.mode = 'topping'
    } else {
      this.mode = 'ingredient'
    }
  }

  enterPress(event: any){

  }

  dismissModal(){
    this.modalCtrl.dismiss(null)
  }

  saveData(){
    const data = {
      qty: this.qty,
      mode: this.mode,
      price: this.toppingPrice ? this.toppingPrice : 0
    }

  this.modalCtrl.dismiss(data)
  }

}
