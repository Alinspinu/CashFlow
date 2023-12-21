import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.page.html',
  styleUrls: ['./order-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OrderViewPage implements OnInit {

  order!: any

  constructor(
    private navPar: NavParams
  ) { }

  close(){
    triggerEscapeKeyPress()
  }

  formatDate(date:any) {
    console.log(date)
    return formatedDateToShow(date)
  }

  ngOnInit() {
    this.order = this.navPar.get('options');
    console.log(this.order)
  }

}
