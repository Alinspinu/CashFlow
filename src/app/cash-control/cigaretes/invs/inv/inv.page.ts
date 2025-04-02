import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { cigarsInv } from 'src/app/models/inventary.model';
import { emptyCigaretsInv } from 'src/app/models/empty-models';

@Component({
  selector: 'app-inv',
  templateUrl: './inv.page.html',
  styleUrls: ['./inv.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InvPage implements OnInit {

  sheet: cigarsInv = emptyCigaretsInv()

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.getInv()
  }


  getInv(){
    this.sheet = this.navParams.get('options')
  }

  close(){
    this.modalCtrl.dismiss(null)
  }


    formatDate(date: any) {
      return formatedDateToShow(date)
    }

}
