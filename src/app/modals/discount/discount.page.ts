import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DiscountPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
