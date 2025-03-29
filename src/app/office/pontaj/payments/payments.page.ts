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

  logs: log[] = []
  userName!: string
  userID!: string

  total: number = 0



  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController,
    private pontajService: PontajService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const data: data = this.navPar.get('options')
    console.log(data.logs)
    if(data && data.logs){
      this.userName = data.name
      this.userID = data.userID
      this.logs = data.logs
      this.total = this.logs.reduce((sum, log) => sum + log.amount, 0);
    }
  }


  close(){
    this.modalCtrl.dismiss(null)
  }


  deleteLog(payID: string, userID: string){
    this.pontajService.deletePayLog(payID, userID).subscribe({
      next: (response) => {
        showToast(this.toastCtrl, response.message, 3000)
        const index =  this.logs.findIndex(l => l._id === payID)
        this.total -= this.logs[index].amount
        this.logs.splice(index, 1)
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


