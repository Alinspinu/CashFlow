import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { PontajService } from '../pontaj.service';
import { ToastController } from '@ionic/angular/standalone';
import { showToast } from 'src/app/shared/utils/toast-controller';

interface log {
  date: string,
  amount: number,
  tip: string,
  workMonth: number,
  _id: string
}
interface data{
  name: string
  userID: string,
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
  userID!: string

  avansTot: number = 0
  saleBonusTot: number = 0
  bonusTot: number = 0
  salaryTot: number = 0


  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private pontajService: PontajService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const data: data = this.navPar.get('options')
    if(data && data.logs){
      this.userName = data.name
      this.userID = data.userID
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

  deleteLog(payID: string, userID: string, tip: string){
    this.pontajService.deletePayLog(payID, userID).subscribe({
      next: (response) => {
        showToast(this.toastCtrl, response.message, 3000)
        if(tip === 'Avans'){
          const index =  this.avans.findIndex(l => l._id === payID)
          this.avans.splice(index, 1)
          this.avansTot -= this.avans[index].amount
        }
        if(tip ==='Bonus vanzari'){
          const index =  this.saleBonus.findIndex(l => l._id === payID)
          this.saleBonus.splice(index, 1)
          this.saleBonusTot -= this.saleBonus[index].amount
        }
        if(tip === 'Salariu'){
          const index =  this.salary.findIndex(l => l._id === payID)
          this.salary.splice(index, 1)
          this.salaryTot -= this.salary[index].amount
        }
        if(tip === 'Bonus excelenta'){
          const index =  this.bonus.findIndex(l => l._id === payID)
          this.bonus.splice(index, 1)
          this.bonusTot -= this.bonus[index].amount
        }
      },
      error: (error) => {
        showToast(this.toastCtrl, error.message, 4000)
      }
    })
  }

  formatDateInHtml(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}


