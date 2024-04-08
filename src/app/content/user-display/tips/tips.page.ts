import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { round } from 'src/app/shared/utils/functions';


@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TipsPage implements OnInit {

  @Input() total!: number
  @Output() tipsValue = new EventEmitter<number>();


  sendTips(tipsVal: number) {
    this.tipsValue.emit(tipsVal);
  }

  options: any = [
    {
      precent: 0,
      message: 'Nu e nimic, ne descurcam noi cumva!',
      img: 'assets/icon/happy0.svg'
    },
    {
      precent: 10,
      message: 'Asta este începutul unei prietenii!',
      img: 'assets/icon/happy10.svg'
    },
    {
      precent: 15,
      message: 'Așa mai vii de-acasă!  ...',
      img: 'assets/icon/happy15.svg'
    },
    {
      precent: 20,
      message: 'Dacă ar fi toți ca tine ar fi ceva!',
      img: 'assets/icon/happy20.svg'
    }
  ]


  constructor() { }

  ngOnInit() {
  }


  roundInHtml(num: number){
    return round(num)
  }

}
