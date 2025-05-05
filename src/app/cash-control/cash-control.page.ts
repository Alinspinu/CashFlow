import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';



interface payment {
  description: string,
  amount: number
  date: string,
  document: {tip: string, number: string},
  users: string[]
}

@Component({
  selector: 'app-cash-control',
  templateUrl: './cash-control.page.html',
  styleUrls: ['./cash-control.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CashControlPage implements OnInit{

  constructor() { }

  ngOnInit() {
  }


}


