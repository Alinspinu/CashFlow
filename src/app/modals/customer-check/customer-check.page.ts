import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-customer-check',
  templateUrl: './customer-check.page.html',
  styleUrls: ['./customer-check.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CustomerCheckPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
