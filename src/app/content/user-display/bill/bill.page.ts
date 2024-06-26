import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Bill, BillProduct } from 'src/app/models/table.model';
import { round } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BillPage implements OnInit{

@Input() bill!: Bill


  constructor(
  ) { }

  ngOnInit() {
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

  uppercaseAllLetters(inputString: string): string {
    return inputString.replace(/[a-zăâîțș]/gi, (letter) => letter.toUpperCase());
  }

}
