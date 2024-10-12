import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

interface log {
  date: string,
  amount: number,
  tip: string,
  workMonth: number
}
interface data{
  name: string
  logs: log[]
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class PaymentsPage implements OnInit {

  avans: log[] = [];
  saleBonus: log[] = [];
  bonus: log[] = [];
  salary: log[] = [];
  userName!: string

  avansTot: number = 0
  saleBonusTot: number = 0
  bonusTot: number = 0
  salaryTot: number = 0


  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const data: data = this.navPar.get('options')
    if(data && data.logs){
      this.userName = data.name
      for(let log of data.logs){
        if(log.tip === 'Avans'){
          this.avans.push(log)
          this.avansTot += log.amount
        }
        if(log.tip === 'Bonus vanzari'){
          this.saleBonus.push(log)
          this.saleBonusTot += log.amount
        }
        if(log.tip === 'Salariu'){
          this.salary.push(log)
          this.salaryTot += log.amount
        }
        if(log.tip === 'Bonus excelenta'){
          this.bonus.push(log)
          this.bonusTot += log.amount
        }
      }
    }
  }

  formatDateInHtml(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}


