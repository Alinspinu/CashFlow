import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { productionReport } from 'src/app/models/inventary.model';
import { roundOne } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-ings',
  templateUrl: './ings.page.html',
  styleUrls: ['./ings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IngsPage implements OnInit {

  productioReport!: productionReport

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.getProductionReport()
  }

  getProductionReport(){
    const report = this.navParams.get('options')
    if(report) this.productioReport = report
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  roundInHtml(num: number){
   return roundOne(num)
  }

}
