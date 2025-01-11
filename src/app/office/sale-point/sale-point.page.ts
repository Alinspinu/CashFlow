import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sale-point',
  templateUrl: './sale-point.page.html',
  styleUrls: ['./sale-point.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SalePointPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
