import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-show-paymets',
  templateUrl: './show-paymets.page.html',
  styleUrls: ['./show-paymets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})




export class ShowPaymetsPage implements OnInit {

  payments: any[] = []

  constructor(
    private navPar: NavParams,
  ) { }

  ngOnInit() {
    this.payments = this.navPar.get('options');
  }



}
