import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { round } from '../../shared/utils/functions';

@Component({
  selector: 'app-dep-view',
  templateUrl: './dep-view.page.html',
  styleUrls: ['./dep-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DepViewPage implements OnInit {

  products!: any[]

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }



  ngOnInit() {
 const prod =  this.navPar.get('options')
   this.products = prod.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
   console.log(this.products)
  }



  close(){
    this.modalCtrl.dismiss()
  }



  roundInHtml(num: number){
    return round(num)
  }
}
