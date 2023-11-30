import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.page.html',
  styleUrls: ['./cash-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CashRegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
