import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ReportsService } from '../reports.service';
import { environment } from 'src/environments/environment';
import { formatedDateToShow } from 'src/app/shared/utils/functions';


@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.page.html',
  styleUrls: ['./add-report.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddReportPage implements OnInit {

  reports: any[] = []
  newReports: any[] = []

  isLoading: boolean = false

  constructor(
    private modalCtrl: ModalController,
    private navPar: NavParams,
    private repSrv: ReportsService,
  ) { }

  ngOnInit() {
    this.reports = this.navPar.get('options')
    console.log(this.newReports.length)
  }


  addReport(){
    const filter = {
      inreg: true,
      unreg: true,
      goods: true,
      prod: true
    }
    const oldDate = new Date(this.reports[this.reports.length - 1].day)
    oldDate.setDate(oldDate.getDate() + 1)
    const date = oldDate.toISOString()
    this.isLoading = true
    this.repSrv.getHavyOrders(date, date, undefined, environment.LOC, filter, 'report').subscribe(response => {
      if(response){
        this.reports.push(response)
        this.newReports.push(response)
        this.isLoading = false
      }
    })

  }

  close(){
    this.modalCtrl.dismiss(null)
  }


  update(){
    this.modalCtrl.dismiss(this.newReports)
  }

  formatDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
  }

}
