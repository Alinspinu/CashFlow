import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { getDaysInMonth, round } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.page.html',
  styleUrls: ['./hours.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HoursPage implements OnInit {


  firstHous: number = 0
  secondHous: number = 0

  firstCash: number = 0
  secondCash: number = 0

  lastDay: number = 0

  userName!: string

  constructor(
    private navPar: NavParams,
  ) { }

  ngOnInit() {

    const data = this.navPar.get('options')
    if(data){
      this.userName = data.name
     this.lastDay = getDaysInMonth(data.logs[0].checkIn)
      data.logs.forEach((log:any) => {
        const docDate = new Date(log.checkIn);
        if(docDate.getDate() <= 15){
          this.firstHous += log.hours
          this.firstCash += log.earnd
        } else {
          this.secondHous += log.hours
          this.secondCash += log.earnd
        }
      })
    }
  }

roundInHtml(num: number){
  return round(num)
}

}
