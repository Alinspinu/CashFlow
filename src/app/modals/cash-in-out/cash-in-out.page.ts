import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-cash-in-out',
  templateUrl: './cash-in-out.page.html',
  styleUrls: ['./cash-in-out.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CashInOutPage implements OnInit {

  value!: number;
  reason!: string
  options!: any
  title: string = "Adaugă bani în casă"
  button: string = "ADAUGĂ"

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.options = this.navParams.get('options')
    if(this.options === "out"){
      this.title = "Scoate bani din casă";
      this.button = 'SCOATE';
    }
  }


  close(){
    this.modalCtrl.dismiss(null)
  }

  addCash(){
    if(this.value){
      const data = {
        value: this.value,
        // reason: this.reason
      }
      this.modalCtrl.dismiss(data)
    }
    }

}
