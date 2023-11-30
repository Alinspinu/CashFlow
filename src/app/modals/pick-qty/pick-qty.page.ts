import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';

@Component({
  selector: 'app-pick-qty',
  templateUrl: './pick-qty.page.html',
  styleUrls: ['./pick-qty.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class PickQtyPage implements OnInit {

  ingredient: {um: string, name: string} = {um: '', name: ''}
  qty!: number
  mode: string = 'ingredient'
  toppingPrice!: number

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.ingredient = this.navParams.get('ing')
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
