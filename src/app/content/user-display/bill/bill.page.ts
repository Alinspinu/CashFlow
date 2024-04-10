import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { round } from 'src/app/shared/utils/functions';
import { WebRTCService } from '../../webRTC.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BillPage implements OnInit {


  bill!: Bill

  constructor(
    private webRTC: WebRTCService
  ) { }

  ngOnInit() {
    this.getBill()

  }


  getBill(){
    this.webRTC.getProductAddedObservable().subscribe(response => {
      if(response){
        this.bill = JSON.parse(response)
       this.bill.products.reverse()
      }
      })
  }


  modifyImageURL(url: string): string {
    const parts = url.split('/v1');
    const baseURL = parts[0];
    const cropParameters = '/w_555,h_555,c_fill';
    const cropUrl = baseURL + cropParameters + '/v1' + parts[1];
    return cropUrl;
  }

  calcProductTotal(products: BillProduct[]){
    let total = 0
    products.forEach(el => {
        total += +el.total
    })
    return total
  }

  roundInHtml(num: number){
    return round(num)
  }

}
